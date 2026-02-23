'use node';

import { v } from 'convex/values';
import { action } from './_generated/server';

export const verifyPaystackWebhook = action({
  args: {
    payload: v.string(),
    signature: v.string(),
  },
  handler: async (_ctx, args) => {
    const crypto = require('node:crypto');
    const hash = crypto
      .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY!)
      .update(args.payload)
      .digest('hex');
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

export const hashPin = action({
  args: {
    pin: v.string(),
  },
  handler: async (_ctx, args) => {
    const bcrypt = require('bcryptjs');
    const saltRounds = 12;
    return await bcrypt.hash(args.pin, saltRounds);
  },
});

export const verifyPin = action({
  args: {
    pin: v.string(),
    hashedPin: v.string(),
  },
  handler: async (_ctx, args) => {
    const bcrypt = require('bcryptjs');
    return await bcrypt.compare(args.pin, args.hashedPin);
  },
});
