import { useQuery } from 'convex/react';
import Link from 'next/link';
import React, { useEffect } from 'react';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';
import { Card } from '../ui/card';

export default function RecentListings({
  userId,
  updateLength,
}: {
  userId: Id<'users'>;
  updateLength: (Length: number) => void;
}) {
  const userProducts = useQuery(api.product.getByUserId);

  useEffect(() => {
    updateLength(userProducts?.length ?? 0);
  }, [userProducts]);
  return (
    <>
      {userProducts?.length ? (
        <Card className="p-6">
          <h2 className="mb-4 font-semibold text-lg">Recent Listings</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            {userProducts
              ?.slice()
              .reverse()
              .slice(0, 3)
              .map((listing) => (
                <Link href={`/product/${listing._id}`} key={listing._id}>
                  <div className="overflow-hidden rounded-lg border shadow-sm transition-shadow duration-300 hover:shadow-md">
                    <img
                      alt={listing.title}
                      className="h-32 w-full object-cover"
                      src={listing.images[0] || '/placeholder.svg'}
                    />
                    <div className="space-y-1 p-2">
                      <h3 className="font-medium">{listing.title}</h3>
                      <p className="text-muted-foreground text-sm">
                        &#8358;{listing.price.toLocaleString('en-US')}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </Card>
      ) : null}
    </>
  );
}
