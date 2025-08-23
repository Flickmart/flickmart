import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

export const useProductsByCategoryOrSubCategory = (category: string) => {
  try {
    return useQuery(api.product.getProductsByCategoryOrSubCategory, {
      category,
    });
  } catch (error) {
    console.log('Error fetching products:', error);
    return null;
  }
};
