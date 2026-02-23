import { v } from 'convex/values';
import { internalMutation, mutation, query } from './_generated/server';
import { getCurrentUserOrThrow } from './users';

export const create = internalMutation({
  args: {
    userId: v.id('users'),
    walletId: v.id('wallets'),
    type: v.union(
      v.literal('funding'), // Money in from Paystack
      v.literal('withdrawal'), // Money out to bank
      v.literal('transfer_in'), // P2P received
      v.literal('transfer_out'), // P2P sent
      v.literal('escrow_freeze'), // Funds frozen for order
      v.literal('escrow_release'), // Funds released to seller
      v.literal('escrow_refund'), // Funds refunded to buyer
      v.literal('ads_posting'), // Payment for posting an ad
      v.literal('ad_promotion'), // Payment for promoting an ad
      v.literal('subscription'), // Payment for subscription
      v.literal('refund') // General refund
    ),
    amount: v.number(),
    status: v.union(
      v.literal('pending'),
      v.literal('success'),
      v.literal('failed'),
      v.literal('cancelled')
    ),
    reference: v.string(),
    paystackReference: v.optional(v.string()),
    description: v.string(),
    metadata: v.optional(
      v.object({
        orderId: v.optional(v.id('orders')),
        recipientUserId: v.optional(v.id('users')),
        transferId: v.optional(v.id('transfers')),
        recipientName: v.optional(v.string()),
        escrowId: v.optional(v.id('escrows')),
        adId: v.optional(v.id('product')), // Reference to the ad being posted/promoted
        plan: v.optional(
          v.union(v.literal('basic'), v.literal('pro'), v.literal('premium'))
        ), // Ad plan type
        productIds: v.optional(v.array(v.id('product'))), // Array of product IDs for ads
      })
    ),
  },
  handler: async (ctx, args) => {
    getCurrentUserOrThrow(ctx);

    const transaction = await ctx.db.insert('transactions', args);
    return transaction;
  },
});

export const getByPaystackReference = query({
  args: {
    reference: v.string(),
  },
  handler: async (ctx, args) => {
    const transaction = await ctx.db
      .query('transactions')
      .withIndex('by_paystack_reference', (q) =>
        q.eq('paystackReference', args.reference)
      )
      .first();

    return transaction;
  },
});

export const updateTransactionStatus = internalMutation({
  args: {
    transactionId: v.id('transactions'),
    status: v.union(
      v.literal('pending'),
      v.literal('success'),
      v.literal('failed'),
      v.literal('cancelled')
    ),
  },
  handler: async (ctx, args) => {
    const transaction = await ctx.db.patch(args.transactionId, {
      status: args.status,
    });
    return transaction;
  },
});

export const getByUserId = query({
  args: {
    userId: v.id('users'),
  },
  handler: async (ctx, args) => {
    const transactions = await ctx.db
      .query('transactions')
      .withIndex('by_user', (q) => q.eq('userId', args.userId))
      .order('desc')
      .collect();

    return transactions;
  },
});

export const updateTransaction = internalMutation({
  args: {
    transactionId: v.id('transactions'),
    type: v.optional(
      v.union(
        v.literal('funding'),
        v.literal('withdrawal'),
        v.literal('transfer_in'),
        v.literal('transfer_out'),
        v.literal('escrow_freeze'),
        v.literal('escrow_release'),
        v.literal('escrow_refund'),
        v.literal('ads_posting'),
        v.literal('ad_promotion'),
        v.literal('subscription'),
        v.literal('refund')
      )
    ),
    amount: v.optional(v.number()),
    status: v.optional(
      v.union(
        v.literal('pending'),
        v.literal('success'),
        v.literal('failed'),
        v.literal('cancelled')
      )
    ),
    bank: v.optional(v.string()),
    last4: v.optional(v.string()),
    cardType: v.optional(v.string()),
    channel: v.optional(v.string()),
    currency: v.optional(v.string()),
    fees: v.optional(v.number()), // Transaction fees
    paystackFees: v.optional(v.number()), // Paystack fees
    reference: v.optional(v.string()),
    paystackReference: v.optional(v.string()),
    description: v.optional(v.string()),
    metadata: v.optional(
      v.object({
        orderId: v.optional(v.id('orders')),
        recipientUserId: v.optional(v.id('users')),
        transferId: v.optional(v.id('transfers')),
        escrowId: v.optional(v.id('escrows')),
        adId: v.optional(v.id('product')), // Reference to the ad being posted/promoted
        plan: v.optional(
          v.union(
            v.literal('free'),
            v.literal('basic'),
            v.literal('pro'),
            v.literal('premium')
          )
        ), // Ad plan type
      })
    ),
  },
  handler: async (ctx, args) => {
    const { transactionId, ...updates } = args;
    const transaction = await ctx.db.patch(transactionId, updates);
    return transaction;
  },
});

export const updateMetadata = mutation({
  args: {
    transactionId: v.id('transactions'),
    metadata: v.object({
      orderId: v.optional(v.id('orders')),
      recipientUserId: v.optional(v.id('users')),
      transferId: v.optional(v.id('transfers')),
      escrowId: v.optional(v.id('escrows')),
      adId: v.optional(v.id('product')), // Reference to the ad being posted/promoted
      plan: v.optional(
        v.union(
          v.literal('free'),
          v.literal('basic'),
          v.literal('pro'),
          v.literal('premium')
        )
      ), // Ad plan type
    }),
  },
  handler: async (ctx, args) => {
    const { transactionId, metadata } = args;
    const transaction = await ctx.db.patch(transactionId, { metadata });
    return transaction;
  },
});
