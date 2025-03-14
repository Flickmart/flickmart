import { users } from "../schema";
import { db } from "@/db";

export async function fetchUsers() {
  const allUsers = await db.select().from(users);
  return allUsers;
}
