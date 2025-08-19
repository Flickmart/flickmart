import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";

export const useProductsByCategoryOrSubCategory = (category: string) => {
  try {
    return useQuery(api.product.getProductsByCategoryOrSubCategory, {
      category,
    });
  } catch (error) {
    console.log("Error fetching products:", error);
    return null;
  }
};
