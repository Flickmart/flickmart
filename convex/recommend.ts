// convex/recommend.ts
import { v } from 'convex/values';
import { internal } from './_generated/api';
import type { Doc } from './_generated/dataModel';
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
        console.error('[Recombee] ERROR: No user id found from getUserId query');
        throw new Error('No user id found');
      }

      const userId = userIdResult;
      console.log('[Recombee] User ID:', userId);

      // Get URI and Hash
      const databaseId = process.env.RECOMBEE_DB_ID as string;
      console.log('[Recombee] Database ID:', databaseId);
      
      const uri = `/${databaseId}/recomms/users/${userId}/items/${args.queryStrings}`;
      console.log('[Recombee] URI (before signing):', uri);
      
      const { hmac_timestamp, hmac_sign } = await ctx.runAction(
        internal.helpers.signRecombeeUri,
        {
          uri,
        }
      );
      const fullUrl = `${apiUrl}${uri}&hmac_timestamp=${hmac_timestamp}&hmac_sign=${hmac_sign}`;
      console.log('[Recombee] Full URL:', fullUrl);

      // Extract scenario from the query string
      const params = new URLSearchParams(args.queryStrings);
      const scenario = params.get('scenario');
      console.log('[Recombee] Scenario:', scenario);
      console.log('[Recombee] Query Strings:', args.queryStrings);

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
        console.log('[Recombee] Returning cached data (cache age:', Date.now() - cache.updatedAt, 'ms)');
        const validCache = cache.data as RecommendationResponse;

        return validCache;
      }

      console.log('[Recombee] Cache miss or expired, fetching from Recombee API...');

      // Fetch recommendations
      const res = await fetch(fullUrl, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${process.env.RECOMBEE_PRIVATE_TOKEN as string}`,
        },
      });
      
      console.log('[Recombee] Response status:', res.status, res.statusText);
      
      if (!res.ok) {
        // Get the response body for more details
        let errorBody = '';
        try {
          errorBody = await res.text();
          console.error('[Recombee] Error response body:', errorBody);
        } catch (e) {
          console.error('[Recombee] Could not read error response body');
        }
        
        console.error('[Recombee] Request failed with status:', res.status);
        console.error('[Recombee] Request URL was:', fullUrl.replace(hmac_sign, '[REDACTED]'));
        console.error('[Recombee] User ID:', userId);
        console.error('[Recombee] Scenario:', scenario);
        console.error('[Recombee] Database ID:', databaseId);
        
        throw new Error(`Recombee request failed: ${res.statusText} - ${errorBody}`);
      }

      const data: RecommendationResponse = await res.json();
      console.log('[Recombee] SUCCESS: Received', data.recomms?.length ?? 0, 'recommendations');
      console.log('[Recombee] Response recommId:', data.recommId);
      
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
