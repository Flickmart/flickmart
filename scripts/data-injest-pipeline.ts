import "dotenv/config";
import { api } from "@/convex/_generated/api";
import { ConvexHttpClient } from "convex/browser";
import { readFile } from "node:fs";
import path from "node:path";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import ollama from "ollama";
import {
  Collection,
  DataAPIClient,
  Db,
  FoundDoc,
  SomeDoc,
} from "@datastax/astra-db-ts";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;

if (!convexUrl) {
  throw Error("Missing Environment Variable");
}

const convex = new ConvexHttpClient(convexUrl);

/**
 * Connects to a DataStax Astra database.
 * This function retrieves the database endpoint and application token from the
 * environment variables `API_ENDPOINT` and `APPLICATION_TOKEN`.
 *
 * @returns An instance of the connected database.
 * @throws Will throw an error if the environment variables
 * `API_ENDPOINT` or `APPLICATION_TOKEN` are not defined.
 */
export function connectToDatabase(): Db {
  const { API_ENDPOINT: endpoint, APPLICATION_TOKEN: token } = process.env;

  if (!token || !endpoint) {
    throw new Error(
      "Environment variables API_ENDPOINT and APPLICATION_TOKEN must be defined."
    );
  }

  // Create an instance of the `DataAPIClient` class
  const client = new DataAPIClient();

  // Get the database specified by your endpoint and provide the token
  const database = client.db(endpoint, { token });

  console.log(`Connected to database ${database.id}`);

  return database;
}

// Create Collection
async function createCollection(
  database: Db
): Promise<Collection<SomeDoc, FoundDoc<SomeDoc>>> {
  const collection = await database.createCollection(
    "product_listings_embeddings",
    {
      vector: {
        dimension: 768,
        metric: "cosine",
      },
    }
  );

  console.log(`Created collection ${collection.keyspace}.${collection.name}`);
  return collection;
}

async function main() {
  console.log("Running Injestion Pipeline...");
  //   Connect to Database
  const database = connectToDatabase();

  // Create Database Collection
  const collection = await createCollection(database);

  // Fetch all product data from convex
  const products = (await convex.query(api.product.getAll, {})).slice(0);

  const templatePath = path.join(__dirname, "..", "templates", "products.md");

  //   Get Document Template
  console.log("Reading template data...");
  readFile(templatePath, "utf-8", async (err, data) => {
    if (err) throw Error(err.message);

    for (const product of products) {
      // Replace all placeholders with required data
      let document = data;
      const productKeys = Object.keys(product);

      for (const key of productKeys) {
        const value = String(product[key as keyof typeof product]);

        // Convert True/False to yes/no and date string to local date string to give AI more context
        const conditionedValue =
          value === "true" || value === "false"
            ? value === "true"
              ? "Yes"
              : "No"
            : key === "timeStamp"
              ? new Date(value).toLocaleString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                  hour12: true,
                })
              : key === "images"
                ? value.split(",").join("\n- ")
                : value;
        document = document.replaceAll(`{{${key}}}`, conditionedValue);
      }

      const splitter = new RecursiveCharacterTextSplitter({
        separators: ["## "], // split by Markdown headings
        chunkSize: 512, // adjust based on your needs
        chunkOverlap: 60,
      });
      const chunks = await splitter.splitText(document);

      for (const chunk of chunks) {
        // Get embeddings using Ollama
        const vector = (
          await ollama.embed({
            model: "embeddinggemma:latest",
            input: chunk,
            dimensions: 768,
          })
        ).embeddings.at(0);

        // Insert Embeddings Directly into Vector DB
        const res = await collection.insertOne({
          $vector: vector,
          text: chunk,
        });
        console.log(res);
      }
    }
    console.log("Ingestion complete");
  });
}

main();
