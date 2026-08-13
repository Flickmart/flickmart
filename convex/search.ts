import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { getCurrentUserOrThrow } from './users';

export const insertSearchHistory = mutation({
  args: {
    search: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);
    if (!user) {
      throw new Error('Not authenticated');
    }

    const search = args.search.trim();
    if (!search) {
      return;
    }

    // Check if the search already exists for the user
    const existingHistory = await ctx.db
      .query('history')
      .withIndex('byUserId', (q) => q.eq('userId', user._id))
      .filter((q) => q.eq(q.field('search'), search))
      .first();

    if (existingHistory) {
      return;
    }
    await ctx.db.insert('history', {
      userId: user._id,
      search,
      timeStamp: Date.now().toString(),
    });
  },
});

export const getSearchHistory = query({
  handler: async (ctx) => {
    const user = await getCurrentUserOrThrow(ctx);
    if (!user) {
      return {
        success: false,
        error: {
          status: 401,
          message: 'Authentication Required',
          code: 'USER_NOT_FOUND',
        },
        data: null,
      };
    }

    const history = await ctx.db
      .query('history')
      .withIndex('byUserId', (q) => q.eq('userId', user._id))
      .order('desc')
      .take(10);
    return { success: true, data: history, error: null };
  },
});

export const deleteSearchHistory = mutation({
  args: {
    searchId: v.id('history'),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);
    if (!user) {
      throw new Error('Not authenticated');
    }

    const entry = await ctx.db.get(args.searchId);
    // Already gone, or never existed -- nothing to do.
    if (!entry) {
      return;
    }
    if (entry.userId !== user._id) {
      throw new Error('Not authorized to delete this search history entry');
    }

    await ctx.db.delete(args.searchId);
  },
});
