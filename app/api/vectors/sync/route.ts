import { GoogleGenAI } from "@google/genai";
import { ConvexHttpClient } from "convex/browser";
import { NextRequest, NextResponse } from "next/server";
import { api } from "@/convex/_generated/api";
import { getProductEmbeddingsCollection } from "@/convex/astra";
import { renderProductChunks } from "@/convex/embeddingTemplate";

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

function getConvexClient() {
  const url = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!url) {
    throw new Error("Missing NEXT_PUBLIC_CONVEX_URL");
  }
  return new ConvexHttpClient(url);
}

// Re-embeds a single product and replaces its chunks in the vector DB.
// Triggered by convex/embeddings.ts's syncProductEmbedding action, which is
// scheduled from convex/product.ts's create/update mutations.
export async function POST(req: NextRequest) {
  try {
    const { productId } = await req.json();
    if (!productId) {
      return NextResponse.json(
        { status: "error", error: "Missing productId" },
        { status: 400 },
      );
    }

    const convex = getConvexClient();
    const product = await convex.query(api.product.getById, { productId });
    if (!product) {
      return NextResponse.json(
        { status: "error", error: "Product not found" },
        { status: 404 },
      );
    }

    const collection = getProductEmbeddingsCollection();

    // Clear any previous chunks for this product first so edits/re-syncs
    // never accumulate duplicates.
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
          "Skipping chunk with no embedding for product",
          product._id,
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

    return NextResponse.json({ status: "success", chunks: chunks.length });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ status: "error" }, { status: 500 });
  }
}
