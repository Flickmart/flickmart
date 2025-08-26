import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUserOrThrow } from "./users";

// Gather and store User Interaction Data
const storeUsageData = mutation({
  args: {
    productId: v.id("product"),
    type: v.string(),
    value: v.number(),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);

    if (!user) {
      throw Error("User not found");
    }
    await ctx.db.insert("interactions", {
      productId: args.productId,
      type: args.type,
      value: args.value,
      timeStamp: Date.now(),
      userId: user._id,
    });
  },
});

// Train Model and return  recommendation
export const getPersonalizedProducts = query({
  handler: async (ctx) => {
    const user = await getCurrentUserOrThrow(ctx);

    // if (!user) {
    //   throw Error("User not found");
    // }
    // Get the products to train the Model with
    const allProducts = await ctx.db.query("product").collect();

    // Build User profile
    const likedProducts = await ctx.db
      .query("likes")
      .filter((q) => q.eq(q.field("userId"), user?._id))
      .collect();

    //   Set of all product liked by a user
    const likedSet = new Set(likedProducts.map((item) => item.productId));

    const liked = allProducts.filter((p) => likedSet.has(p._id));
    const userProfile = new Set(
      liked.flatMap((p) => [
        p.subcategory ?? "",
        p.condition,
        p.location,
        p.plan,
        p.category,
      ])
    );

    // Score Each product
    const scores = allProducts
      .filter((p) => !likedSet.has(p._id))
      .map((p) => {
        const itemProfile = new Set([
          p.subcategory ?? "",
          p.condition,
          p.location,
          p.plan,
          p.category,
        ]);
        return {
          product: p,
          score: jaccard(userProfile, itemProfile),
        };
      });

    function jaccard(setA: Set<string>, setB: Set<string>) {
      const intersection = new Set([...setA].filter((x) => setB.has(x)));
      const union = new Set([...setA, ...setB]);
      return intersection.size / union.size;
    }

    return scores
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)
      .map((s) => s.product);
  },
});

// Collaborative Filtering
export const getPopularProducts = query({
  handler: async (ctx) => {
    // Get User
    const user = await getCurrentUserOrThrow(ctx);
    if (!user) {
      return { status: "error", code: 401, message: "Unauthorized" };
    }

    // Get all interaction data we will use
    const likes = await ctx.db.query("likes").collect();
    const views = await ctx.db.query("views").collect();
    const comments = await ctx.db.query("comments").collect();
    const bookmarks = await ctx.db.query("bookmarks").collect();

    // Build a matrix where other user interactions will be kept
    const users = [
      ...new Set(likes.map((item) => item.userId)),
      ...new Set(views.map((item) => item.userId)),
      ...new Set(comments.map((item) => item.userId)),
      ...new Set(bookmarks.map((item) => item.userId)),
    ];

    const products = [
      ...new Set(likes.map((item) => item.productId)),
      ...new Set(views.map((item) => item.productId)),
      ...new Set(comments.map((item) => item.productId)),
      ...new Set(bookmarks.map((item) => item.productId)),
    ];

    // Initialize Matrix with nulls
    const matrix = {};
  },
});
