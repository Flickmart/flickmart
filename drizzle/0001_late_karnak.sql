CREATE TABLE "business" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"logo" text,
	"location" varchar(50),
	"established_year" integer,
	"description" text
);
--> statement-breakpoint
ALTER TABLE "adPosts" ADD CONSTRAINT "adPosts_phone_unique" UNIQUE("phone");