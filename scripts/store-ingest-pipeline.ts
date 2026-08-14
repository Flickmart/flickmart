import "dotenv/config";
import { ingestAllStores } from "@/lib/vectorIngestion";

// Thin CLI wrapper -- the actual ingestion logic lives in
// lib/vectorIngestion.ts, shared with app/api/cron/sync-stores (the Vercel
// cron job that keeps this running automatically). Safe to re-run: deletes
// each store's previous chunks before re-inserting.
async function main() {
  console.log("Running store ingestion pipeline (idempotent backfill/rebuild)...");
  await ingestAllStores();
  console.log("Store ingestion complete");
}

main();
