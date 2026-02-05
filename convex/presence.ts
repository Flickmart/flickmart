import { Presence } from "@convex-dev/presence";
import { v } from "convex/values";
import { components } from "./_generated/api";
import { mutation, query } from "./_generated/server";
import { getCurrentUserOrThrow } from "./users";

export const presence = new Presence(components.presence);

// App-wide presence management
export const heartbeat = mutation({
  args: {
    roomId: v.string(),
    userId: v.string(),
    sessionId: v.string(),
    interval: v.number(),
  },
  handler: async (ctx, { roomId, userId, sessionId, interval }) => {
    const user = await getCurrentUserOrThrow(ctx);
    if (userId !== user?._id) {
      throw new Error("Cannot send heartbeat for other users");
    }

    return await presence.heartbeat(ctx, roomId, userId, sessionId, interval);
  },
});

export const list = query({
  args: { roomToken: v.string() },
  handler: async (ctx, { roomToken }) => {
    return await presence.list(ctx, roomToken);
  },
});

export const disconnect = mutation({
  args: { sessionToken: v.string() },
  handler: async (ctx, { sessionToken }) => {
    return await presence.disconnect(ctx, sessionToken);
  },
});

// Typing indicators (keeping custom implementation for conversation-specific typing)
export const updateTypingStatus = mutation({
  args: {
    userId: v.id("users"),
    isTyping: v.boolean(),
    conversationId: v.optional(v.id("conversations")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const existingPresence = await ctx.db
      .query("presence")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .first();

    if (existingPresence) {
      await ctx.db.patch(existingPresence._id, {
        isTyping: args.isTyping,
        typingInConversation: args.isTyping ? args.conversationId : undefined,
        lastUpdated: Date.now(),
        status: "online",
      });
      return existingPresence._id;
    }
    const presenceId = await ctx.db.insert("presence", {
      userId: args.userId,
      isTyping: args.isTyping,
      typingInConversation: args.isTyping ? args.conversationId : undefined,
      lastUpdated: Date.now(),
      status: "online",
    });
    return presenceId;
  },
});

// Get typing status for a conversation
export const getConversationTypingStatus = query({
  args: {
    conversationId: v.id("conversations"),
  },
  handler: async (ctx, args) => {
    const conversation = await ctx.db.get(args.conversationId);
    if (!conversation) {
      throw new Error("Conversation not found");
    }

    const user1Presence = await ctx.db
      .query("presence")
      .filter((q) => q.eq(q.field("userId"), conversation.user1))
      .first();

    const user2Presence = await ctx.db
      .query("presence")
      .filter((q) => q.eq(q.field("userId"), conversation.user2))
      .first();

    const currentTime = Date.now();
    const typingThreshold = 5000; // 5 seconds

    return {
      user1: {
        userId: conversation.user1,
        isTyping:
          user1Presence?.isTyping &&
          user1Presence.typingInConversation === args.conversationId &&
          currentTime - user1Presence.lastUpdated < typingThreshold,
      },
      user2: {
        userId: conversation.user2,
        isTyping:
          user2Presence?.isTyping &&
          user2Presence.typingInConversation === args.conversationId &&
          currentTime - user2Presence.lastUpdated < typingThreshold,
      },
    };
  },
});

// Get user's online status (for profile pages)
export const getUserOnlineStatus = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    try {
      // Get the user to find their external ID (Clerk ID)
      const user = await ctx.db.get(args.userId);
      if (!user) {
        return { isOnline: false, lastSeen: 0 };
      }

      // Check if user is in the app-wide room using their external ID
      const appPresence = await presence.listRoom(ctx, "app-wide");

      // Check if the user's external ID (Clerk ID) is in the presence list
      const isOnline = appPresence.some(
        (p) => p.userId === user._id && p.online === true
      );

      return {
        isOnline,
        lastSeen: isOnline ? Date.now() : 0,
      };
    } catch (error) {
      console.error("Error getting user online status:", error);
      return { isOnline: false, lastSeen: 0 };
    }
  },
});
