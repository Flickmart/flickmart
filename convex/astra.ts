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
 */
export function getProductEmbeddingsCollection() {
  if (!cachedCollection) {
    const db = connectToDatabase();
    cachedCollection = db.collection(PRODUCT_LISTINGS_COLLECTION);
  }
  return cachedCollection;
}
