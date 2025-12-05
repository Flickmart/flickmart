// convex/recommend.ts
import { v } from 'convex/values';
import { internal } from './_generated/api';
import type { Doc, Id } from './_generated/dataModel';
import { action, internalMutation } from './_generated/server';

export type RecommendationResponse = {
  numberNextRecommsCalls: number;
  recommId: string;
  recomms: Array<{
    id: string;
    values: {
      aiEnabled: boolean | null;
      category: string | null;
      dislikes: number | null;
      image: string | null;
      likes: number | null;
      location: string | null;
      plan: string | null;
      price: number | null;
      rating: number | null;
      subcategory: string | null;
      title: string | null;
      views: number | null;
      timeStamp: string | null;
    };
  }>;
};

export const apiUrl = 'https://rapi-eu-west.recombee.com';

// Recommend Items to User
export const recommendItems = action({
  args: {
    queryStrings: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      // Get User ID
      const userIdResult = await ctx.runQuery(internal.users.getUserId);
      if (!userIdResult) {
        throw new Error('No user id found');
      }

      const userId = userIdResult;

      // Get URI and Hash
      const uri = `/${process.env.RECOMBEE_DB_ID as string}/recomms/users/${userId}/items/${args.queryStrings}`;
      const { hmac_timestamp, hmac_sign } = await ctx.runAction(
        internal.helpers.signRecombeeUri,
        {
          uri,
        }
      );
      const fullUrl = `${apiUrl}${uri}&hmac_timestamp=${hmac_timestamp}&hmac_sign=${hmac_sign}`;

      // Extract scenario from the query string
      const params = new URLSearchParams(args.queryStrings);
      const scenario = params.get('scenario');

      // Check if Cache exists
      const cache: Doc<'recommCache'> = await ctx.runMutation(
        internal.recommend.cache,
        {
          scenario: scenario ?? '', // Use scenario for caching, with a fallback
          userId,
        }
      );

      // Cache valid for 1 hour
      const oneHour = 60 * 60 * 1000;

      // If cache is still valid
      if (cache.data && Date.now() - cache.updatedAt < oneHour) {
        const validCache = cache.data as RecommendationResponse;

        return validCache;
      }

      // TODO - Implement using axios
      // Fetch recommendations

      const res = await fetch(fullUrl, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${process.env.RECOMBEE_PRIVATE_TOKEN as string}`,
        },
      });
      if (!res.ok) {
        throw new Error(`Recombee request failed: ${res.statusText}`);
      }

      const data: RecommendationResponse = await res.json();
      // Update Cache
      await ctx.runMutation(internal.recommend.updateCache, {
        cacheId: cache._id,
        scenario: scenario ?? 'default',
        data,
      });

      return data;
    } catch (err) {
      console.error('Error fetching recommendations:', err);
      return null;
    }
  },
});

//////////////////////////////////////////////////////
// Check if there is  an existing Cache
export const cache = internalMutation({
  args: { userId: v.id('users'), scenario: v.string() },
  handler: async (ctx, args) => {
    // Check if cache exists and is still valid
    const cache = await ctx.db
      .query('recommCache')
      .withIndex('by_user', (q) =>
        q.eq('userId', args.userId).eq('scenario', args.scenario)
      )
      .unique();

    if (!cache) {
      // Create an cache record if none is found which will later be populated with recommendation data
      const cacheId = await ctx.db.insert('recommCache', {
        userId: args.userId,
        data: null,
        updatedAt: Date.now(),
        scenario: args.scenario,
      });
      return (await ctx.db.get(cacheId)) as Doc<'recommCache'>;
    }
    return cache;
  },
});

///////////////////////////////////////////////////////////
// Update Cache Record
export const updateCache = internalMutation({
  args: {
    cacheId: v.id('recommCache'),
    scenario: v.string(),
    data: v.any(),
  },
  async handler(ctx, args) {
    await ctx.db.patch(args.cacheId, {
      data: args.data,
      scenario: args.scenario,
      updatedAt: Date.now(),
    });
  },
});

///////////////////////////////////////////////////////////
// Fetch actual recommended products from convex db
// export const fetchProducts = internalMutation({
//   args: { productIds: v.array(v.id("product")) },
//   handler: async (ctx, args) => {
//     const products = await asyncMap(args.productIds, async (id) => {
//       return (await ctx.db.get(id)) as Doc<"product">;
//     });
//     return products;
//   },
// });
