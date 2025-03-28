import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    externalId: v.string(),
    name: v.string(),
  }).index("byExternalId", ["externalId"]),
  business: defineTable({
    name: v.string(),
    location: v.string(),
    description: v.string(),
    image: v.string(),
    userId: v.string(),
  }),
  product: defineTable({
    name: v.string(),
    description: v.string(),
    images: v.array(v.string()),
    price: v.number(),
    businessId: v.id("business"),
    category: v.string(),
    likes: v.number(),
    dislikes: v.number(),
    commentsId: v.id("comment"),
    userId: v.string(),
    exchangePossible: v.boolean(),
    isNew: v.boolean(),
    location: v.union(v.literal("Enugu"), v.literal("Nsuka")),
  }),
  comments: defineTable({
    comment: v.string(),
    userId: v.string(),
    productId: v.id("product"),
  }),
  order: defineTable({
    productId: v.id("product"),
    quantity: v.number(),
    totalPrice: v.number(),
    status: v.string(),
    userId: v.string(),
  }),
  review: defineTable({
    productId: v.id("product"),
    rating: v.number(),
    comment: v.string(),
    userId: v.string(),
  }),

  wishlist: defineTable({
    productId: v.id("product"),
    userId: v.string(),
  }),
  cart: defineTable({
    productId: v.id("product"),
    quantity: v.number(),
    userId: v.string(),
  }),
  notification: defineTable({
    message: v.string(),
    userId: v.id("users"),
  }),
});
