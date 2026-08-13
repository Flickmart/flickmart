import "dotenv/config";
import { api } from "@/convex/_generated/api";
import { connectToDatabase } from "@/convex/astra";
import { renderProductChunks } from "@/convex/embeddingTemplate";
import { ConvexHttpClient } from "convex/browser";
import { GoogleGenAI } from "@google/genai";
import type { Collection, Db, FoundDoc, SomeDoc } from "@datastax/astra-db-ts";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

if (!convexUrl) {
  throw Error("Missing Environment Variable");
}

const convex = new ConvexHttpClient(convexUrl);

// Creates the vector collection if it doesn't already exist. Safe to call
// repeatedly -- Astra treats this as a no-op against an existing collection
// with the same definition.
async function ensureCollection(
  database: Db,
): Promise<Collection<SomeDoc, FoundDoc<SomeDoc>>> {
  const collection = await database.createCollection(
    "product_listings_embeddings",
    {
      vector: {
        dimension: 768,
        metric: "cosine",
      },
    },
  );

  console.log(`Using collection ${collection.keyspace}.${collection.name}`);
  return collection;
}

async function main() {
  console.log("Running ingestion pipeline (idempotent backfill/rebuild)...");

  const database = connectToDatabase();
  const collection = await ensureCollection(database);

  const products = await convex.query(api.product.getAll, {});
  console.log("Total number of products:", products.length);

  for (const product of products) {
    // Clear any previously-ingested chunks for this product first, so
    // re-running this script never duplicates embeddings.
    await collection.deleteMany({ productId: product._id });

    const chunks = await renderProductChunks(
      product as unknown as Record<string, unknown>,
    );

    for (const chunk of chunks) {
      const vector = (
        await ai.models.embedContent({
          model: "gemini-embedding-001",
          contents: chunk,
          config: {
            outputDimensionality: 768,
          },
        })
      ).embeddings?.at(0)?.values;

      if (!vector) {
        console.log(
          `Skipping chunk with no embedding for product ${product._id}`,
        );
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
    }

    console.log(`Synced ${chunks.length} chunk(s) for product ${product._id}`);
  }

  console.log("Ingestion complete");
}

main();
