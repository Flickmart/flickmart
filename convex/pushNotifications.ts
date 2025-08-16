"use node";

import { action } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";

export const sendPushNotification = action({
  args: {
    userId: v.id("users"),
    title: v.string(),
    body: v.string(),
    data: v.optional(v.any()),
    icon: v.optional(v.string()),
    badge: v.optional(v.string()),
    url: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    console.log(" Sending push notification to user:", args.userId);

    // Get user's push subscription
    const subscription = await ctx.runQuery(api.notifications.getPushSubscription, {
      userId: args.userId,
    });

    if (!subscription) {
      console.log(" No push subscription found for user:", args.userId);
      return false;
    }

    console.log(" Found push subscription for user:", args.userId);

    // Check if user allows notifications
    const user = await ctx.runQuery(api.users.getById, {
      userId: args.userId,
    });

    if (!user?.allowNotifications) {
      console.log(" User has disabled notifications:", args.userId);
      return false;
    }

    console.log("User allows notifications:", args.userId);

    const payload = JSON.stringify({
      title: args.title,
      body: args.body,
      icon: args.icon || "/icon-192x192.png",
      badge: args.badge || "/badge-72x72.png",
      data: {
        ...args.data,
        url: args.url,
        timestamp: Date.now(),
      },
      actions: [
        {
          action: 'view',
          title: 'View',
        },
        {
          action: 'close',
          title: 'Close',
        },
      ],
    });

    try {
      console.log(" Preparing push notification payload:", payload);

      // Import web-push dynamically to avoid issues with server-side rendering
      const webpush = require("web-push");

      // Configure VAPID keys
      webpush.setVapidDetails(
        'mailto:ebukaj665@gmail.com',
        process.env.VAPID_PUBLIC_KEY!,
        process.env.VAPID_PRIVATE_KEY!
      );

      console.log("VAPID keys configured");

      await webpush.sendNotification(
        JSON.parse(subscription.subscription),
        payload
      );

      console.log("✅ Push notification sent successfully");

      // Update last used timestamp
      await ctx.runMutation(api.notifications.updatePushSubscriptionLastUsed, {
        subscriptionId: subscription._id,
      });

      return true;
    } catch (error: any) {
      console.error('Push notification failed:', error);
      console.error('Error details:', {
        statusCode: error.statusCode,
        body: error.body,
        headers: error.headers
      });

      // Remove invalid subscription
      if (error.statusCode === 410 || error.statusCode === 404) {
        console.log("🗑️ Removing invalid subscription");
        await ctx.runMutation(api.notifications.removePushSubscription, {
          subscriptionId: subscription._id,
        });
      }

      return false;
    }
  },
});