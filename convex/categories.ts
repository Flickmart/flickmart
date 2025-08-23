import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

const errorObj = {
  message: 'Could not retrieve user, try logging in',
  status: 401,
  code: 'USER_NOT_FOUND',
};

// Create | Insert a new Category
export const insertSubCategory = mutation({
  args: {
    category: v.string(),
    subcategories: v.array(
      v.object({
        title: v.string(),
        image: v.string(),
        size: v.number(),
      })
    ),
  },
  handler: async (ctx, args) => {
    try {
      // check if category has already been inserted
      const catExists = await ctx.db
        .query('subcategories')
        .filter((q) => q.eq(q.field('category'), args.category))
        .first();

      // Update category if it already exists
      if (catExists?.category) {
        const catId = await ctx.db.patch(catExists._id, {
          items: args.subcategories,
        });
        return {
          error: null,
          success: true,
          data: catId,
        };
      }

      const data = await ctx.db.insert('subcategories', {
        category: args.category,
        items: args.subcategories,
      });

      return {
        error: null,
        success: true,
        data,
      };
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

// Query | Retrieve a particular category
export const getCategory = query({
  args: {
    category: v.string(),
  },
  handler: async (ctx, args) => {
    const category = await ctx.db
      .query('subcategories')
      .filter((q) => q.eq(q.field('category'), args.category))
      .first();

    return category;
  },
});
