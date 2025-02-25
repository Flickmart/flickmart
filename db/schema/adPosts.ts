import { integer, pgTable, serial, text, varchar } from "drizzle-orm/pg-core";

export const adPosts = pgTable("adPosts", {
  id: serial("id").primaryKey(),
  category: varchar("category", { length: 256 }),
  image: text("image"),
  location: varchar("location", { enum: ["nsukka", "enugu"] }),
  title: text("title"),
  returnable: varchar("returnable", { enum: ["yes", "no"] }),
  condition: varchar("condition", { enum: ["brand new", "used"] }),
  description: text("description"),
  price: varchar("price", { length: 50 }),
  store: varchar("store", { length: 50 }),
  phone: varchar("phone", { length: 50 }),
  plan: varchar("plan", { length: 25, enum: ["basic", "premium", "pro"] }),
});
