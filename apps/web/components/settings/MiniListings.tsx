import { useQuery } from 'convex/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { api } from 'backend/convex/_generated/api';
import type { Id } from 'backend/convex/_generated/dataModel';
import { Button } from '../ui/button';

export default function MiniListings({
  userId,
  updateLength,
}: {
  userId: Id<'users'>;
  updateLength: (Length: number) => void;
}) {
  const pathname = usePathname();
  const userProducts = useQuery(api.product.getByUserId, {
    userId,
  });

  useEffect(() => {
    updateLength(userProducts?.length ?? 0);
  }, [userProducts, updateLength]);

  // Loading pdts
  if (userProducts === undefined) {
    return (
      <div className="space-y-2">
        <div className="h-5 w-32 animate-pulse rounded bg-gray-200" />
        <div className="grid grid-cols-3 gap-2">
          {[...new Array(3)].map((_, i) => (
            <div
              className="h-28 w-full animate-pulse rounded bg-gray-200"
              key={i}
            />
          ))}
        </div>
      </div>
    );
  }

  // Dont display
  if (userProducts.length === 0) {
    return null;
  }

  return (
    <div className="">
      <div className="flex items-center justify-between">
        <h1 className="font-semibold text-lg">Recent Listings</h1>
        {pathname.includes('/business') ? null : (
          <Link className="flex justify-end text-sm" href="/settings/products">
            <Button variant="link">View all Products</Button>
            {/* <ChevronRight /> */}
          </Link>
        )}
      </div>
      <div className="mt-2 flex gap-3 overflow-auto">
        {userProducts
          ?.slice()
          .reverse()
          .map((listing) => (
            <Link
              className="!w-2/3"
              href={`/product/${listing._id}`}
              key={listing._id}
            >
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
  );
}
