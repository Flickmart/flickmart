// convex/recommend.ts
import { v } from "convex/values";
import { internal } from "./_generated/api";
import type { Doc, Id } from "./_generated/dataModel";
import { action, internalMutation } from "./_generated/server";

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

export const apiUrl = "https://rapi-eu-west.recombee.com";

// Recommend Items to User
export const recommendItems = action({
  args: {
    queryStrings: v.string(),
    anonId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    try {
      // Get User ID
      const userIdResult = await ctx.runQuery(internal.users.getUserId);
      let userId = userIdResult;
      if (!userId) {
        // If no user ID found, use anonId if provided
        userId = args.anonId ? (args.anonId as Id<"users">) : null;

        if (!userId) {
          console.error(
            "[Recombee] ERROR: No user id found from getUserId query and no anonId provided",
          );
          throw new Error("No user id found");
        }
      }

      // Get URI and Hash
      const databaseId = process.env.RECOMBEE_DB_ID as string;

      const uri = `/${databaseId}/recomms/users/${userId}/items/${args.queryStrings}`;

      const { hmac_timestamp, hmac_sign } = await ctx.runAction(
        internal.helpers.signRecombeeUri,
        {
          uri,
        },
      );
      const fullUrl = `${apiUrl}${uri}&hmac_timestamp=${hmac_timestamp}&hmac_sign=${hmac_sign}`;

      // Extract scenario from the query string
      const params = new URLSearchParams(args.queryStrings);
      const scenario = params.get("scenario");

      // If anonId is provided, skip caching and fetch recommendation
      if (args.anonId && !userIdResult) {
        const result = await fetchRecommendation(
          fullUrl,
          hmac_sign,
          userId,
          scenario ?? "",
          databaseId,
        );
        return result;
      }

      // Check if Cache exists
      const cache: Doc<"recommCache"> = await ctx.runMutation(
        internal.recommend.cache,
        {
          scenario: scenario ?? "", // Use scenario for caching, with a fallback
          userId,
        },
      );

      // Cache valid for 1 hour
      const oneHour = 60 * 60 * 1000;

      // If cache is still valid
      if (cache.data && Date.now() - cache.updatedAt < oneHour) {
        console.log(
          "[Recombee] Returning cached data (cache age:",
          Date.now() - cache.updatedAt,
          "ms)",
        );
        const validCache = cache.data as RecommendationResponse;

        return validCache;
      }

      console.log(
        "[Recombee] Cache miss or expired, fetching from Recombee API...",
      );

      // Fetch recommendations
      const data = await fetchRecommendation(
        fullUrl,
        hmac_sign,
        userId,
        scenario ?? "",
        databaseId,
      );

      // Update Cache
      await ctx.runMutation(internal.recommend.updateCache, {
        cacheId: cache._id,
        scenario: scenario ?? "default",
        data,
      });

      return data;
    } catch (err) {
      console.error("Error fetching recommendations:", err);
      return null;
    }
  },
});

// Fetch Recommendation
async function fetchRecommendation(
  fullUrl: string,
  hmac_sign: string,
  userId: Id<"users">,
  scenario: string,
  databaseId: string,
) {
  const res = await fetch(fullUrl, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${process.env.RECOMBEE_PRIVATE_TOKEN as string}`,
    },
  });

  console.log("[Recombee] Response status:", res.status, res.statusText);

  if (!res.ok) {
    // Get the response body for more details
    let errorBody = "";
    try {
      errorBody = await res.text();
      console.error("[Recombee] Error response body:", errorBody);
    } catch (e) {
      console.error("[Recombee] Could not read error response body");
    }

    console.error("[Recombee] Request failed with status:", res.status);
    console.error(
      "[Recombee] Request URL was:",
      fullUrl.replace(hmac_sign, "[REDACTED]"),
    );
    console.error("[Recombee] User ID:", userId);
    console.error("[Recombee] Scenario:", scenario);
    console.error("[Recombee] Database ID:", databaseId);

    throw new Error(
      `Recombee request failed: ${res.statusText} - ${errorBody}`,
    );
  }

  const data: RecommendationResponse = await res.json();
  console.log(
    "[Recombee] SUCCESS: Received",
    data.recomms?.length ?? 0,
    "recommendations",
  );
  console.log("[Recombee] Response recommId:", data.recommId);

  return data;
}

//////////////////////////////////////////////////////
// Check if there is  an existing Cache
export const cache = internalMutation({
  args: { userId: v.id("users"), scenario: v.string() },
  handler: async (ctx, args) => {
    // Check if cache exists and is still valid
    const cache = await ctx.db
      .query("recommCache")
      .withIndex("by_user", (q) =>
        q.eq("userId", args.userId).eq("scenario", args.scenario),
      )
      .unique();

    if (!cache) {
      // Create an cache record if none is found which will later be populated with recommendation data
      const cacheId = await ctx.db.insert("recommCache", {
        userId: args.userId,
        data: null,
        updatedAt: Date.now(),
        scenario: args.scenario,
      });
      return (await ctx.db.get(cacheId)) as Doc<"recommCache">;
    }
    return cache;
  },
});

///////////////////////////////////////////////////////////
// Update Cache Record
export const updateCache = internalMutation({
  args: {
    cacheId: v.id("recommCache"),
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
