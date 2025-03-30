import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getCurrentUserOrThrow } from "./users";

// Get all products
export const getAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("product").collect();
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

// Get products by store ID
export const getByStoreId = query({
  args: { storeId: v.id("store") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("product")
      .filter((q) => q.eq(q.field("storeId"), args.storeId))
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
    storeId: v.id("store"),
    category: v.optional(v.string()),
    plan: v.union(v.literal("basic"), v.literal("pro"), v.literal("premium")),
    exchange: v.boolean(),
    condition: v.boolean(),
    location: v.union(v.literal("Enugu"), v.literal("Nsuka")),
    link: v.optional(v.string()),
    negotiable: v.optional(v.boolean()),
    commentsId: v.id("comments"),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);

    const productId = await ctx.db.insert("product", {
      userId: user._id,
      title: args.title,
      description: args.description,
      images: args.images,
      price: args.price,
      storeId: args.storeId,
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
    });

    return productId;
  },
});

// Update a product
export const update = mutation({
  args: {
    productId: v.id("product"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    images: v.optional(v.array(v.string())),
    price: v.optional(v.number()),
    category: v.optional(v.string()),
    adType: v.optional(
      v.union(v.literal("basic"), v.literal("pro"), v.literal("premium"))
    ),
    exchangePossible: v.optional(v.boolean()),
    condition: v.optional(v.boolean()),
    location: v.optional(v.union(v.literal("Enugu"), v.literal("Nsuka"))),
    link: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);
    const product = await ctx.db.get(args.productId);

    if (!product) {
      throw new Error("Product not found");
    }

    if (product.userId !== user._id) {
      throw new Error("Unauthorized to update this product");
    }

    const updates: Record<string, any> = {};

    // Build updates object with only the fields that were provided
    const updateFields = [
      "name",
      "description",
      "images",
      "price",
      "category",
      "adType",
      "exchangePossible",
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
    const product = await ctx.db.get(args.productId);

    if (!product) {
      throw new Error("Product not found");
    }

    await ctx.db.patch(args.productId, {
      likes: (product.likes || 0) + 1,
    });

    // Notify product owner
    const user = await getCurrentUserOrThrow(ctx);

    await ctx.db.insert("notifications", {
      userId: product.userId,
      type: "new_like",
      relatedId: args.productId,
      title: `${user.name} liked your product`,
      content: `${user.name} liked your product "${product.title}"`,
      imageUrl: user.imageUrl,
      isRead: false,
      timestamp: Date.now(),
      link: `/products/${args.productId}`,
    });

    return args.productId;
  },
});

// Dislike a product
export const dislikeProduct = mutation({
  args: { productId: v.id("product") },
  handler: async (ctx, args) => {
    const product = await ctx.db.get(args.productId);

    if (!product) {
      throw new Error("Product not found");
    }

    await ctx.db.patch(args.productId, {
      dislikes: (product.dislikes || 0) + 1,
    });

    return args.productId;
  },
});

// Search products with advanced filtering and sorting
export const search = query({
  args: {
    query: v.string(),
    location: v.optional(v.union(v.literal("Enugu"), v.literal("Nsuka"))),
    category: v.optional(v.string()),
    minPrice: v.optional(v.number()),
    maxPrice: v.optional(v.number()),
    condition: v.optional(v.boolean()),
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
            return b.likes - b.dislikes - (a.likes - a.dislikes);
        }
      }
      return 0;
    });

    return products;
  },
});

// Get personalized product recommendations
export const getRecommendations = query({
  args: {
    userId: v.id("users"),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 10;
    const user = await ctx.db.get(args.userId);

    if (!user) {
      throw new Error("User not found");
    }

    // Get user's liked products
    const userProducts = await ctx.db
      .query("product")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .collect();

    // Get all products except user's own
    let allProducts = await ctx.db
      .query("product")
      .filter((q) => q.neq(q.field("userId"), args.userId))
      .collect();

    // Calculate product scores based on multiple factors
    const scoredProducts = allProducts.map((product) => {
      let score = 0;

      // 1. Ad Type Priority (30% weight)
      const adTypeScore = {
        premium: 3,
        pro: 2,
        basic: 1,
      }[product.plan];
      score += adTypeScore * 0.3;

      // 2. Engagement Score (20% weight)
      const engagementScore =
        (product.likes - product.dislikes) /
        (product.likes + product.dislikes + 1); // Add 1 to avoid division by zero
      score += engagementScore * 0.2;

      // 3. Recency Score (20% weight)
      const daysOld =
        (Date.now() - new Date(product.timeStamp).getTime()) /
        (1000 * 60 * 60 * 24);
      const recencyScore = Math.exp(-daysOld / 15); // Exponential decay over 15 days
      score += recencyScore * 0.2;

      // 4. Category Match Score (15% weight)
      if (userProducts.length > 0) {
        const userCategories = userProducts
          .map((p) => p.category)
          .filter((c): c is string => c !== undefined);

        if (userCategories.length > 0) {
          const categoryMatch = userCategories.includes(product.category || "");
          score += (categoryMatch ? 1 : 0) * 0.15;
        }
      }

      // 5. Location Match Score (15% weight)
      const locationMatch = userProducts.some(
        (p) => p.location === product.location
      );
      score += (locationMatch ? 1 : 0) * 0.15;

      return { product, score };
    });

    // Sort by score and get top recommendations
    const recommendations = scoredProducts
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map((item) => item.product);

    return recommendations;
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
      const engagementVelocity = (product.likes - product.dislikes) / daysOld;

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
