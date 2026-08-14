import { GoogleGenAI } from "@google/genai";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import {
  getProductEmbeddingsCollection,
  getStoreEmbeddingsCollection,
} from "@/convex/astra";
import { renderProductChunks, renderStoreChunks } from "@/convex/embeddingTemplate";

// Shared core of the two vector-DB ingestion pipelines. Used by both the
// local CLI scripts (scripts/data-injest-pipeline.ts,
// scripts/store-ingest-pipeline.ts) and the Vercel cron routes
// (app/api/cron/sync-products, app/api/cron/sync-stores) so the actual
// ingestion logic exists in exactly one place.

function getConvexClient() {
  const url = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!url) {
    throw new Error("Missing NEXT_PUBLIC_CONVEX_URL environment variable.");
  }
  return new ConvexHttpClient(url);
}

function getGeminiClient() {
  return new GoogleGenAI({ apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY });
}

async function embed(ai: GoogleGenAI, text: string) {
  return (
    await ai.models.embedContent({
      model: "gemini-embedding-001",
      contents: text,
      config: { outputDimensionality: 768 },
    })
  ).embeddings?.at(0)?.values;
}

export async function ingestAllProducts() {
  const convex = getConvexClient();
  const ai = getGeminiClient();
  const collection = await getProductEmbeddingsCollection();

  const products = await convex.query(api.product.getAll, {});
  console.log("Total number of products:", products.length);

  let syncedChunks = 0;

  for (const product of products) {
    // Clear any previously-ingested chunks for this product first, so
    // re-running this never duplicates embeddings.
    await collection.deleteMany({ productId: product._id });

    const chunks = await renderProductChunks(
      product as unknown as Record<string, unknown>,
    );

    let chunksInserted = 0;
    for (const chunk of chunks) {
      const vector = await embed(ai, chunk);
      if (!vector) {
        console.log(`Skipping chunk with no embedding for product ${product._id}`);
        continue;
      }

      await collection.insertOne({
        $vector: vector,
        text: chunk,
        productId: product._id,
        userId: product.userId,
        businessId: product.businessId,
        title: product.title,
        updatedAt: Date.now(),
      });
      chunksInserted++;
    }

    syncedChunks += chunksInserted;
    console.log(`Synced ${chunksInserted} chunk(s) for product ${product._id}`);
  }

  return { products: products.length, syncedChunks };
}

export async function ingestAllStores() {
  const convex = getConvexClient();
  const ai = getGeminiClient();
  const collection = await getStoreEmbeddingsCollection();

  const stores = await convex.query(api.store.getAllStores, {});
  console.log("Total number of stores:", stores.length);

  let syncedChunks = 0;

  for (const store of stores) {
    // Clear any previously-ingested chunks for this store first, so
    // re-running this never duplicates embeddings.
    await collection.deleteMany({ storeId: store._id });

    const [owner, products] = await Promise.all([
      convex.query(api.users.current, { userId: store.userId }),
      convex.query(api.product.getByUserId, { userId: store.userId }),
    ]);

    const categories = Array.from(
      new Set(products.map((product) => product.category)),
    );

    const storeDoc = {
      _id: store._id,
      _creationTime: store._creationTime,
      name: store.name || "Unnamed Store",
      location: store.location || "Not specified",
      description: store.description || "No description provided.",
      phone: store.phone || "Not provided",
      userId: store.userId,
      ownerName: owner?.name || "Unknown",
      verified: owner?.verified ? "Yes" : "No",
      productCount: products.length,
      categories: categories.length > 0 ? categories.join(", ") : "None yet",
    };

    const chunks = await renderStoreChunks(storeDoc);

    let chunksInserted = 0;
    for (const chunk of chunks) {
      const vector = await embed(ai, chunk);
      if (!vector) {
        console.log(`Skipping chunk with no embedding for store ${store._id}`);
        continue;
      }

      await collection.insertOne({
        $vector: vector,
        text: chunk,
        storeId: store._id,
        userId: store.userId,
        name: storeDoc.name,
        updatedAt: Date.now(),
      });
      chunksInserted++;
    }

    syncedChunks += chunksInserted;
    console.log(
      `Synced ${chunksInserted} chunk(s) for store ${store._id} (${storeDoc.name})`,
    );
  }

  return { stores: stores.length, syncedChunks };
}
