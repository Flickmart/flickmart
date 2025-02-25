import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

async function main() {
  if (typeof process.env.DATABASE_URL === "string") {
    const client = postgres(process.env.DATABASE_URL);
    const database = drizzle({ client });

    return database;
  }
}

// Note after creating your schema file, add the path to the drizzle config file
// After creating table, run these commands for migration,
// Generate SQL- npx drizzle-kit generate
// Migrate- npx drizzle-kit migrate

// Interact with db with this - Insert, Select, Update, Delete
const db = main();
