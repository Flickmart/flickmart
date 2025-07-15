// convex/orders.ts

import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getCurrentUserOrThrow } from "./users";
import { internal } from "./_generated/api";

export const confirmOrderCompletion = mutation({
  args: {
    orderId: v.id("orders"),
  },
  handler: async (ctx, args) => {
    const currentUser = await getCurrentUserOrThrow(ctx);
    const order = await ctx.db.get(args.orderId);

    if (!currentUser) {
      throw new Error("Order not found.");
      return;
    }
    if (!order) throw new Error("Order not found.");
    if (order.status !== "in_escrow")
      throw new Error(
        `Cannot confirm completion for an order with status: ${order.status}`
      );

    const isBuyer = order.buyerId === currentUser._id;
    const isSeller = order.sellerId === currentUser._id;

    if (!isBuyer && !isSeller)
      throw new Error("You are not part of this order.");

    // Update confirmation status
    if (isBuyer)
      await ctx.db.patch(order._id, { buyerConfirmedCompletion: true });
    else await ctx.db.patch(order._id, { sellerConfirmedCompletion: true });

    const updatedOrder = await ctx.db.get(args.orderId);
    if (!updatedOrder) throw new Error("Order vanished after update.");

    // Check if BOTH parties have now confirmed
    if (
      updatedOrder.buyerConfirmedCompletion &&
      updatedOrder.sellerConfirmedCompletion
    ) {
      // --- RELEASE FUNDS ---
      const sellerWallet = await ctx.db
        .query("wallets")
        .withIndex("by_user", (q) => q.eq("userId", updatedOrder.sellerId))
        .unique();
      if (!sellerWallet)
        throw new Error("Seller's wallet not found for fund release.");

      // 1. Credit Seller's wallet
      await ctx.runMutation(internal.wallet.updateBalance, {
        walletId: sellerWallet._id,
        balance: sellerWallet.balance + updatedOrder.amount,
      });

      // 2. Update Order and Escrow status
      await ctx.db.patch(updatedOrder._id, {
        status: "completed",
        completedAt: Date.now(),
      });
      const escrow = await ctx.db
        .query("escrows")
        .withIndex("by_order", (q) => q.eq("orderId", updatedOrder._id))
        .unique();
      if (escrow)
        await ctx.db.patch(escrow._id, {
          status: "released",
          releasedAt: Date.now(),
        });

      // 3. Log "transfer_in" transaction for seller
      const timestamp = Date.now();
      const randomStr = Math.random().toString(36).substring(2, 8);
      const reference = `FLK-TRI-${timestamp}-${randomStr}`;
      await ctx.runMutation(internal.transactions.create, {
        userId: updatedOrder.sellerId,
        walletId: sellerWallet._id,
        type: "transfer_in",
        amount: updatedOrder.amount,
        status: "success",
        reference,
        description: `Funds released from escrow for order ${updatedOrder._id}`,
        metadata: {
          orderId: updatedOrder._id,
          productIds: updatedOrder.productIds,
        },
      });

      // 4. Notify both parties
      await ctx.runMutation(internal.notifications.createNotification, {
        userId: updatedOrder.buyerId,
        type: "escrow_released",
        title: "Transaction Complete",
        // UPDATED: More generic notification text
        content: `Your transaction with has been successfully completed and funds have been released to the seller.`,
        relatedId: updatedOrder._id,
      });
      await ctx.runMutation(internal.notifications.createNotification, {
        userId: updatedOrder.sellerId,
        type: "escrow_released",
        title: "Funds Released",
        content: `Funds for your order have been released to your wallet.`,
        relatedId: updatedOrder._id,
      });

      return {
        success: true,
        status: "completed",
        message: "Transaction complete. Funds have been released.",
      };
    } else {
      // --- WAITING FOR OTHER PARTY ---
      const otherPartyId = isBuyer
        ? updatedOrder.sellerId
        : updatedOrder.buyerId;
      await ctx.runMutation(internal.notifications.createNotification, {
        userId: otherPartyId,
        type: "completion_confirmed",
        title: "Confirmation Received",
        content: `${currentUser?.name} has confirmed the transaction. We are now waiting for your confirmation to release the funds.`,
        relatedId: updatedOrder._id,
      });

      return {
        success: true,
        status: "waiting_for_other_party",
        message: "Confirmation recorded. Waiting for the other party.",
      };
    }
  },
});


// NEW: Query to get a specific order by its ID
export const getOrderById = query({
  args: { orderId: v.id("orders") },
  handler: async (ctx, args) => {
    const order = await ctx.db.get(args.orderId);
    if (!order) {
      return null;
    }

  
    const buyer = await ctx.db.get(order.buyerId);
    const seller = await ctx.db.get(order.sellerId);

    return {
      ...order,
      buyerName: buyer?.name,
      sellerName: seller?.name,
    };
  },
});