import { query, mutation, internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { getCurrentUserOrThrow, getCurrentUser } from "./users";

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

export const getCurrentWallet = query({
  handler: async (ctx) => {
    const user = await getCurrentUserOrThrow(ctx);
    if (!user) {
      return {
        success: false,
        error: {
          status: 401,
          message: "Authentication Required",
          code: "USER_NOT_FOUND",
        },
        data: null,
      };
    }
    const wallet = await ctx.db
      .query("wallets")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .unique();
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

export const updateBalance = internalMutation({
  args: {
    walletId: v.id("wallets"),
    balance: v.number(), // Available balance
  },
  handler: async (ctx, args) => {
    const wallet = await ctx.db.patch(args.walletId, {
      balance: args.balance,
    });
    return wallet;
  },
});
