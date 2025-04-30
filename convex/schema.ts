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
    name: v.optional(v.string()),
    location: v.optional(v.string()),
    description: v.optional(v.string()),
    image: v.optional(v.string()),
    userId: v.id("users"),
    phone: v.optional(v.string()),
  }).index("byUserId", ["userId"]),
  product: defineTable({
    userId: v.id("users"),
    title: v.string(),
    description: v.string(),
    images: v.array(v.string()),
    price: v.number(),
    businessId: v.id("store"),
    category: v.string(),
    likes: v.optional(v.number()),
    dislikes: v.optional(v.number()),
    negotiable: v.optional(v.boolean()),
    commentsId: v.optional(v.id("comments")),
    plan: v.union(v.literal("basic"), v.literal("pro"), v.literal("premium")),
    exchange: v.boolean(),
    condition: v.union(v.literal("brand new"), v.literal("used")),
    timeStamp: v.string(),
    location: v.union(v.literal("enugu"), v.literal("nsukka")),
    link: v.optional(v.string()),
    phone: v.string(),
    store: v.string(),
  }),
  comments: defineTable({
    productId: v.id("product"),
    userId: v.id("users"),
    timeStamp: v.string(),
    content: v.string(),
    likes: v.optional(v.number()),
    dislikes: v.optional(v.number()),
  }),

  likes: defineTable({
    productId: v.id("product"),
    userId: v.id("users"),
    timeStamp: v.string(),
    liked: v.boolean(),
    disliked: v.boolean(),
  }),

  bookmarks: defineTable({
    productId: v.id("product"),
    userId: v.id("users"),
    timeStamp: v.string(),
    type: v.union(v.literal("saved"), v.literal("wishlist")),
    added: v.boolean(),
  }),

  conversations: defineTable({
    user1: v.id("users"),
    user2: v.id("users"),
    lastMessageId: v.optional(v.id("message")),
    archivedByUsers: v.optional(v.array(v.id("users"))),
    unreadCount: v.optional(v.record(v.string(), v.number())),
    updatedAt: v.optional(v.number()),
  })
    .index("byUser1Id", ["user1"])
    .index("byUser2Id", ["user2"]),
  message: defineTable({
    senderId: v.id("users"),
    content: v.string(),
    conversationId: v.id("conversations"),
    readByUsers: v.optional(v.array(v.id("users"))),
    file: v.optional(v.array(v.string())),
    images: v.optional(v.array(v.string()))
  }),
  notifications: defineTable({
    title: v.string(),
    userId: v.id("users"),
    type: v.union(
      v.literal("new_message"),
      v.literal("new_like"),
      v.literal("new_comment"),
      v.literal("new_sale"),
      v.literal("new_store"),
      v.literal("advertisement"),
      v.literal("reminder")
    ),
    relatedId: v.optional(
      v.union(
        v.id("product"),
        v.id("message"),
        v.id("comments"),
        v.id("store"),
        v.id("conversations"),
        v.id("users")
      )
    ),
    content: v.string(),
    imageUrl: v.optional(v.string()),
    isRead: v.boolean(),
    timestamp: v.number(),
    link: v.optional(v.string()),
  })
    .index("byUserId", ["userId"])
    .index("byUserIdAndIsRead", ["userId", "isRead"]),

  presence: defineTable({
    userId: v.id("users"),
    status: v.union(v.literal("online"), v.literal("offline")),
    lastUpdated: v.number(),
    isTyping: v.optional(v.boolean()),
    typingInConversation: v.optional(v.id("conversations")),
  })
    .index("byUserId", ["userId"])
    .index("byTypingInConversation", ["typingInConversation"]),
});
