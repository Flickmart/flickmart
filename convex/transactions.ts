import { internalMutation, mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getCurrentUserOrThrow } from "./users";

export const create = internalMutation({
  args: {
    userId: v.id("users"),
    walletId: v.id("wallets"),
    type: v.union(
      v.literal("funding"), // Money in from Paystack
      v.literal("withdrawal"), // Money out to bank
      v.literal("transfer_in"), // P2P received
      v.literal("transfer_out"), // P2P sent
      v.literal("escrow_freeze"), // Funds frozen for order
      v.literal("escrow_release"), // Funds released to seller
      v.literal("escrow_refund") // Funds refunded to buyer
    ),
    amount: v.number(),
    status: v.union(
      v.literal("pending"),
      v.literal("success"),
      v.literal("failed"),
      v.literal("cancelled")
    ),
    reference: v.string(),
    paystackReference: v.optional(v.string()),
    description: v.string(),
    metadata: v.optional(
      v.object({
        orderId: v.optional(v.id("orders")),
        recipientUserId: v.optional(v.id("users")),
        transferId: v.optional(v.id("transfers")),
        escrowId: v.optional(v.id("escrows")),
      })
    ),
  },
  handler: async (ctx, args) => {
    getCurrentUserOrThrow(ctx);

    const transaction = await ctx.db.insert("transactions", args);
    return transaction;
  },
});

export const getByReference = query({
  args: {
    reference: v.string(),
  },
  handler: async (ctx, args) => {
    const transaction = await ctx.db
      .query("transactions")
      .withIndex("by_reference", (q) => q.eq("reference", args.reference))
      .first();

    return transaction;
  },
});

export const update = mutation({
  args: {
    transactionId: v.id("transactions"),
    status: v.union(
      v.literal("pending"),
      v.literal("success"),
      v.literal("failed"),
      v.literal("cancelled")
    ),
  },
  handler: async (ctx, args) => {
    getCurrentUserOrThrow(ctx);

    const transaction = await ctx.db.patch(args.transactionId, {
      status: args.status,
    });
    return transaction;
  },
});
