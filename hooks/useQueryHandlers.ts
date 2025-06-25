import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import * as Sentry from "@sentry/nextjs";
import { Id } from "@/convex/_generated/dataModel";

export function useSavedOrWishlistProduct(productId: Id<"product">) {
  try {
    const saved = useQuery(api.product.getSavedOrWishlistProduct, {
      productId,
      type: "saved",
    });
    return saved;
  } catch (err) {
    const error = err as Error;

    Sentry.captureException(error);
  }
}
