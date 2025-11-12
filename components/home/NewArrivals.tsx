'use client';
import { useQuery } from 'convex/react';
import { ArrowRight, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '@/convex/_generated/api';
import { useIsMobile } from '@/hooks/use-mobile';
import { Skeleton } from '../ui/skeleton';
import Container from './Container';
import NewArrivalItem from './NewArrivalItem';

export default function NewArrivals() {
  const newProducts = useQuery(api.product.getNewProducts);
  const isMobile = useIsMobile();
  const firstTenProducts = newProducts?.slice(0, 10);
  const all = useQuery(api.product.getAll, { limit: 10 });

  return (
    <section className="mx-auto mt-0 flex flex-col items-center justify-start space-y-5 py-5 capitalize">
      <div className="flex w-full items-center justify-between">
        <h2 className="section-title mb-0">New Arrivals</h2>
        <Link
          className="flex cursor-pointer items-center space-x-1 text-[#606060] transition-colors sm:hover:text-flickmart"
          href={'/more-products'}
        >
          <span className="text-lg">See All</span>
          <ChevronRight className="transition-colors" />
        </Link>
      </div>
      <div className="gradient w-full overflow-x-auto">
        {firstTenProducts === undefined || all === undefined ? (
          Array.from({ length: isMobile ? 3 : 5 }).map((_, index) => (
            <div
              className="flex min-h-80 w-full flex-col bg-gray-100 lg:h-96"
              key={index}
            >
              <Skeleton
                className="h-3/4 w-60 bg-gray-200 lg:w-full"
                key={index}
              />
              <div className="grid h-1/4 w-full place-items-center p-4">
                <Skeleton className="h-10 w-5/6 bg-gray-200" />
              </div>
              <div className="flex h-1/5 w-full flex-col justify-center space-y-2 bg-white px-2 lg:px-0">
                <Skeleton className="h-4 w-3/4 bg-gray-200" />
                <Skeleton className="h-3 w-1/3 bg-gray-200" />
              </div>
            </div>
          ))
        ) : (
          <div className="relative flex gap-x-5 lg:gap-x-10">
            {(firstTenProducts?.length ? firstTenProducts : all)?.map(
              (item) => (
                <Link
                  className="block flex-shrink-0"
                  href={`/product/${item._id}`}
                  key={item._id}
                >
                  <NewArrivalItem
                    image={item.images[0]}
                    name={item.title}
                    price={item.price}
                    productId={item._id}
                  />
                </Link>
              )
            )}
          </div>
        )}
      </div>
    </section>
  );
}
