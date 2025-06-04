import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getCurrentUserOrThrow } from "./users";
import { Id } from "./_generated/dataModel";

export const createWallet = mutation({
  args: {
    userId: v.id("users"),
    balance: v.number(),
    currency: v.string(),
    status: v.union(
      v.literal("active"),
      v.literal("inactive"),
      v.literal("blocked")
    ),
  },
  handler: async (ctx, args) => {
    const wallet = await ctx.db.insert("wallets", args);
    return wallet;
  },
});

export const getWalletByUserId = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const wallet = await ctx.db
      .query("wallets")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .unique();
    return wallet;
  },
});

export const getWalletByWalletId = query({
  args: { walletId: v.id("wallets") },
  handler: async (ctx, args) => {
    const wallet = await ctx.db.get(args.walletId);
    return wallet;
  },
});

export const updateBalance = mutation({
  args: {
    walletId: v.id("wallets"),
    balance: v.number(), // Available balance
  },
  handler: async (ctx, args) => {
    getCurrentUserOrThrow(ctx);
    const wallet = await ctx.db.patch(args.walletId, {
      balance: args.balance,
    });
    return wallet;
  },
});
