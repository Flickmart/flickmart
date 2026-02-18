import { v } from "convex/values";
import { components, internal } from "./_generated/api";
import type { Doc, Id } from "./_generated/dataModel";
import {
  type MutationCtx,
  httpAction,
  mutation,
  query,
} from "./_generated/server";
import { getCurrentUser } from "./users";
import { GoogleGenAI } from "@google/genai";
import {
  PersistentTextStreaming,
  StreamId,
  StreamIdValidator,
} from "@convex-dev/persistent-text-streaming";
import { cors } from "./http";
import { systemPrompt } from "./system";

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

const pts = new PersistentTextStreaming(components.persistentTextStreaming);

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
  },
) {
  // Check if there's already an unread message notification from this conversation
  const existingNotification = await ctx.db
    .query("notifications")
    .withIndex("byUserId", (q) => q.eq("userId", recipientId))
    .filter((q) =>
      q.and(
        q.eq(q.field("type"), "new_message"),
        q.eq(q.field("isRead"), false),
        q.eq(q.field("relatedId"), conversationId),
      ),
    )
    .first();

  // Get the current unread count from the conversation
  const conversation = await ctx.db.get(conversationId);
  const unreadCount = conversation?.unreadCount?.[recipientId] || 1;

  if (existingNotification) {
    // Update the existing notification with new count and latest timestamp
    // Keep the original content (first unread message) but update the title with new count
    const titleText =
      unreadCount === 1
        ? `You received 1 new message from ${senderName}`
        : `You received ${unreadCount} new messages from ${senderName}`;

    await ctx.db.patch(existingNotification._id, {
      title: titleText,
      timestamp,
      content: `You received ${unreadCount} new messages from ${senderName}`,
      isViewed: false, // Reset viewed status so it shows in unread count again
    });
  } else {
    // Get the first unread message content for this conversation
    // Find the oldest unread message from the sender to this recipient
    const unreadMessages = await ctx.db
      .query("message")
      .filter((q) =>
        q.and(
          q.eq(q.field("conversationId"), conversationId),
          q.eq(q.field("senderId"), senderId),
        ),
      )
      .collect();

    // Filter messages that haven't been read by the recipient
    const actuallyUnreadMessages = unreadMessages.filter(
      (msg) => !msg.readByUsers?.includes(recipientId),
    );

    // Get the first unread message (oldest)
    const firstUnreadMessage = actuallyUnreadMessages.sort(
      (a, b) => (a._creationTime || 0) - (b._creationTime || 0),
    )[0];

    // Use the first unread message content, or fallback to current message
    const firstMessageContent =
      firstUnreadMessage?.content || messageContent || "New message";

    // Create a new notification with the first unread message content
    const titleText =
      unreadCount === 1
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
    productId: v.id("product"),
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
            q.eq(q.field("user2"), args.user2Id),
          ),
          q.and(
            q.eq(q.field("user1"), args.user2Id),
            q.eq(q.field("user2"), args.user1Id),
          ),
        ),
      )
      .first();
    if (existingConversation) {
      // If the conversation was archived, unarchive it for the current user
      if (existingConversation.archivedByUsers?.includes(args.user1Id)) {
        const updatedArchivedUsers =
          existingConversation.archivedByUsers.filter(
            (id) => id !== args.user1Id,
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
      products: [args.productId],
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
    type: v.optional(
      v.union(
        v.literal("text"),
        v.literal("product"),
        v.literal("escrow"),
        v.literal("transfer"),
      ),
    ),
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

    // Get userId from product
    const productId = conversation.products?.at(0);

    const product = productId ? await ctx.db.get(productId) : null;

    if (recipientId === product?.userId) {
      // We are sure atp that recipient is seller, Check if seller is online/offline
      const status = await ctx.runQuery(internal.presence.onlineStatus, {
        userId: recipientId,
      });
      if (!status.isOnline) {
        // Activate AI
        const streamId = await pts.createStream(ctx);

        // Create Empty AI Message
        const messageId = await ctx.db.insert("message", {
          senderId: recipientId,
          content: "",
          conversationId: args.conversationId,
          streamId,
          type: "ai",
          readByUsers: [recipientId],
        });

        return messageId;
      }
    }

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
          (id) => id !== args.senderId && id !== recipientId,
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

    // Send Notification Email (non-blocking). Guarded in email module for API key.
    if (receiver?.allowNotifications) {
      try {
        // Fire-and-forget: do not block message sending on email issues
        // No await on purpose; Convex mutations can't spawn background tasks,
        // so we catch and ignore errors if the call fails quickly.

        ctx.runMutation(internal.email.sendEmailNotification, {
          username: sender?.name ?? "A customer",
          subject: "You have a new chat message",
          recipient: receiver?.email as string,
          ctaLink: `https://flickmart.app/chat/${args.conversationId}`,
          messagePreview: args.content || "",
        });
      } catch (_) {
        // Ignore email errors; chat message already persisted
      }
    }

    return messageId;
  },
});

// Create a query that returns the chat body.
export const getChatBody = query({
  args: {
    streamId: StreamIdValidator,
  },
  handler: async (ctx, args) => {
    const response = await pts.getStreamBody(ctx, args.streamId as StreamId);
    return response;
  },
});

// Create a query that returns the stream id
export const getStreamIdByMessageId = query({
  args: {
    messageId: v.optional(v.id("message")),
  },
  handler: async (ctx, args) => {
    if (!args.messageId) return;

    const message = await ctx.db.get(args.messageId);
    return message?.streamId;
  },
});

// Update AI message Record
export const updateAIRecord = mutation({
  args: {
    messageId: v.id("message"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.messageId, {
      content: args.content,
    });

    return { status: 200, message: "Updated successfully..." };
  },
});

// Send request using http actions for ai to start generating response
export const streamAIResponse = httpAction(async (ctx, request) => {
  try {
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: cors(request),
      });
    }
    const { searchParams } = new URL(request.url);
    const prompt = searchParams.get("prompt");
    const streamId = searchParams.get("streamId");
    const storeName = searchParams.get("storeName");

    if (!prompt || !streamId) {
      return new Response("Missing prompt or streamId", {
        status: 400,
        headers: cors(request),
      });
    }

    const response = await pts.stream(
      ctx,
      request,
      streamId as StreamId,
      async (ctx, req, id, append) => {
        const aiResponse = await ai.models.generateContentStream({
          model: "gemini-2.5-flash",
          contents: `${systemPrompt.replace("{Company Name}", storeName as string)} User Prompt: ${prompt}`,
        });
        for await (const chunk of aiResponse) {
          const text = chunk.text;
          if (text) {
            await append(text);
          }
        }
      },
    );

    return new Response(response.body, {
      status: response.status,
      headers: {
        ...cors(request),
        ...response.headers,
      },
    });
  } catch (err) {
    console.log(err);
    return new Response("Error", {
      headers: cors(request),
      status: 500,
    });
  }
});

// export const runAISalesAssistant = internalAction({
//   args: { content: v.string() },
//   handler: async (ctx, args) => {
//     const response = await ai.models.generateContent({
//       model: "gemini-3-pro",
//       contents: args.content,
//     });

//     console.log(response.text);

//     return response;
//   },
// });

// export const insertAIResponse = internalMutation({
//   args: {
//     senderId: v.id("users"),
//     content: v.string(),
//     conversationId: v.id("conversations"),
//     type: v.union(
//       v.literal("text"),
//       v.literal("product"),
//       v.literal("escrow"),
//       v.literal("transfer"),
//     ),
//   },
//   handler: async (ctx, args) => {
//     // Insert Response from AI into Convex DB
//     const messageId = await ctx.db.insert("message", {
//       senderId: args.senderId,
//       content: args.content,
//       conversationId: args.conversationId,
//       readByUsers: [args.senderId], // The sender has read their own message
//       type: args.type,
//     });
//   },
// });

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
          q.neq(q.field("senderId"), args.userId),
        ),
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
          q.eq(q.field("relatedId"), args.conversationId),
        ),
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
      (id) => id !== args.userId,
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

    // Use existing indexes to efficiently fetch conversations
    // Get conversations where user is user1
    const conversationsAsUser1 = await ctx.db
      .query("conversations")
      .withIndex("byUser1Id", (q) => q.eq("user1", args.userId))
      .collect();

    // Get conversations where user is user2
    const conversationsAsUser2 = await ctx.db
      .query("conversations")
      .withIndex("byUser2Id", (q) => q.eq("user2", args.userId))
      .collect();

    // Combine and deduplicate conversations
    const allConversations = [...conversationsAsUser1, ...conversationsAsUser2];

    // Remove duplicates (shouldn't happen but safety check)
    const uniqueConversations = allConversations.filter(
      (conversation, index, self) =>
        index === self.findIndex((c) => c._id === conversation._id),
    );

    // Sort conversations by updatedAt (most recent message) in descending order
    return uniqueConversations.sort(
      (a, b) => (b.updatedAt || 0) - (a.updatedAt || 0),
    );
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
      .withIndex("by_conversationId", (q) =>
        q.eq("conversationId", args.conversationId),
      )
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
      }),
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
    const allMessages: Doc<"message">[] = [];

    // Process each conversation separately to avoid using .in() which is not available
    for (const conversationId of args.conversationIds) {
      const messages = await ctx.db
        .query("message")
        .withIndex("by_conversationId", (q) =>
          q.eq("conversationId", conversationId),
        )
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
      }),
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
        args.messageIds.map((messageId) => ctx.db.delete(messageId)),
      );
      return { success: true };
    } catch {
      return { success: false };
    }
  },
});
