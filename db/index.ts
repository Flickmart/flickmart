import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { adPosts, business } from "./schema";

const client = postgres(process.env.DATABASE_URL!);
export const db = drizzle({ client });

type AdPost = typeof adPosts.$inferInsert;

export async function createAdPost(formValues: AdPost) {
  const newAdPost = await db?.insert(adPosts).values(formValues);
  return newAdPost;
}

