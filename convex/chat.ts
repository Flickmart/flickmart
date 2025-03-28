import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const startConversation = mutation({
  args: {
    user1Id: v.id("users"),
    user2Id: v.id("users"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }
    const existingConversation = await ctx.db
      .query("conversations")
      .filter((q) =>
        q.or(
          q.and(
            q.eq(q.field("user1"), args.user1Id),
            q.eq(q.field("user2"), args.user2Id)
          ),
          q.and(
            q.eq(q.field("user1"), args.user2Id),
            q.eq(q.field("user2"), args.user1Id)
          )
        )
      )
      .first();
    if (existingConversation) {
      return existingConversation._id;
    }
    const conversationId = await ctx.db.insert("conversations", {
      user1: args.user1Id,
      user2: args.user2Id,
      lastMessageId: undefined,
    });
    return conversationId;
  },
});

export const sendMessage = mutation({
  args: {
    senderId: v.id("users"),
    content: v.string(),
    conversationId: v.id("conversations"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }
    const messageId = await ctx.db.insert("message", {
      senderId: args.senderId,
      content: args.content,
      conversationId: args.conversationId,
    });
    await ctx.db.patch(args.conversationId, {
      lastMessageId: messageId,
    });

    const conversation = await ctx.db.get(args.conversationId);
    if (!conversation) {
      throw new Error("Conversation not found");
    }

    const reciverId =
      conversation.user1 === args.senderId
        ? conversation.user2
        : conversation.user1;

    const sender = await ctx.db.get(args.senderId);

    await ctx.db.insert("notifications", {
      userId: reciverId,
      type: "new_message",
      relatedId: messageId,
      title: `${sender?.name} sent you a message`,
      content: args.content,
      imageUrl: sender?.imageUrl,
      isRead: false,
      timestamp: Date.now(),
      link: `/conversations/${args.conversationId}`,
    });

    return messageId;
  },
});

export const getConversations = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }
    const conversations = await ctx.db
      .query("conversations")
      .filter((q) =>
        q.or(
          q.eq(q.field("user1"), args.userId),
          q.eq(q.field("user2"), args.userId)
        )
      )
      .collect();
    return conversations;
  },
});

export const getMessages = query({
  args: {
    conversationId: v.id("conversations"),
  },
  handler: async (ctx, args) => {
    const messages = await ctx.db
      .query("message")
      .filter((q) => q.eq(q.field("conversationId"), args.conversationId))
      .collect();
    return messages;
  },
});
