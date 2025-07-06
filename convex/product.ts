import { query, mutation } from "./_generated/server";
import { ConvexError, v } from "convex/values";
import { getCurrentUserOrThrow } from "./users";

export const errorObject = {
  status: 401,
  message: "Authentication Required",
  code: "USER_NOT_FOUND",
};
// Get all products
export const getAll = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const allProducts = await ctx.db.query("product").collect();

    return allProducts.slice(0, args.limit || allProducts.length);
  },
});

// Get product by ID
export const getById = query({
  args: { productId: v.id("product") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.productId);
  },
});

// Get products by user ID
export const getByUserId = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("product")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .collect();
  },
});

// Get products by business ID
export const getByBusinessId = query({
  args: { businessId: v.optional(v.id("store")) },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("product")
      .filter((q) => q.eq(q.field("businessId"), args.businessId))
      .collect();
  },
});

// Get products by category
export const getByCategory = query({
  args: { category: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("product")
      .filter((q) => q.eq(q.field("category"), args.category))
      .collect();
  },
});

// Get products by location
export const getByLocation = query({
  args: { location: v.union(v.literal("Enugu"), v.literal("Nsuka")) },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("product")
      .filter((q) => q.eq(q.field("location"), args.location))
      .collect();
  },
});

// Create a new product
export const create = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    images: v.array(v.string()),
    price: v.number(),
    businessId: v.id("store"),
    category: v.string(),
    plan: v.union(v.literal("basic"), v.literal("pro"), v.literal("premium")),
    exchange: v.boolean(),
    condition: v.union(v.literal("brand new"), v.literal("used")),
    location: v.union(v.literal("enugu"), v.literal("nsukka")),
    link: v.optional(v.string()),
    commentsId: v.optional(v.id("comments")),
    negotiable: v.optional(v.boolean()),
    phone: v.string(),
    store: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);
    if (!user) {
      throw Error("User must be authenticated to perform this action");
    }

    const productId = await ctx.db.insert("product", {
      userId: user._id,
      title: args.title,
      description: args.description,
      images: args.images,
      price: args.price,
      businessId: args.businessId,
      commentsId: args.commentsId,
      category: args.category,
      likes: 0,
      dislikes: 0,
      plan: args.plan,
      negotiable: args.negotiable,
      exchange: args.exchange,
      condition: args.condition,
      timeStamp: new Date().toISOString(),
      location: args.location,
      link: args.link,
      phone: args.phone,
      store: args.store,
    });

    return productId;
  },
});

// Update a product
export const update = mutation({
  args: {
    productId: v.id("product"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    images: v.optional(v.array(v.string())),
    price: v.optional(v.number()),
    category: v.optional(v.string()),
    plan: v.optional(
      v.union(v.literal("basic"), v.literal("pro"), v.literal("premium"))
    ),
    exchange: v.optional(v.boolean()),
    condition: v.optional(v.boolean()),
    location: v.optional(v.union(v.literal("Enugu"), v.literal("Nsuka"))),
    link: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);
    const product = await ctx.db.get(args.productId);

    if (!user) {
      return errorObject;
    }

    if (!product) {
      throw new Error("Product not found");
    }

    if (product.userId !== user._id) {
      throw new Error("Unauthorized to update this product");
    }

    const updates: Record<string, any> = {};

    // Build updates object with only the fields that were provided
    const updateFields = [
      "title",
      "description",
      "images",
      "price",
      "category",
      "plan",
      "exchange",
      "condition",
      "location",
      "link",
    ] as const;

    // Type-safe way to build the updates object
    for (const field of updateFields) {
      if (args[field] !== undefined) {
        updates[field] = args[field];
      }
    }

    // Add timestamp to track when the product was last updated
    updates.timeStamp = new Date().toISOString();

    await ctx.db.patch(args.productId, updates);

    return args.productId;
  },
});

// Delete a product
export const remove = mutation({
  args: { productId: v.id("product") },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);
    const product = await ctx.db.get(args.productId);

    if (!user) {
      return errorObject;
    }

    if (!product) {
      throw new Error("Product not found");
    }

    if (product.userId !== user._id) {
      throw new Error("Unauthorized to delete this product");
    }

    await ctx.db.delete(args.productId);

    return args.productId;
  },
});

// Like a product
export const likeProduct = mutation({
  args: { productId: v.id("product") },
  handler: async (ctx, args) => {
    // Check if user exists
    const user = await getCurrentUserOrThrow(ctx);
    if (!user) {
      throw Error("You need to be logged in to like this product");
    }

    // Check if product exists
    const product = await ctx.db.get(args.productId);

    if (!product) {
      throw new Error("Product not found");
    }

    // Check if user has already liked this product
    const existingLike = await ctx.db
      .query("likes")
      .filter((q) =>
        q.and(
          q.eq(q.field("productId"), args.productId),
          q.eq(q.field("userId"), user._id),
          q.or(q.eq(q.field("liked"), true), q.eq(q.field("disliked"), true))
        )
      )
      .first();

    // If product is already disliked
    if (existingLike?.disliked) {
      await ctx.db.patch(existingLike._id, { liked: true, disliked: false });
      await ctx.db.patch(args.productId, {
        likes: (product.likes || 0) + 1,
        dislikes: (product.dislikes || 0) - 1,
      });
      return;
    }

    // If product is already liked
    if (existingLike) {
      await ctx.db.delete(existingLike._id);
      await ctx.db.patch(args.productId, {
        likes: (product.likes || 0) - 1,
      });
      return;
    }

    // If product hasn't been liked before
    await ctx.db.insert("likes", {
      timeStamp: new Date().toISOString(),
      productId: args.productId,
      userId: user._id,
      liked: true,
      disliked: false,
    });

    await ctx.db.patch(args.productId, {
      likes: (product.likes || 0) + 1,
    });

    return args.productId;
  },
});

export const getLikeByProductId = query({
  args: { productId: v.id("product") },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);
    if (!user) {
      return;
    }
    const product = await ctx.db.get(args.productId);

    const like = await ctx.db
      .query("likes")
      .filter((q) =>
        q.and(
          q.eq(q.field("productId"), product?._id),
          q.eq(q.field("userId"), user?._id)
        )
      )
      .first();
    if (!like) {
      return null;
    }
    return like;
  },
});

// Dislike a product
export const dislikeProduct = mutation({
  args: { productId: v.id("product") },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);
    const product = await ctx.db.get(args.productId);

    if (!user) {
      return {
        status: 401,
        message: "Authentication Required",
        code: "USER_NOT_FOUND",
      };
    }

    if (!product) {
      throw new Error("Product not found");
    }

    const existingDislike = await ctx.db
      .query("likes")
      .filter((q) =>
        q.and(
          q.eq(q.field("productId"), args.productId),
          q.eq(q.field("userId"), user._id),
          q.or(q.eq(q.field("liked"), true), q.eq(q.field("disliked"), true))
        )
      )
      .first();

    if (existingDislike?.liked) {
      await ctx.db.patch(existingDislike._id, { liked: false, disliked: true });
      await ctx.db.patch(args.productId, {
        likes: (product.likes || 0) - 1,
        dislikes: (product.dislikes || 0) + 1,
      });
      return;
    }

    if (existingDislike) {
      await ctx.db.delete(existingDislike?._id);
      await ctx.db.patch(args.productId, {
        dislikes: (product.dislikes || 0) - 1,
      });
      return;
    }

    await ctx.db.insert("likes", {
      timeStamp: new Date().toISOString(),
      productId: args.productId,
      userId: user._id,
      liked: false,
      disliked: true,
    });
    await ctx.db.patch(args.productId, {
      dislikes: (product.dislikes || 0) + 1,
    });

    return args.productId;
  },
});

// Add to wishlist and saved

export const addBookmark = mutation({
  args: {
    productId: v.id("product"),
    type: v.union(v.literal("saved"), v.literal("wishlist")),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);
    if (!user) {
      return;
    }

    const wishListed = await ctx.db
      .query("bookmarks")
      .filter((q) =>
        q.and(
          q.eq(q.field("productId"), args.productId),
          q.eq(q.field("userId"), user._id),
          q.eq(q.field("type"), args.type)
        )
      )
      .first();

    if (wishListed) {
      await ctx.db.delete(wishListed._id);
      return "removed";
    }

    const bookmarkId = await ctx.db.insert("bookmarks", {
      productId: args.productId,
      type: args.type,
      timeStamp: new Date().toISOString(),
      userId: user._id,
      added: true,
    });

    return await ctx.db.get(bookmarkId);
  },
});

export const getSavedOrWishlistProduct = query({
  args: { productId: v.id("product"), type: v.string() },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);
    if (!user) {
      return { success: false, error: errorObject, data: null };
    }

    const product = await ctx.db.get(args.productId);
    if (!product) {
      return {
        success: false,
        error: {
          status: 404,
          message: "Product does not exist",
          code: "PRODUCT_NOT_FOUND",
        },
        data: null,
      };
    }
    const saved = await ctx.db
      .query("bookmarks")
      .filter((q) =>
        q.and(
          q.eq(q.field("productId"), product._id),
          q.eq(q.field("userId"), user._id),
          q.eq(q.field("type"), args.type)
        )
      )
      .first();
    return { success: true, error: null, data: saved };
  },
});

export const getAllSavedOrWishlist = query({
  args: {
    type: v.union(v.literal("saved"), v.literal("wishlist")),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);
    if (!user) {
      return { error: errorObject, success: false, data: null };
    }
    const saved = await ctx.db
      .query("bookmarks")
      .filter((q) =>
        q.and(
          q.eq(q.field("userId"), user._id),
          q.eq(q.field("type"), args.type)
        )
      )
      .collect();

    const savedList = await Promise.all(
      saved.map(async (item) => {
        const product = await ctx.db.get(item.productId);
        return product;
      })
    );

    return { success: true, data: savedList, error: null };
  },
});

// Search products with advanced filtering and sorting
export const search = query({
  args: {
    type: v.union(v.literal("suggestions"), v.literal("search")),
    query: v.string(),
    location: v.optional(v.string()),
    category: v.optional(v.string()),
    minPrice: v.optional(v.number()),
    maxPrice: v.optional(v.number()),
    condition: v.optional(v.union(v.literal("brand new"), v.literal("used"))),
    exchangePossible: v.optional(v.boolean()),
    sortBy: v.optional(
      v.union(
        v.literal("price_asc"),
        v.literal("price_desc"),
        v.literal("newest"),
        v.literal("popular")
      )
    ),
  },
  handler: async (ctx, args) => {
    const searchQuery = args.query.toLowerCase();
    let products = await ctx.db.query("product").collect();

    // Apply text search filter
    products = products.filter(
      (product) =>
        product.title.toLowerCase().includes(searchQuery) ||
        product.description.toLowerCase().includes(searchQuery) ||
        (product.category &&
          product.category.toLowerCase().includes(searchQuery))
    );

    // Apply location filter
    if (args.location) {
      products = products.filter(
        (product) => product.location === args.location
      );
    }

    // Apply category filter
    if (args.category) {
      products = products.filter(
        (product) =>
          product.category &&
          product.category.toLowerCase() === args.category?.toLowerCase()
      );
    }

    // Apply price range filter
    if (args.minPrice !== undefined) {
      products = products.filter((product) => product.price >= args.minPrice!);
    }
    if (args.maxPrice !== undefined) {
      products = products.filter((product) => product.price <= args.maxPrice!);
    }

    // Apply condition filter
    if (args.condition !== undefined) {
      products = products.filter(
        (product) => product.condition === args.condition
      );
    }

    // Apply exchangePossible filter
    if (args.exchangePossible !== undefined) {
      products = products.filter(
        (product) => product.exchange === args.exchangePossible
      );
    }

    // Define ad type priority
    const adTypePriority = {
      premium: 3,
      pro: 2,
      basic: 1,
    };

    // Sort products based on criteria and ad type priority
    products.sort((a, b) => {
      // First sort by ad type priority
      const adTypeDiff = adTypePriority[b.plan] - adTypePriority[a.plan];
      if (adTypeDiff !== 0) return adTypeDiff;

      // Then apply the requested sort order
      if (args.sortBy) {
        switch (args.sortBy) {
          case "price_asc":
            return a.price - b.price;
          case "price_desc":
            return b.price - a.price;
          case "newest":
            return (
              new Date(b.timeStamp).getTime() - new Date(a.timeStamp).getTime()
            );
          case "popular":
            return (
              (b?.likes ?? 0) -
              (b?.dislikes ?? 0) -
              ((a?.likes ?? 0) - (a?.dislikes ?? 0))
            );
        }
      }
      return 0;
    });

    if (args.type === "suggestions") {
      return products.map((item) => item.title);
    }
    if (args.type === "search") {
      return products;
    }
  },
});

// Get personalized product recommendations
export const getRecommendations = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);
    const limit = args.limit || 10;

    if (!user) {
      return { success: false, error: errorObject, data: null };
    }
    // Query db based on user likes
    const likedProducts = await ctx.db
      .query("likes")
      .filter((q) => q.eq(q.field("userId"), user._id))
      .collect();
    // Query db based on user bookmarks
    const bookmarkedProducts = await ctx.db
      .query("bookmarks")
      .filter((q) => q.eq(q.field("userId"), user._id))
      .collect();

    // Get user's liked products
    // const userProducts = await ctx.db
    //   .query("product")
    //   .filter((q) => q.eq(q.field("userId"), user._id))
    //   .collect();

    // Get all products except user's own
    let allProducts = await ctx.db
      .query("product")
      .filter((q) => q.neq(q.field("userId"), user._id))
      .collect();

    const scoreProducts = allProducts.map((product) => {
      // score determines if product is recommended or not
      let score = 0;

      // User Interaction (35% weight)
      // Check in all products, the ones the user has liked
      const hasLiked = likedProducts.some(
        (like) => like.productId === product._id && like.liked
      );

      // Check in all products, the ones the user has liked
      const hasBookmarked = bookmarkedProducts.some(
        (bookmark) => bookmark.productId === product._id && bookmark.added
      );

      // If liked or bookmarked, add to score
      score += (hasLiked ? 0.2 : 0) + (hasBookmarked ? 0.15 : 0);
      // Calculate product scores based on multiple factors

      // Net positive likes / total  feedback volume (25% weight)
      const popularity =
        (product.likes ?? 0) -
        (product.dislikes ?? 0) /
          Math.max(1, (product.likes ?? 0) + (product.dislikes ?? 0));
      score += popularity * 0.25;

      // Time posted (20% weight)
      const daysSincePosted =
        Date.now() -
        (new Date(product.timeStamp).getTime() / 1000) * 60 * 60 * 24;

      const recencyScore = Math.exp(-daysSincePosted / 30); // 30-day decay
      score += recencyScore * 0.2;

      //Ad Type Priority (20 weight)
      const adTypeScore = {
        premium: 1.0,
        pro: 0.7,
        basic: 0.4,
      }[product.plan];
      score += adTypeScore * 0.2;

      // // 4. Category Match Score (15% weight)
      // if (userProducts.length > 0) {
      //   const userCategories = userProducts
      //     .map((p) => p.category)
      //     .filter((c): c is string => c !== undefined);

      //   if (userCategories.length > 0) {
      //     const categoryMatch = userCategories.includes(product.category || "");
      //     score += (categoryMatch ? 1 : 0) * 0.15;
      //   }
      // }

      // // 5. Location Match Score (15% weight)
      // const locationMatch = userProducts.some(
      //   (p) => p.location === product.location
      // );
      // score += (locationMatch ? 1 : 0) * 0.15;

      return { product, score };
    });

    // Sort by score and get top recommendations
    const recommendations = scoreProducts
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map((item) => item.product);

    return { success: true, error: null, data: recommendations };
  },
});

// Get trending products
export const getTrending = query({
  args: {
    limit: v.optional(v.number()),
    timeFrame: v.optional(
      v.union(v.literal("day"), v.literal("week"), v.literal("month"))
    ),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 10;
    const timeFrame = args.timeFrame || "week";

    // Calculate time threshold based on timeFrame
    const now = Date.now();
    const timeThreshold = {
      day: now - 24 * 60 * 60 * 1000,
      week: now - 7 * 24 * 60 * 60 * 1000,
      month: now - 30 * 24 * 60 * 60 * 1000,
    }[timeFrame];

    // Get all products
    let products = await ctx.db.query("product").collect();

    // Calculate trending scores
    const scoredProducts = products.map((product) => {
      const timestamp = new Date(product.timeStamp).getTime();

      // Only consider recent products
      if (timestamp < timeThreshold) {
        return { product, score: 0 };
      }

      // Calculate engagement velocity (likes per day)
      const daysOld = (now - timestamp) / (1000 * 60 * 60 * 24);
      const engagementVelocity =
        ((product.likes ?? 0) - (product.dislikes ?? 0)) / daysOld;

      // Calculate final score
      const score = engagementVelocity * (product.plan === "premium" ? 1.5 : 1);

      return { product, score };
    });

    // Sort by score and get top trending products
    const trending = scoredProducts
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map((item) => item.product);

    return trending;
  },
});

// Get similar products based on a product ID
export const getSimilarProducts = query({
  args: {
    productId: v.id("product"),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 10;

    // Get the target product
    const targetProduct = await ctx.db.get(args.productId);
    if (!targetProduct) {
      throw new Error("Product not found");
    }

    // Get all products except the target product
    let allProducts = await ctx.db
      .query("product")
      .filter((q) => q.neq(q.field("_id"), args.productId))
      .collect();

    // Calculate similarity scores
    const scoredProducts = allProducts.map((product) => {
      let score = 0;

      // 1. Name Similarity (30% weight)
      const nameSimilarity = calculateTextSimilarity(
        targetProduct.title.toLowerCase(),
        product.title.toLowerCase()
      );
      score += nameSimilarity * 0.3;

      // 2. Description Similarity (30% weight)
      const descriptionSimilarity = calculateTextSimilarity(
        targetProduct.description.toLowerCase(),
        product.description.toLowerCase()
      );
      score += descriptionSimilarity * 0.3;

      // 3. Category Match (15% weight)
      if (targetProduct.category && product.category) {
        const categoryMatch =
          targetProduct.category.toLowerCase() ===
          product.category.toLowerCase();
        score += (categoryMatch ? 1 : 0) * 0.15;
      }

      // 4. Price Range Similarity (10% weight)
      const priceDiff = Math.abs(targetProduct.price - product.price);
      const maxPrice = Math.max(targetProduct.price, product.price);
      const minPrice = Math.min(1, maxPrice); // Avoid division by zero
      const priceSimilarity = 1 - priceDiff / (maxPrice || 1);
      score += priceSimilarity * 0.1;

      // 5. Location Match (5% weight)
      const locationMatch = targetProduct.location === product.location;
      score += (locationMatch ? 1 : 0) * 0.05;

      // 6. Condition Match (5% weight)
      const conditionMatch = targetProduct.condition === product.condition;
      score += (conditionMatch ? 1 : 0) * 0.05;

      // 7. Exchange Possibility Match (5% weight)
      const exchangeMatch = targetProduct.exchange === product.exchange;
      score += (exchangeMatch ? 1 : 0) * 0.05;

      // Ad Type Boost - Apply a slight multiplier for premium ads
      const adTypeBoost = {
        premium: 1.1,
        pro: 1.05,
        basic: 1,
      }[product.plan];
      score *= adTypeBoost;

      return { product, score };
    });

    // Sort by score and get top similar products
    const similarProducts = scoredProducts
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map((item) => item.product);

    return similarProducts;
  },
});

// Helper function to calculate text similarity using Jaccard similarity
function calculateTextSimilarity(text1: string, text2: string): number {
  // Split texts into words and create sets
  const words1 = new Set(text1.split(/\s+/).filter((word) => word.length > 2));
  const words2 = new Set(text2.split(/\s+/).filter((word) => word.length > 2));

  // Calculate intersection and union sizes
  const intersection = new Set([...words1].filter((word) => words2.has(word)));
  const union = new Set([...words1, ...words2]);

  // Jaccard similarity: size of intersection / size of union
  return union.size === 0 ? 0 : intersection.size / union.size;
}

// Get Products by category

export const getProductsByCategory = query({
  args: { category: v.string() },
  handler: async (ctx, args) => {
    const user = getCurrentUserOrThrow(ctx);

    if (!user) {
      throw Error("User is not logged in");
    }
    const products = await ctx.db
      .query("product")
      .filter((q) => q.eq(q.field("category"), args.category))
      .collect();
    return products;
  },
});

// Get Products by Filters
export const getProductsByFilters = query({
  args: {
    category: v.string(),
    min: v.number(),
    max: v.number(),
    priceRange: v.string(),
    location: v.string(),
  },
  handler: async (ctx, args) => {
    console.log(args);

    let query = ctx.db
      .query("product")
      .filter((q) => q.eq(q.field("category"), args.category));

    // Apply location filter if provided
    if (args.location) {
      query = query.filter((q) => q.eq(q.field("location"), args.location));
    }

    // Apply price range filter if min and max are provided
    if (args.min && args.max) {
      query = query.filter((q) =>
        q.and(
          q.gte(q.field("price"), args.min),
          q.lte(q.field("price"), args.max)
        )
      );
    }

    // Apply predefined price range filter if provided
    if (args.priceRange) {
      const ranges = {
        cheap: { min: 0, max: 100000 },
        affordable: { min: 100000, max: 500000 },
        moderate: { min: 500000, max: 1500000 },
        expensive: { min: 1500000, max: 3500000 },
      };
      const range = ranges[args.priceRange as keyof typeof ranges];
      if (range) {
        query = query.filter((q) =>
          q.and(
            q.gte(q.field("price"), range.min),
            q.lte(q.field("price"), range.max)
          )
        );
      }
    }

    return await query.collect();
  },
});

// Get newly posted products

export const getNewProducts = query({
  handler: async (ctx) => {
    let numDaysAge = 7;
    // Get the timestamp of 10 days ago
    const tenDaysAgo = Date.now() - numDaysAge * 24 * 60 * 60 * 1000;

    // Get products not older than 7 days
    let products = await ctx.db
      .query("product")
      .filter((q) => q.gte(q.field("_creationTime"), tenDaysAgo))
      .order("desc")
      .collect();

    return products;
  },
});
