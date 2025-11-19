'use client';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

export default function MoreProducts() {
  const newProducts = useQuery(api.product.getNewProducts);
  console.log(newProducts);
  return (
    <div className="h-screen bg-orange-500">
      {newProducts?.map((item) => (
        <div key={item._id}>
          <span>{item.title}</span>
        </div>
      ))}
    </div>
  );
}
