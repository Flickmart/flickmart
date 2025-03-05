import { sql } from "drizzle-orm";
import {
  boolean,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { profiles } from "./profiles";

export const chats = pgTable("chats", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),

  sender: integer("sender_id")
    .notNull()
    .references(() => profiles.id),
  receiver: integer("receiver_id")
    .notNull()
    .references(() => profiles.id),
  message: text("message").notNull(),
  time: timestamp("time", { mode: "string" }).notNull().defaultNow(),
  isRead: boolean("is_read").notNull().default(false),
});
