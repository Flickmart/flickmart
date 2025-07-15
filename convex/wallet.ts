import { query, mutation, internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { getCurrentUserOrThrow } from "./users";
import { api, internal } from "./_generated/api";

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

export const transferToUserWithEscrow = mutation({
  args: {
    sellerId: v.id("users"),
    amount: v.number(), // Amount in main currency (e.g., Naira), will be converted
    productIds: v.array(v.id("product")),
  },
  handler: async (ctx, args) => {
    const buyer = await getCurrentUserOrThrow(ctx);
    const amountInCents = args.amount * 100;
    const { sellerId, productIds } = args;

    if (!buyer) {
      throw new Error("Unauthroized");
    }

    if (buyer._id === sellerId) {
      throw new Error("You cannot send money to yourself.");
    }

    // 1. Get buyer and seller wallets
    const buyerWallet = await ctx.db
      .query("wallets")
      .withIndex("by_user", (q) => q.eq("userId", buyer._id))
      .unique();

    if (!buyerWallet) {
      throw new Error("Your wallet was not found. Please set one up first.");
    }
    if (buyerWallet.balance < amountInCents) {
      throw new Error("Insufficient funds.");
    }

    const sellerWallet = await ctx.db
      .query("wallets")
      .withIndex("by_user", (q) => q.eq("userId", sellerId))
      .unique();

    if (!sellerWallet) {
      throw new Error(
        "Seller's wallet not found. The seller may need to activate their wallet."
      );
    }

    // 2. Debit buyer's wallet
    await ctx.db.patch(buyerWallet._id, {
      balance: buyerWallet.balance - amountInCents,
    });

    // 3. Create an Order with multiple product IDs
    const orderId = await ctx.db.insert("orders", {
      productIds: productIds,
      buyerId: buyer._id,
      sellerId: sellerId,
      amount: amountInCents,
      status: "in_escrow",
      buyerConfirmedCompletion: false,
      sellerConfirmedCompletion: false,
      createdAt: Date.now(),
    });

    // 4. Generate a unique reference for the transaction
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 8);
    const reference = `FLK-TRO-${timestamp}-${randomStr}`;

    // 5. Create an Escrow record
    await ctx.db.insert("escrows", {
      orderId: orderId,
      buyerId: buyer._id,
      sellerId: sellerId,
      amount: amountInCents,
      currency: buyerWallet.currency,
      status: "frozen",
      reference: `escrow-${reference}`,
      createdAt: Date.now(),
    });

    // 6. Log transaction for the buyer (transfer_out)
    await ctx.runMutation(internal.transactions.create, {
      userId: buyer._id,
      walletId: buyerWallet._id,
      type: "transfer_out",
      amount: amountInCents,
      status: "success",
      reference: reference,
      description: `Payment sent to escrow for order ${orderId}`,
      metadata: {
        orderId: orderId,
        recipientUserId: sellerId,
        productIds: productIds,
      },
    });

    // 7. Send notifications to both parties
    const seller = await ctx.db.get(sellerId);
    if (!seller) {
      throw new Error("Could not find seller to notify.");
    }

    const notificationContentForSeller =
      productIds.length > 1
        ? `${buyer.name} has sent ${args.amount} ${buyerWallet.currency} for multiple items. The funds are now held in escrow.`
        : `${buyer.name} has sent ${args.amount} ${buyerWallet.currency} for your item. The funds are now held in escrow.`;

    await ctx.runMutation(internal.notifications.createNotification, {
      userId: sellerId,
      type: "escrow_funded",
      title: "Funds Received in Escrow",
      content: notificationContentForSeller,
      relatedId: orderId,
      link: `/orders/${orderId}`,
    });
    await ctx.runMutation(internal.notifications.createNotification, {
      userId: buyer._id,
      type: "escrow_funded",
      title: "Funds Sent to Escrow",
      content: `You sent ${args.amount} ${buyerWallet.currency} to escrow for your order.`,
      relatedId: orderId,
      link: `/orders/${orderId}`,
    });

    return { success: true, orderId };
  },
});
