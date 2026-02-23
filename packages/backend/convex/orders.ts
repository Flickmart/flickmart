// convex/orders.ts

import { v } from 'convex/values';
import { internal } from './_generated/api';
import { mutation, query } from './_generated/server';
import { getCurrentUser } from './users';

export const confirmOrderCompletion = mutation({
  args: {
    orderId: v.id('orders'),
  },
  handler: async (ctx, args) => {
    const currentUser = await getCurrentUser(ctx);
    const order = await ctx.db.get(args.orderId);

    if (!currentUser) {
      throw new Error('Order not found.');
    }
    if (!order) {
      throw new Error('Order not found.');
    }
    if (order.status !== 'in_escrow') {
      throw new Error(
        `Cannot confirm completion for an order with status: ${order.status}`
      );
    }

    const isBuyer = order.buyerId === currentUser._id;
    const isSeller = order.sellerId === currentUser._id;

    if (!(isBuyer || isSeller)) {
      throw new Error('You are not part of this order.');
    }

    // Update confirmation status
    if (isBuyer) {
      await ctx.db.patch(order._id, { buyerConfirmedCompletion: true });
    } else {
      await ctx.db.patch(order._id, { sellerConfirmedCompletion: true });
    }

    const updatedOrder = await ctx.db.get(args.orderId);
    if (!updatedOrder) {
      throw new Error('Order vanished after update.');
    }

    const seller = await ctx.db.get(updatedOrder.sellerId);

    if (!seller) {
      throw new Error('Seller not found.');
    }

    // Check if BOTH parties have now confirmed
    if (
      updatedOrder.buyerConfirmedCompletion &&
      updatedOrder.sellerConfirmedCompletion
    ) {
      // --- RELEASE FUNDS ---
      const sellerWallet = await ctx.db
        .query('wallets')
        .withIndex('by_user', (q) => q.eq('userId', updatedOrder.sellerId))
        .unique();
      if (!sellerWallet) {
        throw new Error("Seller's wallet not found for fund release.");
      }

      // 1. Credit Seller's wallet
      await ctx.runMutation(internal.wallet.updateBalance, {
        walletId: sellerWallet._id,
        balance: sellerWallet.balance + updatedOrder.amount,
      });

      // 2. Update Order and Escrow status
      await ctx.db.patch(updatedOrder._id, {
        status: 'completed',
        completedAt: Date.now(),
      });
      const escrow = await ctx.db
        .query('escrows')
        .withIndex('by_order', (q) => q.eq('orderId', updatedOrder._id))
        .unique();
      if (escrow) {
        await ctx.db.patch(escrow._id, {
          status: 'released',
          releasedAt: Date.now(),
        });
      }

      // 3. Log "transfer_in" transaction for seller
      const timestamp = Date.now();
      const randomStr = Math.random().toString(36).substring(2, 8);
      const reference = `FLK-TRI-${timestamp}-${randomStr}`;
      await ctx.runMutation(internal.transactions.create, {
        userId: updatedOrder.sellerId,
        walletId: sellerWallet._id,
        type: 'transfer_in',
        amount: updatedOrder.amount,
        status: 'success',
        reference,
        description: `Funds released from escrow for order ${updatedOrder._id}`,
        metadata: {
          orderId: updatedOrder._id,
          productIds: updatedOrder.productIds,
          recipientUserId: updatedOrder.sellerId,
          recipientName: seller.name,
        },
      });

      // 4. Notify both parties with push notifications
      await ctx.runMutation(internal.notifications.createNotificationWithPush, {
        userId: updatedOrder.buyerId,
        type: 'escrow_released',
        title: 'Transaction Complete',
        content: `Your transaction with ${seller?.name} has been successfully completed and funds have been released to the ${seller?.name}.`,
        relatedId: updatedOrder._id,
        link: `/orders/${updatedOrder._id}`,
        sendPush: true,
      });
      await ctx.runMutation(internal.notifications.createNotificationWithPush, {
        userId: updatedOrder.sellerId,
        type: 'escrow_released',
        title: 'Funds Released',
        content: 'Funds for your order have been released to your wallet.',
        relatedId: updatedOrder._id,
        link: `/orders/${updatedOrder._id}`,
        sendPush: true,
      });

      return {
        success: true,
        status: 'completed',
        message: 'Transaction complete. Funds have been released.',
      };
    }
    // --- WAITING FOR OTHER PARTY ---
    const otherPartyId = isBuyer ? updatedOrder.sellerId : updatedOrder.buyerId;
    await ctx.runMutation(internal.notifications.createNotificationWithPush, {
      userId: otherPartyId,
      type: 'completion_confirmed',
      title: 'Confirmation Received',
      content: `${currentUser?.name} has confirmed the transaction. We are now waiting for your confirmation to release the funds.`,
      relatedId: updatedOrder._id,
      link: `/orders/${updatedOrder._id}`,
      sendPush: true,
    });

    return {
      success: true,
      status: 'waiting_for_other_party',
      message: 'Confirmation recorded. Waiting for the other party.',
    };
  },
});

// Query to get all orders for a user (both as buyer and seller)
export const getUserOrders = query({
  handler: async (ctx) => {
    const currentUser = await getCurrentUser(ctx);
    if (!currentUser) {
      // Return empty array instead of error object to match frontend expectations
      return [];
    }

    // Get orders where user is buyer
    const buyerOrders = await ctx.db
      .query('orders')
      .withIndex('by_buyer', (q) => q.eq('buyerId', currentUser._id))
      .collect();

    // Get orders where user is seller
    const sellerOrders = await ctx.db
      .query('orders')
      .withIndex('by_seller', (q) => q.eq('sellerId', currentUser._id))
      .collect();

    // Combine and deduplicate orders
    const allOrders = [...buyerOrders, ...sellerOrders];
    const uniqueOrders = allOrders.filter(
      (order, index, self) =>
        index === self.findIndex((o) => o._id === order._id)
    );

    // Enrich orders with user data and role information
    const enrichedOrders = await Promise.all(
      uniqueOrders.map(async (order) => {
        const buyer = await ctx.db.get(order.buyerId);
        const seller = await ctx.db.get(order.sellerId);

        return {
          ...order,
          buyerName: buyer?.name,
          sellerName: seller?.name,
          userRole:
            order.buyerId === currentUser._id
              ? ('buyer' as const)
              : ('seller' as const),
        };
      })
    );

    // Sort by creation date (newest first)
    return enrichedOrders.sort((a, b) => b.createdAt - a.createdAt);
  },
});

// Query to get a specific order by its ID with enriched user data
export const getOrderById = query({
  args: { orderId: v.id('orders') },
  handler: async (ctx, args) => {
    const currentUser = await getCurrentUser(ctx);
    if (!currentUser) {
      throw new Error('User must be authenticated to view order details');
    }

    const order = await ctx.db.get(args.orderId);
    if (!order) {
      return null;
    }

    // Check if user is part of this order
    if (
      order.buyerId !== currentUser._id &&
      order.sellerId !== currentUser._id
    ) {
      throw new Error('You are not authorized to view this order');
    }

    const buyer = await ctx.db.get(order.buyerId);
    const seller = await ctx.db.get(order.sellerId);

    return {
      ...order,
      buyerName: buyer?.name,
      sellerName: seller?.name,
      buyerImageUrl: buyer?.imageUrl,
      sellerImageUrl: seller?.imageUrl,
      userRole:
        order.buyerId === currentUser._id
          ? ('buyer' as const)
          : ('seller' as const),
    };
  },
});

// Query to fetch multiple products by IDs for order details
export const getProductsByIds = query({
  args: { productIds: v.array(v.id('product')) },
  handler: async (ctx, args) => {
    if (args.productIds.length === 0) {
      return [];
    }

    // Fetch all products by their IDs
    const products = await Promise.all(
      args.productIds.map(async (productId) => {
        const product = await ctx.db.get(productId);
        return product;
      })
    );

    // Filter out any null products (in case some products were deleted)
    return products.filter(
      (product): product is NonNullable<typeof product> => product !== null
    );
  },
});
