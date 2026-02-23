import { DataAPIClient, Db } from "@datastax/astra-db-ts";
import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

// DataStax Vector DB Client
function connectToDatabase(): Db {
  const { API_ENDPOINT: endpoint, APPLICATION_TOKEN: token } = process.env;

  if (!token || !endpoint) {
    throw new Error(
      "Environment variables API_ENDPOINT and APPLICATION_TOKEN must be defined.",
    );
  }

  // Create an instance of the `DataAPIClient` class
  const client = new DataAPIClient();

  // Get the database specified by your endpoint and provide the token
  const database = client.db(endpoint, { token });

  console.log(`Connected to database ${database.id}`);

  return database;
}

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();

    // Connect to Vector DB
    const database = connectToDatabase();

    // Embed Prompt
    const embeddedPrompt = (
      await ai.models.embedContent({
        model: "gemini-embedding-001",
        contents: prompt,
        config: {
          outputDimensionality: 768,
        },
      })
    ).embeddings?.at(0)?.values;

    // Use Embedded Vector to Query DataStax Vector db
    const results = await database
      .collection("product_listings_embeddings")
      .find({})
      .sort({ $vector: Array.from(embeddedPrompt ?? []) })
      .limit(5)
      .toArray();

    console.log(results);

    return NextResponse.json({ data: results, status: "success" });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ data: null, status: "error" });
  }
}
