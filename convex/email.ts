import { query, mutation, internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { getCurrentUser } from "./users";
import { Resend } from "@convex-dev/resend";
import { components } from "./_generated/api";

// Internal Mutation for Email Notifications
export const resend: Resend = new Resend(components.resend, {
  testMode: true
});

export const sendTestEmail = internalMutation({
  handler: async (ctx) => {
    await resend.sendEmail(ctx, {
      from: "Me <test@flickmart.app>",
      to: "delivered@resend.dev",
      subject: "Hi there",
      html: "This is a test email from flickmart",
    });
  },
});

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
      to: `delivered@resend.dev`,
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