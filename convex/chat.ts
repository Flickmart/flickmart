import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getCurrentUser } from "./users";
import { internal } from "./_generated/api";

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
      // If the conversation was archived, unarchive it for the current user
      if (existingConversation.archivedByUsers?.includes(args.user1Id)) {
        const updatedArchivedUsers =
          existingConversation.archivedByUsers.filter(
            (id) => id !== args.user1Id
          );

        await ctx.db.patch(existingConversation._id, {
          archivedByUsers: updatedArchivedUsers,
        });
      }
      return existingConversation._id;
    }

    // Initialize unreadCount object with 0 for both users
    const unreadCount: Record<string, number> = {};
    unreadCount[args.user1Id] = 0;
    unreadCount[args.user2Id] = 0;

    const conversationId = await ctx.db.insert("conversations", {
      user1: args.user1Id,
      user2: args.user2Id,
      lastMessageId: undefined,
      archivedByUsers: [],
      unreadCount,
      updatedAt: Date.now(),
    });
    return conversationId;
  },
});

export const sendMessage = mutation({
  args: {
    senderId: v.id("users"),
    content: v.optional(v.string()),
    conversationId: v.id("conversations"),
    images: v.optional(v.array(v.string())),
    type: v.optional(v.union(v.literal("text"), v.literal("product"))),
    productId: v.optional(v.id("product")),
    price: v.optional(v.number()),
    title: v.optional(v.string()),
    productImage: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    // Get the conversation to find the recipient and update unread count
    const conversation = await ctx.db.get(args.conversationId);
    if (!conversation) {
      throw new Error("Conversation not found");
    }

    // Get current timestamp
    const now = Date.now();
    // await ctx.runMutation(internal.email.sendTestEmail)

    // Create the message with the sender already marked as having read it
    const messageId = await ctx.db.insert("message", {
      senderId: args.senderId,
      content: args.content,
      images: args.images || [],
      conversationId: args.conversationId,
      readByUsers: [args.senderId], // The sender has read their own message
      type: args.type,
      productId: args.productId,
      title: args.title,
      price: args.price,
      productImage: args.productImage,
    });

    // Determine the recipient
    const recipientId =
      conversation.user1 === args.senderId
        ? conversation.user2
        : conversation.user1;

    // Update the conversation with the last message ID and increment unread count
    const unreadCount: Record<string, number> = conversation.unreadCount
      ? { ...conversation.unreadCount }
      : {};

    // Increment unread count for recipient
    unreadCount[recipientId] = (unreadCount[recipientId] || 0) + 1;

    // Update conversation
    await ctx.db.patch(args.conversationId, {
      lastMessageId: messageId,
      unreadCount,
      updatedAt: now,
      // If this conversation was archived by any users, unarchive it
      archivedByUsers:
        conversation.archivedByUsers?.filter(
          (id) => id !== args.senderId && id !== recipientId
        ) || [],
    });

    const sender = await ctx.db.get(args.senderId);
    const receiver = await ctx.db.get(recipientId);

    // Create notification for the recipient
    await ctx.db.insert("notifications", {
      userId: recipientId,
      type: "new_message",
      relatedId: messageId,
      title: `${sender?.name || "Someone"} sent you a message`,
      content: args.content || "",
      imageUrl: sender?.imageUrl,
      isRead: false,
      timestamp: now,
      link: `/chat/${args.conversationId}`,
    });


    // Send Notification Email to Recipient if recipient has email notifications enabled
    if (receiver?.allowNotifications) {
      await ctx.runMutation(internal.email.sendEmailNotification, {
        username: sender?.name ?? "A customer",
        subject: "You have a new chat message",
        recipient: receiver?.email as string,
        ctaLink: `https://flickmart.app/chat/${args.conversationId}`,
        messagePreview: args.content || "",
      });
    }

    return messageId;
  },
});

export const markMessagesAsRead = mutation({
  args: {
    userId: v.id("users"),
    conversationId: v.id("conversations"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    // Get all unread messages in this conversation for this user
    const messages = await ctx.db
      .query("message")
      .filter((q) =>
        q.and(
          q.eq(q.field("conversationId"), args.conversationId),
          q.neq(q.field("senderId"), args.userId)
        )
      )
      .collect();

    // Update each message to mark it as read
    for (const message of messages) {
      const readByUsers = message.readByUsers || [];
      if (!readByUsers.includes(args.userId)) {
        await ctx.db.patch(message._id, {
          readByUsers: [...readByUsers, args.userId],
        });
      }
    }

    // Reset unread count for this user in the conversation
    const conversation = await ctx.db.get(args.conversationId);
    if (conversation) {
      const unreadCount: Record<string, number> = conversation.unreadCount
        ? { ...conversation.unreadCount }
        : {};
      unreadCount[args.userId] = 0;

      await ctx.db.patch(args.conversationId, {
        unreadCount,
      });
    }

    return { success: true, readCount: messages.length };
  },
});

export const archiveConversation = mutation({
  args: {
    userId: v.id("users"),
    conversationId: v.id("conversations"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const conversation = await ctx.db.get(args.conversationId);
    if (!conversation) {
      throw new Error("Conversation not found");
    }

    // Add this user to the archivedByUsers array if not already there
    const archivedByUsers = conversation.archivedByUsers || [];
    if (!archivedByUsers.includes(args.userId)) {
      await ctx.db.patch(args.conversationId, {
        archivedByUsers: [...archivedByUsers, args.userId],
      });
    }

    return { success: true };
  },
});

export const unarchiveConversation = mutation({
  args: {
    userId: v.id("users"),
    conversationId: v.id("conversations"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const conversation = await ctx.db.get(args.conversationId);
    if (!conversation) {
      throw new Error("Conversation not found");
    }

    // Remove this user from the archivedByUsers array
    const archivedByUsers = (conversation.archivedByUsers || []).filter(
      (id) => id !== args.userId
    );

    await ctx.db.patch(args.conversationId, {
      archivedByUsers,
    });

    return { success: true };
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
    
    // Sort conversations by updatedAt (most recent message) in descending order
    return conversations.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
  },
});

export const getConversation = query({
  args: {
    conversationId: v.id("conversations"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const conversation = await ctx.db.get(args.conversationId);
    if (!conversation) {
      throw new Error("Conversation not found");
    }

    return conversation;
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

    const messagesWithProducts = await Promise.all(
      messages.map(async (message) => {
        if (message.type === "product" && message.productId) {
          const product = await ctx.db.get(message.productId);
          return { ...message, product };
        }
        return message;
      })
    );

    return messagesWithProducts;
  },
});

export const getAllConversationsMessages = query({
  args: {
    conversationIds: v.array(v.id("conversations")),
  },
  handler: async (ctx, args) => {
    if (args.conversationIds.length === 0) {
      return [];
    }

    // Get all messages for all the specified conversations
    const allMessages = [];

    // Process each conversation separately to avoid using .in() which is not available
    for (const conversationId of args.conversationIds) {
      const messages = await ctx.db
        .query("message")
        .filter((q) => q.eq(q.field("conversationId"), conversationId))
        .collect();

      allMessages.push(...messages);
    }

    const messagesWithProducts = await Promise.all(
      allMessages.map(async (message) => {
        if (message.type === "product" && message.productId) {
          const product = await ctx.db.get(message.productId);
          return { ...message, product };
        }
        return message;
      })
    );

    return messagesWithProducts;
  },
});

export const editMessage = mutation({
  args: {
    messageId: v.id("message"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const user = await getCurrentUser(ctx);

    if (!user) {
      throw new Error("User not found");
    }

    const message = await ctx.db.get(args.messageId);
    if (!message) {
      throw new Error("Message not found");
    }

    await ctx.db.patch(args.messageId, {
      content: args.content,
    });
  },
});

export const deleteMessages = mutation({
  args: {
    messageIds: v.array(v.id("message")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    try {
      await Promise.all(
        args.messageIds.map((messageId) => ctx.db.delete(messageId))
      );
      return { success: true };
    } catch (error) {
      return { success: false };
    }
  },
});
