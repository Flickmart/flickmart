import { integer, pgTable, serial, text, varchar } from "drizzle-orm/pg-core";



export const users = pgTable("users", {
  id: serial("id").primaryKey().notNull(),
  name: text("name"),
  email: text("email").unique(),
  businessId: integer("business_id").references(()=> business.id),
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
    userId: integer("user_id").references(():any => users.id).notNull(),
    name: text("name").notNull() ,
    logo: text("logo"),
    location:  varchar("location", { length: 50 }),
    establishedYear: integer("established_year"),
    description: text("description"),
  });