import { v } from 'convex/values';
import { internalMutation } from './_generated/server';

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

export const updateWalletBalance = internalMutation({
  args: {
    walletId: v.id('wallets'),
    balance: v.number(),
  },
  handler: async (ctx, args) => {
    const wallet = await ctx.db.patch(args.walletId, {
      balance: args.balance,
    });
    return wallet;
  },
});
