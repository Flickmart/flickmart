import { useQuery } from 'convex/react';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect } from 'react';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';
import { Card } from '../ui/card';

const mockUserProducts = [
  {
    _id: 'prod_1' as any, // normally Id<'products'> type
    title: 'iPhone 14 Pro',
    price: 850_000,
    images: ['/beauty.png'],
  },
  {
    _id: 'prod_2' as any,
    title: 'MacBook Air M2',
    price: 1_200_000,
    images: ['/airpods-demo.png'],
  },
  {
    _id: 'prod_3' as any,
    title: 'Beats Studio Buds',
    price: 120_000,
    images: ['/appliances.png'],
  },
  {
    _id: 'prod_4' as any,
    title: 'Samsung Galaxy S23',
    price: 780_000,
    images: ['/electronics.png'],
  },
];

export default function MiniListings({
  userId,
  updateLength,
}: {
  userId: Id<'users'>;
  updateLength: (Length: number) => void;
}) {
  // const userProducts = useQuery(api.product.getByUserId);
  const userProducts = mockUserProducts;

  useEffect(() => {
    updateLength(userProducts?.length ?? 0);
  }, [userProducts]);
  return (
    <>
      {userProducts?.length ? (
        <div className="">
          <div className="flex items-center justify-between">
            <h1 className="font-semibold text-lg">Recent Listings</h1>
            <Link className="flex items-center text-gray-400 text-sm" href="">
              {userProducts?.length || 0}
              <ChevronRight />
            </Link>
          </div>
          <div className="mt-2 grid grid-cols-3 gap-2 md:grid-cols-3">
            {userProducts
              ?.slice()
              .reverse()
              .slice(0, 3)
              .map((listing) => (
                <Link href={`/product/${listing._id}`} key={listing._id}>
                  <div className="overflow-hidden border shadow-sm transition-shadow duration-300 hover:shadow-md">
                    <img
                      alt={listing.title}
                      className="h-24 w-full object-cover"
                      src={listing.images[0] || '/placeholder.svg'}
                    />
                    <div className="space-y-0.5 px-1.5 py-1.5">
                      <h3 className="truncate font-semibold text-[10px]">
                        {listing.title}
                      </h3>
                      <p className="font-semibold text-[8px] text-flickmart">
                        &#8358;{listing.price.toLocaleString('en-US')}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      ) : null}
    </>
  );
}
