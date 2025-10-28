import { v } from "convex/values";
import { api } from "./_generated/api";
import { internalMutation, mutation, query } from "./_generated/server";
import { getCurrentUser } from "./users";

export const createNotification = internalMutation({
  args: {
    userId: v.optional(v.id("users")),
    type: v.union(
      v.literal("new_message"),
      v.literal("new_like"),
      v.literal("new_comment"),
      v.literal("new_sale"),
      v.literal("advertisement"),
      v.literal("reminder"),
      v.literal("escrow_funded"),
      v.literal("escrow_released"),
      v.literal("completion_confirmed"),
    ),
    relatedId: v.optional(
      v.union(
        v.id("product"),
        v.id("message"),
        v.id("comments"),
        v.id("store"),
        v.id("conversations"),
        v.id("orders"),
        v.id("users"),
      ),
    ),
    title: v.string(),
    content: v.string(),
    imageUrl: v.optional(v.string()),
    isRead: v.optional(v.boolean()),
    timestamp: v.optional(v.number()),
    link: v.optional(v.string()),
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

    const notificationId = await ctx.db.insert("notifications", {
      userId: args.userId ? args.userId : user._id,
      type: args.type,
      title: args.title,
      relatedId: args.relatedId,
      content: args.content,
      imageUrl: args.imageUrl,
      isRead: false,
      isViewed: false, // New notifications are not viewed initially
      timestamp: Date.now(),
      link: args.link,
    });

    return notificationId;
  },
});

export const deleteNotification = mutation({
  args: {
    notificationId: v.id("notifications"),
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

    await ctx.db.delete(args.notificationId);
  },
});

export const getNotifications = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const user = await getCurrentUser(ctx);

    if (!user) {
      return [];
    }

    const notifications = await ctx.db
      .query("notifications")
      .withIndex("byUserId", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();

    return notifications;
  },
});

export const updateNotification = mutation({
  args: {
    notificationId: v.id("notifications"),
    isRead: v.optional(v.boolean()),
    link: v.optional(v.string()),
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

    // Create a patch object with only the fields that are provided
    const patchObj: Record<string, any> = {};
    if (args.isRead !== undefined) {
      patchObj.isRead = args.isRead;
    }
    if (args.link !== undefined) {
      patchObj.link = args.link;
    }

    // Only apply the patch if there are fields to update
    if (Object.keys(patchObj).length > 0) {
      await ctx.db.patch(args.notificationId, patchObj);
    }
  },
});

export const getUnreadNotifications = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    const user = await getCurrentUser(ctx);
    if (!user) {
      return [];
    }

    // Get all notifications for the user and filter for unviewed ones
    // This handles both isViewed: false and isViewed: undefined (for existing notifications)
    const notifications = await ctx.db
      .query("notifications")
      .withIndex("byUserId", (q) => q.eq("userId", user._id))
      .filter((q) =>
        q.or(
          q.eq(q.field("isViewed"), false),
          q.eq(q.field("isViewed"), undefined),
        ),
      )
      .collect();

    return notifications;
  },
});

export const markAllNotificationsAsRead = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const user = await getCurrentUser(ctx);

    if (!user) {
      throw new Error("User not found");
    }

    const notifications = await ctx.db
      .query("notifications")
      .withIndex("byUserId", (q) => q.eq("userId", user._id))
      .collect();

    for (const notification of notifications) {
      await ctx.db.patch(notification._id, {
        isRead: true,
      });
    }

    return true;
  },
});

export const deleteAllNotifications = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const user = await getCurrentUser(ctx);

    if (!user) {
      throw new Error("User not found");
    }

    const notifications = await ctx.db
      .query("notifications")
      .withIndex("byUserId", (q) => q.eq("userId", user._id))
      .collect();

    for (const notification of notifications) {
      await ctx.db.delete(notification._id);
    }

    return true;
  },
});

export const getNotificationById = query({
  args: {
    notificationId: v.id("notifications"),
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

    const notification = await ctx.db
      .query("notifications")
      .withIndex("byUserId", (q) => q.eq("userId", user._id))
      .filter((q) => q.eq(q.field("_id"), args.notificationId))
      .first();

    return notification;
  },
});

export const getUnreadNotificationsByReadStatus = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    const user = await getCurrentUser(ctx);
    if (!user) {
      return [];
    }

    // Get notifications that are actually unread (based on isRead field)
    // This is used for the "Unread" tab in the notifications page
    const notifications = await ctx.db
      .query("notifications")
      .withIndex("byUserIdAndIsRead", (q) =>
        q.eq("userId", user._id).eq("isRead", false),
      )
      .collect();

    return notifications;
  },
});

export const markAllNotificationsAsViewed = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const user = await getCurrentUser(ctx);

    if (!user) {
      throw new Error("User not found");
    }

    // Mark all notifications as viewed (for count purposes) but not read
    // Only update notifications that are not already viewed
    const notifications = await ctx.db
      .query("notifications")
      .withIndex("byUserId", (q) => q.eq("userId", user._id))
      .filter((q) =>
        q.or(
          q.eq(q.field("isViewed"), false),
          q.eq(q.field("isViewed"), undefined),
        ),
      )
      .collect();

    for (const notification of notifications) {
      await ctx.db.patch(notification._id, {
        isViewed: true,
      });
    }

    return true;
  },
});
// Push notification functions
export const savePushSubscription = mutation({
  args: {
    subscription: v.string(),
    userAgent: v.optional(v.string()),
    deviceInfo: v.optional(
      v.object({
        platform: v.optional(v.string()),
        browser: v.optional(v.string()),
        deviceType: v.optional(v.string()),
      }),
    ),
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

    // Parse subscription to get endpoint
    let subscriptionData;
    try {
      subscriptionData = JSON.parse(args.subscription);
    } catch (error) {
      throw new Error("Invalid subscription format");
    }

    const endpoint = subscriptionData.endpoint;
    if (!endpoint) {
      throw new Error("Subscription missing endpoint");
    }

    // Check if this exact subscription already exists for this user
    const existing = await ctx.db
      .query("pushSubscriptions")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .filter((q) => q.eq(q.field("endpoint"), endpoint))
      .first();

    if (existing) {
      // Update existing subscription with new data
      await ctx.db.patch(existing._id, {
        subscription: args.subscription,
        userAgent: args.userAgent,
        deviceInfo: args.deviceInfo,
        lastUsed: Date.now(),
        isActive: true,
      });
      return { subscriptionId: existing._id, isNew: false };
    }

    // Save new subscription
    const subscriptionId = await ctx.db.insert("pushSubscriptions", {
      userId: user._id,
      subscription: args.subscription,
      endpoint,
      userAgent: args.userAgent,
      deviceInfo: args.deviceInfo,
      createdAt: Date.now(),
      lastUsed: Date.now(),
      isActive: true,
    });

    return { subscriptionId, isNew: true };
  },
});

export const getPushSubscription = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const subscription = await ctx.db
      .query("pushSubscriptions")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .filter((q) => q.eq(q.field("isActive"), true))
      .first();

    return subscription;
  },
});

export const getAllPushSubscriptions = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const subscriptions = await ctx.db
      .query("pushSubscriptions")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();

    return subscriptions;
  },
});

export const getCurrentDeviceSubscription = query({
  args: {
    endpoint: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    const user = await getCurrentUser(ctx);
    if (!user) {
      return null;
    }

    // Validate endpoint argument
    if (!args.endpoint) {
      console.warn(
        "getCurrentDeviceSubscription: endpoint argument is required",
      );
      return null;
    }

    // Use by_user index and filter by endpoint to find the specific device subscription
    const subscription = await ctx.db
      .query("pushSubscriptions")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .filter((q) =>
        q.and(
          q.eq(q.field("endpoint"), args.endpoint),
          q.eq(q.field("isActive"), true),
        ),
      )
      .first();

    return subscription;
  },
});

export const removePushSubscription = mutation({
  args: {
    subscriptionId: v.id("pushSubscriptions"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.subscriptionId);
  },
});

export const removePushSubscriptionByEndpoint = mutation({
  args: {
    endpoint: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      throw new Error("User not authenticated");
    }

    // Find the subscription by endpoint for this user
    const subscription = await ctx.db
      .query("pushSubscriptions")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .filter((q) => q.eq(q.field("endpoint"), args.endpoint))
      .first();

    if (!subscription) {
      throw new Error("Subscription not found");
    }

    // Mark as inactive instead of deleting to maintain history
    await ctx.db.patch(subscription._id, {
      isActive: false,
      lastUsed: Date.now(),
    });

    return { success: true };
  },
});

export const cleanupInactiveSubscriptions = mutation({
  args: {
    olderThanDays: v.optional(v.number()),
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

    const cutoffTime =
      Date.now() - (args.olderThanDays || 30) * 24 * 60 * 60 * 1000;

    const inactiveSubscriptions = await ctx.db
      .query("pushSubscriptions")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .filter((q) =>
        q.and(
          q.eq(q.field("isActive"), false),
          q.lt(q.field("lastUsed"), cutoffTime),
        ),
      )
      .collect();

    for (const subscription of inactiveSubscriptions) {
      await ctx.db.delete(subscription._id);
    }

    return { cleaned: inactiveSubscriptions.length };
  },
});

export const updatePushSubscriptionLastUsed = mutation({
  args: {
    subscriptionId: v.id("pushSubscriptions"),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.subscriptionId, {
      lastUsed: Date.now(),
    });
  },
});

// Enhanced notification creation that also sends push notifications
export const createNotificationWithPush = internalMutation({
  args: {
    userId: v.id("users"),
    type: v.union(
      v.literal("new_message"),
      v.literal("new_like"),
      v.literal("new_comment"),
      v.literal("new_sale"),
      v.literal("advertisement"),
      v.literal("reminder"),
      v.literal("escrow_funded"),
      v.literal("escrow_released"),
      v.literal("completion_confirmed"),
    ),
    relatedId: v.optional(
      v.union(
        v.id("product"),
        v.id("message"),
        v.id("comments"),
        v.id("store"),
        v.id("conversations"),
        v.id("orders"),
        v.id("users"),
      ),
    ),
    title: v.string(),
    content: v.string(),
    imageUrl: v.optional(v.string()),
    link: v.optional(v.string()),
    sendPush: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    // Create the notification
    const notificationId = await ctx.db.insert("notifications", {
      userId: args.userId,
      type: args.type,
      title: args.title,
      relatedId: args.relatedId,
      content: args.content,
      imageUrl: args.imageUrl,
      isRead: false,
      isViewed: false,
      timestamp: Date.now(),
      link: args.link,
    });

    // Send push notification if requested
    if (args.sendPush !== false) {
      await ctx.scheduler.runAfter(
        0,
        api.pushNotifications.sendPushNotification,
        {
          userId: args.userId,
          title: args.title,
          body: args.content,
          icon: args.imageUrl,
          url: args.link,
          data: {
            notificationId,
            type: args.type,
            relatedId: args.relatedId,
          },
        },
      );
    }

    return notificationId;
  },
});

// Public version for testing (development only)
export const createTestNotificationWithPush = mutation({
  args: {
    type: v.union(
      v.literal("new_message"),
      v.literal("new_like"),
      v.literal("new_comment"),
      v.literal("new_sale"),
      v.literal("advertisement"),
      v.literal("reminder"),
      v.literal("escrow_funded"),
      v.literal("escrow_released"),
      v.literal("completion_confirmed"),
    ),
    title: v.string(),
    content: v.string(),
    link: v.optional(v.string()),
    sendPush: v.optional(v.boolean()),
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

    // Create the notification
    const notificationId = await ctx.db.insert("notifications", {
      userId: user._id,
      type: args.type,
      title: args.title,
      content: args.content,
      isRead: false,
      isViewed: false,
      timestamp: Date.now(),
      link: args.link,
    });

    // Send push notification if requested
    if (args.sendPush !== false) {
      await ctx.scheduler.runAfter(
        0,
        api.pushNotifications.sendPushNotification,
        {
          userId: user._id,
          title: args.title,
          body: args.content,
          url: args.link,
          data: {
            notificationId,
            type: args.type,
          },
        },
      );
    }

    return notificationId;
  },
});
