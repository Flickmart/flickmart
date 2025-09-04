"use node";

import { v } from "convex/values";
import { api } from "./_generated/api";
import { action } from "./_generated/server";

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
  handler: async (
    ctx,
    args
  ): Promise<{
    success: boolean;
    sent: number;
    failed: number;
    total: number;
  }> => {
    console.log("📱 Sending push notification to user:", args.userId);

    // Get all active push subscriptions for the user
    const subscriptions = await ctx.runQuery(
      api.notifications.getAllPushSubscriptions,
      {
        userId: args.userId,
      }
    );

    if (!subscriptions || subscriptions.length === 0) {
      console.log("❌ No push subscriptions found for user:", args.userId);
      return { success: false, sent: 0, failed: 0, total: 0 };
    }

    console.log(
      `📱 Found ${subscriptions.length} push subscription(s) for user:`,
      args.userId
    );

    // Check if user allows notifications
    const user = await ctx.runQuery(api.users.getById, {
      userId: args.userId,
    });

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
          action: "view",
          title: "View",
        },
        {
          action: "close",
          title: "Close",
        },
      ],
    });

    // Import web-push dynamically to avoid issues with server-side rendering
    const webpush = require("web-push");

    // Configure VAPID keys
    webpush.setVapidDetails(
      "mailto:ebukaj665@gmail.com",
      process.env.VAPID_PUBLIC_KEY!,
      process.env.VAPID_PRIVATE_KEY!
    );

    console.log("🔑 VAPID keys configured");

    let sentCount = 0;
    let failedCount = 0;

    // Send to all subscriptions
    for (const subscription of subscriptions) {
      try {
        console.log(
          `📤 Sending to device: ${subscription.deviceInfo?.platform || "Unknown"} - ${subscription.deviceInfo?.browser || "Unknown"}`
        );

        await webpush.sendNotification(
          JSON.parse(subscription.subscription),
          payload
        );

        console.log("✅ Push notification sent successfully to device");
        sentCount++;

        // Update last used timestamp
        await ctx.runMutation(
          api.notifications.updatePushSubscriptionLastUsed,
          {
            subscriptionId: subscription._id,
          }
        );
      } catch (error: any) {
        console.error("❌ Push notification failed for device:", error);
        console.error("Error details:", {
          statusCode: error.statusCode,
          body: error.body,
          headers: error.headers,
        });

        failedCount++;

        // Mark subscription as inactive for invalid subscriptions
        if (error.statusCode === 410 || error.statusCode === 404) {
          console.log("🗑️ Marking invalid subscription as inactive");
          try {
            await ctx.runMutation(api.notifications.removePushSubscription, {
              subscriptionId: subscription._id,
            });
          } catch (removeError) {
            console.error(
              "Failed to remove invalid subscription:",
              removeError
            );
          }
        }
      }
    }

    console.log(
      `📊 Push notification summary: ${sentCount} sent, ${failedCount} failed`
    );

    return {
      success: sentCount > 0,
      sent: sentCount,
      failed: failedCount,
      total: subscriptions.length,
    };
  },
});
