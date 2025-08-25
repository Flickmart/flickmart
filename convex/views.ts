import { v } from 'convex/values';
import { mutation } from './_generated/server';
import { getCurrentUserOrThrow } from './users';

const errorObj = {
  message: 'Could not retrieve user, try logging in',
  status: 401,
  code: 'USER_NOT_FOUND',
};
export const createView = mutation({
  args: {
    productId: v.id('product'),
  },
  handler: async (ctx, args) => {
    try {
      // Check if User is exists and authenticated
      const user = await getCurrentUserOrThrow(ctx);
      if (!user) {
        throw Error('Could not retrieve user, try logging in');
      }

      // Check if Product exists
      const product = await ctx.db.get(args.productId);
      if (!product) {
        throw Error('product not found');
      }

      if (user._id === product.userId) {
        throw Error(
          "views from your own account do not count toward your product's view count."
        );
      }

      //   Check if User has already viewed product
      const existingView = await ctx.db
        .query('views')
        .filter((q) =>
          q.and(
            q.eq(q.field('userId'), user._id),
            q.eq(q.field('productId'), args.productId),
            q.eq(q.field('viewed'), true)
          )
        )
        .first();

      if (existingView) {
        throw Error('user has already viewed this product');
      }

      //   update product view count
      await ctx.db.patch(product._id, { views: product.views ?? 0 + 1 });

      //   create a view record
      const viewId = await ctx.db.insert('views', {
        userId: user._id,
        productId: args.productId,
        viewed: true,
        timeStamp: Date.now().toLocaleString(),
      });

      return { error: null, success: true, data: viewId };
    } catch (err) {
      const error = err as Error;
      return {
        error: { ...errorObj, message: error.message },
        success: false,
        data: null,
      };
    }
  },
});
