import { internal } from "./_generated/api";
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getCurrentUser } from "./users";
// Create a new store
export const createStore = mutation({
  args: {
    name: v.string(),
    location: v.string(),
    description: v.string(),
    image: v.optional(v.string()),
    phone: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const user = await getCurrentUser(ctx);

    if (!user) {
      throw new Error("User not found");
    }

    const storeId = await ctx.db.insert("store", {
      name: args.name,
      location: args.location,
      description: args.description,
      image: args.image,
      userId: user._id,
      phone: args.phone,
    });

    await ctx.runMutation(internal.notifications.createNotification, {
      title: "New Store Created",
      content: `Your store ${args.name} has been created successfully`,
      imageUrl: args.image,
      isRead: false,
      timestamp: Date.now(),
      link: `/store/${storeId}`,
      type: "advertisement",
    });

    return storeId;
  },
});

export const addImage = mutation({
  args: {
    storeId: v.id("store"),
    image: v.string(),
  },
  handler: async (ctx, args) => {
    const store = await ctx.db.get(args.storeId);
    if (!store) {
      throw new Error("Store not found");
    }
    const update = await ctx.db.patch(args.storeId, {
      image: args.image,
    });
    return update;
  },
});

// Get a store by ID
export const getStore = query({
  args: { id: v.id("store") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Get all stores
export const getAllStores = query({
  handler: async (ctx) => {
    return await ctx.db.query("store").collect();
  },
});

// Get stores by userId
export const getStoresByUserId = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const user = await ctx.db
      .query("users")
      .withIndex("byExternalId", (q) => q.eq("externalId", identity.subject))
      .unique();

    if (!user) return [];

    return await ctx.db
      .query("store")
      .filter((q) => q.eq(q.field("userId"), user._id))
      .collect();
  },
});

// Update a store
export const updateStore = mutation({
  args: {
    id: v.id("store"),
    name: v.optional(v.string()),
    location: v.optional(v.string()),
    description: v.optional(v.string()),
    image: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...fieldsToUpdate } = args;

    await ctx.db.patch(id, fieldsToUpdate);
    return id;
  },
});

// Delete a store
export const deleteStore = mutation({
  args: { id: v.id("store") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return args.id;
  },
});

export const getStoreByUserId = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const store = await ctx.db
      .query("store")
      .withIndex("byUserId", (q) => q.eq("userId", args.userId))
      .first();

    return store;
  },
});
