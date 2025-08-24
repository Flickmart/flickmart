import { useQuery } from 'convex/react';
import Image from 'next/image';
import React from 'react';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';

interface NewArrivalsProp {
  image: string;
  name: string;
  price: number;
  productId: Id<'product'>;
}

export default function NewArrivalItem({
  image,
  name,
  price,
  productId,
}: NewArrivalsProp) {
  const saved = useQuery(api.product.getSavedOrWishlistProduct, {
    productId,
    type: 'saved',
  });
  if (saved?.error && saved.data === null) {
    console.log(saved.error.message);
  }

  return (
    <div className="relative flex min-h-60 min-w-60 flex-grow flex-col justify-between lg:min-h-30 lg:min-w-72">
      <span className="absolute top-5 left-5 rounded-sm bg-white px-3 py-1 font-bold text-black uppercase">
        new
      </span>
      <div className="flex min-h-40 flex-grow flex-col items-center justify-center rounded-md bg-gray-100">
        <div className="h-48 w-full bg-gray-300 lg:h-64">
          <Image
            alt={name}
            className="size-full object-cover"
            height={500}
            src={image || '/no-image.png'}
            width={500}
          />
        </div>
        <div className="flex h-1/4 w-full flex-col px-4 py-6 font-semibold text-[13px]">
          <span className="">{name}</span>
          <span>&#8358;{price.toLocaleString()}</span>
        </div>
      </div>
      <div className="flex space-y-1 pt-2 font-semibold lg:space-y-3 lg:py-4" />
    </div>
  );
}
