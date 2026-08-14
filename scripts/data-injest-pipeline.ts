import "dotenv/config";
import { ingestAllProducts } from "@/lib/vectorIngestion";

// Thin CLI wrapper -- the actual ingestion logic lives in
// lib/vectorIngestion.ts, shared with app/api/cron/sync-products (the
// Vercel cron job that keeps this running automatically). Safe to re-run:
// deletes each product's previous chunks before re-inserting.
async function main() {
  console.log("Running ingestion pipeline (idempotent backfill/rebuild)...");
  await ingestAllProducts();
  console.log("Ingestion complete");
}

main();
