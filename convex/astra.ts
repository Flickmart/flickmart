import { DataAPIClient } from "@datastax/astra-db-ts";

/**
 * Connects to the DataStax Astra vector database. Requires the
 * `API_ENDPOINT` and `APPLICATION_TOKEN` environment variables (must be set
 * both in Convex's env and, separately, wherever the Next.js app runs).
 */
export function connectToDatabase() {
  const { API_ENDPOINT: endpoint, APPLICATION_TOKEN: token } = process.env;

  if (!token || !endpoint) {
    throw new Error(
      "Environment variables API_ENDPOINT and APPLICATION_TOKEN must be defined.",
    );
  }

  const client = new DataAPIClient();
  return client.db(endpoint, { token });
}

const PRODUCT_LISTINGS_COLLECTION = "product_listings_embeddings";

// biome-ignore lint/suspicious/noExplicitAny: astra-db-ts's Collection generics
// aren't worth fighting for a cached handle reused across warm invocations.
let cachedCollection: any = null;

/**
 * Returns a cached handle to the product-listings vector collection, shared
 * across warm invocations of whichever runtime calls this (a Convex action,
 * the Next.js `/api/vectors` route, or the local ingestion script) instead
 * of reconnecting on every call.
 *
 * Ensures the collection actually exists first via `createCollection`,
 * which Astra treats as a no-op against an existing collection with the
 * same definition (see scripts/data-injest-pipeline.ts). Without this, a
 * plain `db.collection(name)` handle looks valid but every read/write
 * against it 500s until *something* has called createCollection at least
 * once -- previously only the manual backfill script did that, so the
 * automatic per-product sync silently failed on every deploy where nobody
 * had run it yet.
 */
export async function getProductEmbeddingsCollection() {
  if (!cachedCollection) {
    const db = connectToDatabase();
    cachedCollection = await db.createCollection(PRODUCT_LISTINGS_COLLECTION, {
      vector: {
        dimension: 768,
        metric: "cosine",
      },
    });
  }
  return cachedCollection;
}
