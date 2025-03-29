import { query, mutation, internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { getCurrentUser } from "./users";
export const createNotification = internalMutation({
  args: {
    type: v.union(
      v.literal("new_message"),
      v.literal("new_like"),
      v.literal("new_comment"),
      v.literal("new_sale"),
      v.literal("advertisement"),
      v.literal("reminder")
    ),
    relatedId: v.optional(
      v.union(
        v.id("product"),
        v.id("message"),
        v.id("comments"),
        v.id("conversations"),
        v.id("users")
      )
    ),
    title: v.string(),
    content: v.string(),
    imageUrl: v.optional(v.string()),
    isRead: v.boolean(),
    timestamp: v.number(),
    link: v.optional(v.string()),
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

    const notificationId = await ctx.db.insert("notifications", {
      userId: user._id,
      type: args.type,
      title: args.title,
      relatedId: args.relatedId,
      content: args.content,
      imageUrl: args.imageUrl,
      isRead: false,
      timestamp: Date.now(),
      link: args.link,
    });

    return notificationId;
  },
});



export const test = mutation({
    handler:async(ctx)=>{
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Unauthorized");
        }
        const user = await getCurrentUser(ctx);

        if (!user) {
            throw new Error("User not found");
        }

       
        const post = await ctx.db.insert("comments", {
            content: "Test",
            userId: user._id,
            timeStamp: Date.now(),
            likes: 0,
            dislikes: 0,
        });
        return post
            
    }
})