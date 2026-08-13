import { v } from "convex/values";
import { internalAction } from "./_generated/server";

// These actions deliberately do NOT talk to Astra/Gemini directly. Astra DB
// is only ever reachable from the Next.js side of this app (see
// app/api/vectors/*) -- calling it directly from a Convex Node action was
// tried and failed to connect in this deployment's Node action sandbox
// (confirmed via a diagnostic: a plain `fetch` to an arbitrary host worked,
// but a `fetch` to the Astra host itself did not). So instead these actions
// just trigger the Next.js routes that do the real work, the same way
// convex/chat.ts's streamAIResponse already calls out to /api/vectors for
// search -- a proven-working path.
//
// Scheduled (via ctx.scheduler.runAfter) from convex/product.ts's
// `create`/`update`/`remove` mutations so the vector index never goes
// stale.

export const syncProductEmbedding = internalAction({
  args: { productId: v.id("product") },
  handler: async (_ctx, args) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/vectors/sync`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId: args.productId }),
        },
      );
      if (!res.ok) {
        console.log(
          "Product embedding sync failed:",
          args.productId,
          res.status,
        );
      }
    } catch (err) {
      console.log("Product embedding sync errored:", args.productId, err);
    }
  },
});

export const deleteProductEmbedding = internalAction({
  args: { productId: v.id("product") },
  handler: async (_ctx, args) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/vectors/delete`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId: args.productId }),
        },
      );
      if (!res.ok) {
        console.log(
          "Product embedding delete failed:",
          args.productId,
          res.status,
        );
      }
    } catch (err) {
      console.log("Product embedding delete errored:", args.productId, err);
    }
  },
});
