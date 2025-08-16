import { query, mutation, internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { getCurrentUserOrThrow } from "./users";
import { internal } from "./_generated/api";

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

// PIN Management Functions (Internal mutations for HTTP actions)
export const createPinInternal = internalMutation({
  args: {
    userId: v.id("users"),
    hashedPin: v.string(),
  },
  handler: async (ctx, args) => {
    // Get user's wallet
    const wallet = await ctx.db
      .query("wallets")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .unique();

    if (!wallet) {
      throw new Error("Wallet not found. Please create a wallet first.");
    }

    // Check if PIN already exists
    if (wallet.pinHash) {
      throw new Error("PIN already exists. Use change PIN instead.");
    }

    // Update wallet with PIN
    await ctx.db.patch(wallet._id, {
      pinHash: args.hashedPin,
      pinAttempts: 0,
      pinLockedUntil: undefined,
      pinCreatedAt: Date.now(),
      pinUpdatedAt: Date.now(),
    });

    return { success: true, message: "PIN created successfully" };
  },
});

export const verifyPinInternal = internalMutation({
  args: {
    userId: v.id("users"),
    pin: v.string(),
  },
  handler: async (ctx, args) => {
    // Get user's wallet
    const wallet = await ctx.db
      .query("wallets")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .unique();

    if (!wallet) {
      throw new Error("Wallet not found.");
    }

    if (!wallet.pinHash) {
      throw new Error("PIN not set. Please create a PIN first.");
    }

    // Check if wallet is locked
    if (wallet.pinLockedUntil && wallet.pinLockedUntil > Date.now()) {
      const remainingTime = Math.ceil((wallet.pinLockedUntil - Date.now()) / 60000);
      throw new Error(`Wallet is locked. Try again in ${remainingTime} minutes.`);
    }

    return { wallet, hashedPin: wallet.pinHash };
  },
});

export const updatePinAttempts = internalMutation({
  args: {
    walletId: v.id("wallets"),
    attempts: v.number(),
    lockUntil: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.walletId, {
      pinAttempts: args.attempts,
      pinLockedUntil: args.lockUntil,
    });
  },
});

export const resetPinAttempts = internalMutation({
  args: {
    walletId: v.id("wallets"),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.walletId, {
      pinAttempts: 0,
      pinLockedUntil: undefined,
    });
  },
});

export const changePinInternal = internalMutation({
  args: {
    userId: v.id("users"),
    hashedPin: v.string(),
  },
  handler: async (ctx, args) => {
    // Get wallet
    const wallet = await ctx.db
      .query("wallets")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .unique();

    if (!wallet) {
      throw new Error("Wallet not found.");
    }

    // Update wallet with new PIN
    await ctx.db.patch(wallet._id, {
      pinHash: args.hashedPin,
      pinAttempts: 0,
      pinLockedUntil: undefined,
      pinUpdatedAt: Date.now(),
    });

    return { success: true, message: "PIN changed successfully" };
  },
});

export const checkPinExists = query({
  handler: async (ctx) => {
    const user = await getCurrentUserOrThrow(ctx);
    if (!user) {
      return { exists: false };
    }

    const wallet = await ctx.db
      .query("wallets")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .unique();

    return {
      exists: !!(wallet?.pinHash),
      isLocked: wallet?.pinLockedUntil ? wallet.pinLockedUntil > Date.now() : false,
      lockExpiresAt: wallet?.pinLockedUntil
    };
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

    const seller = await ctx.db.get(sellerId);

    if (!seller) {
      throw new Error("Could not find seller to notify.");
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
        recipientName: seller.name
      },
    });

    // 7. Send notifications to both parties
    const notificationContentForSeller =
      productIds.length > 1
        ? `${buyer.name} has sent ${args.amount} ${buyerWallet.currency} for multiple items. The funds are now held in escrow.`
        : `${buyer.name} has sent ${args.amount} ${buyerWallet.currency} for your item. The funds are now held in escrow.`;

    await ctx.runMutation(internal.notifications.createNotificationWithPush, {
      userId: sellerId,
      type: "escrow_funded",
      title: "Funds Received in Escrow",
      content: notificationContentForSeller,
      relatedId: orderId,
      link: `/orders/${orderId}`,
      sendPush: true
    });
    await ctx.runMutation(internal.notifications.createNotificationWithPush, {
      userId: buyer._id,
      type: "escrow_funded",
      title: "Funds Sent to Escrow",
      content: `You sent ${args.amount} ${buyerWallet.currency} to ${seller.name} for your order.`,
      relatedId: orderId,
      link: `/orders/${orderId}`,
      sendPush: true
    });

    return { success: true, orderId };
  },
});
