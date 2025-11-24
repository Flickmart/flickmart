"use node";
import crypto from "crypto";
import { internalAction } from "./_generated/server";
import { v } from "convex/values";

export const signRecombeeUri = internalAction({
  args: { uri: v.string() },
  handler: async (ctx, args) => {
    const timestamp = Math.floor(Date.now() / 1000); // UTC unix seconds
    const secret = process.env.RECOMBEE_PRIVATE_TOKEN as string;

    const message = `${args.uri}&hmac_timestamp=${timestamp}`;

    const hmac_sign = crypto
      .createHmac("sha1", secret) // recombee uses sha1 by default
      .update(message)
      .digest("hex");

    return { hmac_timestamp: timestamp, hmac_sign };
  },
});
