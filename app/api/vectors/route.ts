import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";
import { getProductEmbeddingsCollection } from "@/convex/astra";

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { prompt, sellerId } = await req.json();

    const embeddedPrompt = (
      await ai.models.embedContent({
        model: "gemini-embedding-001",
        contents: prompt,
        config: {
          outputDimensionality: 768,
        },
      })
    ).embeddings?.at(0)?.values;

    if (!embeddedPrompt || embeddedPrompt.length === 0) {
      console.log("Embedding call returned no vector for prompt");
      return NextResponse.json(
        { data: null, status: "error" },
        { status: 502 },
      );
    }

    // Scope the similarity search to the seller being chatted with, so a
    // buyer never gets another seller's product info in their AI answer.
    // Falls back to an unfiltered search only if no sellerId was provided.
    const filter = sellerId ? { userId: sellerId } : {};

    const results = await getProductEmbeddingsCollection()
      .find(filter)
      .sort({ $vector: Array.from(embeddedPrompt) })
      .limit(5)
      .toArray();

    if (process.env.NODE_ENV !== "production") {
      console.log(results);
    }

    return NextResponse.json({ data: results, status: "success" });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ data: null, status: "error" });
  }
}
