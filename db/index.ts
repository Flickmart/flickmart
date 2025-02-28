import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { adPosts } from "./schema/adPosts";

export async function main() {
  if (typeof process.env.DATABASE_URL === "string") {
    const client = postgres(process.env.DATABASE_URL);
    const database = drizzle({ client });

    return database;
  }
}

const db = await main();

type AdPost = typeof adPosts.$inferInsert;

export async function createAdPost(formValues: AdPost) {
  const newAdPost = await db?.insert(adPosts).values(formValues);
  return newAdPost;
}
