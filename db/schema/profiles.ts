import { pgTable, serial, varchar } from "drizzle-orm/pg-core";

export const profiles = pgTable("profiles", {
  id: serial("id").primaryKey(),
  firstName: varchar("first_name", { length: 50 }),
  lastName: varchar("last_name", { length: 50 }),
  userName: varchar("username"),
  location: varchar("location"),
  sex: varchar("sex"),
});
