CREATE TABLE "adPosts" (
	"id" serial PRIMARY KEY NOT NULL,
	"category" varchar(256),
	"image" text,
	"location" varchar,
	"title" text,
	"returnable" varchar,
	"condition" varchar,
	"description" text,
	"price" varchar(50),
	"store" varchar(50),
	"phone" varchar(50),
	"plan" varchar(25)
);
