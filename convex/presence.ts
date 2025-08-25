import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

// Update user presence status (online and typing)
export const updatePresence = mutation({
  args: {
    userId: v.id('users'),
    status: v.union(v.literal('online'), v.literal('offline')),
    isTyping: v.boolean(),
    typingInConversation: v.optional(v.id('conversations')),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthorized');
    }

    const existingPresence = await ctx.db
      .query('presence')
      .filter((q) => q.eq(q.field('userId'), args.userId))
      .first();

    if (existingPresence) {
      await ctx.db.patch(existingPresence._id, {
        status: args.status,
        lastUpdated: Date.now(),
        isTyping: args.isTyping,
        typingInConversation: args.typingInConversation,
      });
      return existingPresence._id;
    }
    const presenceId = await ctx.db.insert('presence', {
      userId: args.userId,
      status: args.status,
      lastUpdated: Date.now(),
      isTyping: args.isTyping,
      typingInConversation: args.typingInConversation,
    });
    return presenceId;
  },
});

// Update user typing status
export const updateTypingStatus = mutation({
  args: {
    userId: v.id('users'),
    isTyping: v.boolean(),
    conversationId: v.optional(v.id('conversations')),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthorized');
    }

    const existingPresence = await ctx.db
      .query('presence')
      .filter((q) => q.eq(q.field('userId'), args.userId))
      .first();

    if (existingPresence) {
      await ctx.db.patch(existingPresence._id, {
        isTyping: args.isTyping,
        typingInConversation: args.isTyping ? args.conversationId : undefined,
        lastUpdated: Date.now(),
      });
      return existingPresence._id;
    }
    const presenceId = await ctx.db.insert('presence', {
      userId: args.userId,
      status: 'online',
      lastUpdated: Date.now(),
      isTyping: args.isTyping,
      typingInConversation: args.isTyping ? args.conversationId : undefined,
    });
    return presenceId;
  },
});

// Send a heartbeat to maintain online status
export const heartbeat = mutation({
  args: {
    userId: v.id('users'),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthorized');
    }

    const existingPresence = await ctx.db
      .query('presence')
      .filter((q) => q.eq(q.field('userId'), args.userId))
      .first();

    if (existingPresence) {
      await ctx.db.patch(existingPresence._id, {
        lastUpdated: Date.now(),
        status: 'online',
      });
      return existingPresence._id;
    }
    const presenceId = await ctx.db.insert('presence', {
      userId: args.userId,
      status: 'online',
      lastUpdated: Date.now(),
      isTyping: false,
    });
    return presenceId;
  },
});

// Get presence information for a specific user
export const getUserPresence = query({
  args: {
    userId: v.id('users'),
  },
  handler: async (ctx, args) => {
    const presence = await ctx.db
      .query('presence')
      .filter((q) => q.eq(q.field('userId'), args.userId))
      .first();

    if (!presence) {
      return {
        status: 'offline',
        isTyping: false,
        lastUpdated: 0,
      };
    }

    // Check if the user is online based on the last update time
    // Consider them offline if no update in the last 10 seconds
    const isOnline = Date.now() - presence.lastUpdated < 10_000;

    return {
      ...presence,
      status: isOnline ? presence.status : 'offline',
    };
  },
});

// Get presence information for a conversation (both participants)
export const getConversationPresence = query({
  args: {
    conversationId: v.id('conversations'),
  },
  handler: async (ctx, args) => {
    const conversation = await ctx.db.get(args.conversationId);
    if (!conversation) {
      throw new Error('Conversation not found');
    }

    const user1Presence = await ctx.db
      .query('presence')
      .filter((q) => q.eq(q.field('userId'), conversation.user1))
      .first();

    const user2Presence = await ctx.db
      .query('presence')
      .filter((q) => q.eq(q.field('userId'), conversation.user2))
      .first();

    const currentTime = Date.now();
    const onlineThreshold = 10_000; // 10 seconds

    return {
      user1: {
        userId: conversation.user1,
        status:
          user1Presence &&
          currentTime - user1Presence.lastUpdated < onlineThreshold
            ? user1Presence.status
            : 'offline',
        isTyping:
          user1Presence?.isTyping &&
          user1Presence.typingInConversation === args.conversationId &&
          currentTime - user1Presence.lastUpdated < 5000, // Typing status is even more short-lived
        lastUpdated: user1Presence?.lastUpdated || 0,
      },
      user2: {
        userId: conversation.user2,
        status:
          user2Presence &&
          currentTime - user2Presence.lastUpdated < onlineThreshold
            ? user2Presence.status
            : 'offline',
        isTyping:
          user2Presence?.isTyping &&
          user2Presence.typingInConversation === args.conversationId &&
          currentTime - user2Presence.lastUpdated < 5000,
        lastUpdated: user2Presence?.lastUpdated || 0,
      },
    };
  },
});
