import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUserOrThrow } from "./users";

export const insertSearchHistory = mutation({
  args: {
    search: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);
    if (!user) {
      throw new Error("Not authenticated");
    }
    await ctx.db.insert("history", {
      userId: user._id,
      search: args.search,
      timeStamp: Date.now().toString(),
    });
  },
});

export const getSearchHistory = query({
  handler: async (ctx) => {
    try {
      const user = await getCurrentUserOrThrow(ctx);
      // return await ctx.db
      //   .query("history")
      //   .withIndex("by_userId")
      //   .filter((q) => q.eq(q.field("userId"), user._id))
      //   .order("desc")
      //   .take(10);
      return await ctx.db
        .query("history")
        .filter((q) => q.eq(q.field("userId"), user._id))
        .order("desc")
        .take(10);
    } catch (err) {
      console.log(err);
    }
  },
});

export const deleteSearchHistory = mutation({
  args: {
    searchId: v.id("history"),
  },
  handler: async (ctx, args) => {
    try {
      await ctx.db.delete(args.searchId);
    } catch (err) {
      console.log(err);
    }
  },
});
