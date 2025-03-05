import {
  integer,
  pgTable,
  serial,
  text,
  varchar,
  boolean,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const users = pgTable("users", {
  id: serial("id").primaryKey().notNull(),
  name: text("name"),
  email: text("email").unique(),
  businessId: integer("business_id").references(() => business.id),
  profileImage: text("profile_image"),
  phone: varchar("phone", { length: 50 }).unique(),
});

export const adPosts = pgTable("adPosts", {
  id: serial("id").primaryKey().notNull(),
  category: varchar("category", { length: 256 }),
  image: text("image"),
  location: varchar("location", { enum: ["nsukka", "enugu"] }),
  title: text("title"),
  returnable: varchar("returnable", { enum: ["yes", "no"] }),
  condition: varchar("condition", { enum: ["brand new", "used"] }),
  description: text("description"),
  price: varchar("price", { length: 50 }),
  store: varchar("store", { length: 50 }),
  phone: varchar("phone", { length: 50 }).unique(),
  plan: varchar("plan", { length: 25, enum: ["basic", "premium", "pro"] }),
});

export const business = pgTable("business", {
  id: serial("id").primaryKey().notNull(),
  userId: integer("user_id")
    .references((): any => users.id)
    .notNull(),
  name: text("name").notNull(),
  logo: text("logo"),
  location: varchar("location", { length: 50 }),
  description: text("description"),
});

export const chats = pgTable("chats", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),

  sender: integer("sender_id")
    .notNull()
    .references(() => users.id),
  receiver: integer("receiver_id")
    .notNull()
    .references(() => users.id),
  message: text("message").notNull(),
  time: timestamp("time", { mode: "string" }).notNull().defaultNow(),
  isRead: boolean("is_read").notNull().default(false),
});
