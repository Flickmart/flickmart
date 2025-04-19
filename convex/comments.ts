import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUserOrThrow } from "./users";

// Add a comment for a product
export const addComment = mutation({
  args: {
    productId: v.id("product"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);

    if (!user) {
      throw Error("User not found");
    }

    const commentId = await ctx.db.insert("comments", {
      productId: args.productId,
      userId: user._id,
      content: args.content,
      timeStamp: new Date().toISOString(),
    });
    return commentId;
  },
});

// Get comments for a product
export const getCommentsByProductId = query({
  args: {
    productId: v.id("product"),
  },
  handler: async (ctx, args) => {
    const comments = await ctx.db
      .query("comments")
      .filter((q) => q.eq(q.field("productId"), args.productId))
      .collect();
    const commentsWithUser = await Promise.all(
      comments.map(async (comment) => {
        const user = await ctx.db.get(comment.userId);
        return {
          ...comment,
          user: user
            ? {
                _id: user._id,
                name: user.name,
                imageUrl: user.imageUrl,
              }
            : null,
        };
      })
    );
    return commentsWithUser;
  },
});

// Delete a comment
export const deleteComment = mutation({
  args: {
    commentId: v.id("comments"),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);
    const comment = await ctx.db.get(args.commentId);

    if (!comment) {
      throw Error("Comment not found");
    }
    if (comment.userId !== user._id) {
      throw Error("User is unauthorized to delete this comment");
    }

    await ctx.db.delete(args.commentId);

    return args.commentId;
  },
});
