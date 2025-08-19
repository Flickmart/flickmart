import { query, mutation, MutationCtx } from "./_generated/server";
import { v } from "convex/values";
import { getCurrentUser } from "./users";
import { internal } from "./_generated/api";
import { Id } from "./_generated/dataModel";

// Helper function to handle consolidated message notifications
async function handleMessageNotification(
  ctx: MutationCtx,
  {
    recipientId,
    senderId,
    conversationId,
    messageContent,
    senderName,
    senderImageUrl,
    timestamp,
  }: {
    recipientId: Id<"users">;
    senderId: Id<"users">;
    conversationId: Id<"conversations">;
    messageContent: string;
    senderName: string;
    senderImageUrl?: string;
    timestamp: number;
  }
) {
  // Check if there's already an unread message notification from this conversation
  const existingNotification = await ctx.db
    .query("notifications")
    .withIndex("byUserId", (q) => q.eq("userId", recipientId))
    .filter((q: any) =>
      q.and(
        q.eq(q.field("type"), "new_message"),
        q.eq(q.field("isRead"), false),
        q.eq(q.field("relatedId"), conversationId)
      )
    )
    .first();

  // Get the current unread count from the conversation
  const conversation = await ctx.db.get(conversationId);
  const unreadCount = conversation?.unreadCount?.[recipientId] || 1;

  if (existingNotification) {
    // Update the existing notification with new count and latest timestamp
    // Keep the original content (first unread message) but update the title with new count
    const titleText = unreadCount === 1
      ? `You received 1 new message from ${senderName}`
      : `You received ${unreadCount} new messages from ${senderName}`;

    await ctx.db.patch(existingNotification._id, {
      title: titleText,
      timestamp: timestamp,
      content: `You received ${unreadCount} new messages from ${senderName}`,
      isViewed: false, // Reset viewed status so it shows in unread count again
    });
  } else {
    // Get the first unread message content for this conversation
    // Find the oldest unread message from the sender to this recipient
    const unreadMessages = await ctx.db
      .query("message")
      .filter((q: any) =>
        q.and(
          q.eq(q.field("conversationId"), conversationId),
          q.eq(q.field("senderId"), senderId)
        )
      )
      .collect();

    // Filter messages that haven't been read by the recipient
    const actuallyUnreadMessages = unreadMessages.filter(
      (msg: any) => !msg.readByUsers?.includes(recipientId)
    );

    // Get the first unread message (oldest)
    const firstUnreadMessage = actuallyUnreadMessages.sort((a: any, b: any) =>
      (a._creationTime || 0) - (b._creationTime || 0)
    )[0];

    // Use the first unread message content, or fallback to current message
    const firstMessageContent = firstUnreadMessage?.content || messageContent || "New message";

    // Create a new notification with the first unread message content
    const titleText = unreadCount === 1
      ? `You received 1 new message from ${senderName}`
      : `You received ${unreadCount} new messages from ${senderName}`;

    await ctx.runMutation(internal.notifications.createNotificationWithPush, {
      userId: recipientId,
      type: "new_message",
      relatedId: conversationId, // Use conversationId for consolidation
      title: titleText,
      content: firstMessageContent, // This will be the first unread message
      imageUrl: senderImageUrl,
      link: `/chat/${conversationId}`,
      sendPush: true,
    });
  }
}

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
    type: v.optional(v.union(v.literal("text"), v.literal("product"), v.literal("escrow"), v.literal("transfer"))),
    productId: v.optional(v.id("product")),
    price: v.optional(v.number()),
    title: v.optional(v.string()),
    productImage: v.optional(v.string()),
    // Transfer-specific fields
    orderId: v.optional(v.id("orders")),
    transferAmount: v.optional(v.number()),
    currency: v.optional(v.string()),
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
      // Transfer-specific fields
      orderId: args.orderId,
      transferAmount: args.transferAmount,
      currency: args.currency,
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

    // Handle consolidated message notifications
    await handleMessageNotification(ctx, {
      recipientId,
      senderId: args.senderId,
      conversationId: args.conversationId,
      messageContent: args.content || "",
      senderName: sender?.name || "Someone",
      senderImageUrl: sender?.imageUrl,
      timestamp: now,
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

    // Clear the consolidated message notification for this conversation
    const messageNotification = await ctx.db
      .query("notifications")
      .withIndex("byUserId", (q) => q.eq("userId", args.userId))
      .filter((q) =>
        q.and(
          q.eq(q.field("type"), "new_message"),
          q.eq(q.field("isRead"), false),
          q.eq(q.field("relatedId"), args.conversationId)
        )
      )
      .first();

    if (messageNotification) {
      await ctx.db.patch(messageNotification._id, {
        isRead: true,
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
        if (message.type === "transfer" && message.orderId) {
          const order = await ctx.db.get(message.orderId);
          return { ...message, order };
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
        if (message.type === "transfer" && message.orderId) {
          const order = await ctx.db.get(message.orderId);
          return { ...message, order };
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
