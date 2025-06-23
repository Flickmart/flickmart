"use node";

import { action } from "./_generated/server";
import { v } from "convex/values";

export const verifyPaystackWebhook = action({
  args: {
    payload: v.string(),
    signature: v.string(),
  },
  handler: async (_ctx, args) => {
    const crypto = require("crypto");
    const hash = crypto
      .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY!)
      .update(args.payload)
      .digest("hex");
    return hash === args.signature;
  },
});

export const generateTransactionReference = action({
  args: {
    type: v.string(),
  },
  handler: async (_ctx, args) => {
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 8);
    return `FLK-${args.type.substring(0, 3).toUpperCase()}-${timestamp}-${randomStr}`;
  },
});
