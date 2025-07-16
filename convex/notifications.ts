import { query, mutation, internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { getCurrentUser } from "./users";
import { Resend } from "@convex-dev/resend";
import { components } from "./_generated/api";

// Internal Mutation for Email Notifications
const resend = new Resend(components.resend, {});

export const sendEmailNotification = internalMutation({
  args: {
    recipient: v.string(),
    subject: v.string(),
    username: v.string(),
    ctaLink: v.optional(v.string()),
    messagePreview: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await resend.sendEmail(ctx, {
      from: "Flickmart <support@flickmart.app>",
      to: `${args.username}${args.recipient}`,
      subject: args.subject,
      html: `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>New Message Notification</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f4;
        padding: 20px;
        margin: 0;
      }
      .container {
        background-color: #ffffff;
        border-radius: 8px;
        max-width: 600px;
        margin: 0 auto;
        padding: 30px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
      }
      .header {
        font-size: 24px;
        margin-bottom: 20px;
        color: #333333;
      }
      .message-preview {
        font-size: 16px;
        background-color: #f0f0f0;
        padding: 15px;
        border-left: 4px solid #FF8100;
        margin-bottom: 20px;
        white-space: pre-line;
      }
      .cta {
        display: inline-block;
        background-color: #FF8100;
        color: #ffffff;
        text-decoration: none;
        padding: 12px 20px;
        border-radius: 6px;
        font-weight: bold;
      }
      .footer {
        font-size: 12px;
        color: #999999;
        margin-top: 30px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">📩 You’ve got a new message</div>

      <p><strong>${args.username}</strong> sent you a new message on <strong>Flickmart</strong>:</p>

      <div class="message-preview">
        "${args.messagePreview}"
      </div>

      <a href="${args.ctaLink}" class="cta">Open Chat</a>

      <div class="footer">
        If you didn't expect this message, you can ignore this email.
      </div>
    </div>
  </body>
</html>
`,
    });
  },
});

export const createNotification = internalMutation({
  args: {
    type: v.union(
      v.literal("new_message"),
      v.literal("new_like"),
      v.literal("new_comment"),
      v.literal("new_sale"),
      v.literal("advertisement"),
      v.literal("reminder")
    ),
    relatedId: v.optional(
      v.union(
        v.id("product"),
        v.id("message"),
        v.id("comments"),
        v.id("conversations"),
        v.id("users")
      )
    ),
    title: v.string(),
    content: v.string(),
    imageUrl: v.optional(v.string()),
    isRead: v.boolean(),
    timestamp: v.number(),
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
      userId: user._id,
      type: args.type,
      title: args.title,
      relatedId: args.relatedId,
      content: args.content,
      imageUrl: args.imageUrl,
      isRead: false,
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

    const notifications = await ctx.db
      .query("notifications")
      .withIndex("byUserIdAndIsRead", (q) =>
        q.eq("userId", user._id).eq("isRead", false)
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
