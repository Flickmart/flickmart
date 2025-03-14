import { and, eq, or } from "drizzle-orm";
import { chats } from "@/db/schema";
import { db } from "@/db";

export async function getChats(sender: number, receiver: number) {
  return await db
    .select()
    .from(chats)
    .where(
      or(
        and(eq(chats.sender, sender), eq(chats.receiver, receiver)),
        and(eq(chats.sender, receiver), eq(chats.receiver, sender))
      )
    );
}
