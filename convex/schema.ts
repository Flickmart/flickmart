import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    externalId: v.string(),
    name: v.string(),
    imageUrl: v.optional(v.string()),
    email: v.optional(v.string()),
  }).index("byExternalId", ["externalId"]),
  store: defineTable({
    name: v.string(),
    location: v.string(),
    description: v.string(),
    image: v.string(),
    userId: v.string(),
  }),
  product: defineTable({
    userId: v.id("users"),
    title: v.string(),
    description: v.string(),
    images: v.array(v.string()),
    price: v.number(),
    businessId: v.id("business"),
    category: v.optional(v.string()),
    likes: v.number(),
    dislikes: v.number(),
    negotiable: v.optional(v.boolean()),
    // commentsId: v.id("comment"),
    plan: v.union(v.literal("basic"), v.literal("pro"), v.literal("premium")),
    exchange: v.boolean(),
    condition: v.boolean(),
    timeStamp: v.string(),
    location: v.union(v.literal("Enugu"), v.literal("Nsuka")),
    link: v.optional(v.string()),
  }),
  comments: defineTable({
    productId: v.id("product"),
    timeStamp: v.string(),
    content: v.string(),
    likes: v.number(),
    dislikes: v.number(),
  }),

  conversations: defineTable({
    user1: v.id("users"),
    user2: v.id("users"),
    lastMessageId: v.optional(v.id("message")),
  })
    .index("byUser1Id", ["user1"])
    .index("byUser2Id", ["user2"]),
  message: defineTable({
    senderId: v.id("users"),
    content: v.string(),
    conversationId: v.id("conversations"),
  }),
  notifications: defineTable({
    userId: v.id("users"),
    title: v.string(),
    type: v.union(
      v.literal("new_message"),
      v.literal("new_like"),
      v.literal("new_comment"),
      v.literal("new_sale"),
      v.literal("advertisement"),
      v.literal("reminder")
    ),
    relatedId: v.optional(
      v.union(
        v.id("product"),
        v.id("message"),
        v.id("comments"),
        v.id("conversations"),
        v.id("users")
      )
    ),
    content: v.string(),
    imageUrl: v.optional(v.string()),
    isRead: v.boolean(),
    timestamp: v.number(),
    link: v.optional(v.string()),
  }),
});
