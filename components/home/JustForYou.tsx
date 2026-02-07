'use client';
import { useQuery } from 'convex/react';
import Link from 'next/link';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';
import { useIsMobile } from '@/hooks/use-mobile';
import { useRecommend } from '@/hooks/useRecommend';
import ProductCard from '../multipage/ProductCard';
import { Skeleton } from '../ui/skeleton';
import Container from './Container';
import { useEffect, useState } from 'react';

export default function JustForYou({anonId}: {anonId: string |null}) {
  const isMobile = useIsMobile();
  const all = useQuery(api.product.getAll, { limit: 10 });
  const user = useQuery(api.users.current, {});
  const recommendation = useRecommend('Just-For-You'); //Specify the scenario as the first parameter


  return (
    <div className="space-y-5 capitalize lg:space-y-10 lg:text-center">
      <h2 className="font-semibold text-2xl text-gray-800 lg:text-3xl">
        just for you
      </h2>
      <Container className="!min-h-[40vh]">
        {/* <div className="grid w-full grid-cols-2 bg-black gap-x-1 gap-y-4 lg:w-4/6 lg:grid-cols-4 lg:gap-x-5 lg:gap-y-10"> */}
        <div className="grid w-full grid-cols-2 gap-4 lg:grid-cols-4">
          {(!user && !anonId) || recommendation === null
            ? Array.from({ length: isMobile ? 4 : 8 }).map((_, index) => (
                // Skeleton Loader
                <div
                  className="flex h-56 w-full flex-col items-center justify-around bg-gray-100 lg:h-80"
                  key={index}
                >
                  <Skeleton className="h-3/4 w-11/12 bg-gray-200 lg:w-full" />
                  <div className="flex h-1/4 w-full flex-col justify-center space-y-2 p-2">
                    <Skeleton className="h-4 w-3/4 bg-gray-200" />
                    <Skeleton className="h-3 w-1/3 bg-gray-200" />
                  </div>
                </div>
              ))
            : recommendation?.recomms.length
              ? recommendation?.recomms.map((product) => (
                  <Link
                    href={`/product/${product.id}?id=${recommendation.recommId}`}
                    key={product.id}
                  >
                    <ProductCard
                      image={product.values?.image as string}
                      likes={product.values?.likes as number}
                      price={product.values?.price as number}
                      productId={product.id as Id<'product'>}
                      title={product.values?.title as string}
                      views={product.values?.views as number}
                    />
                  </Link>
                ))
              : all?.map((product) => (
                  <Link
                    href={`/product/${product._id}?id=${recommendation.recommId}`}
                    key={product._id}
                  >
                    <ProductCard
                      image={product.images[0]}
                      key={product._id}
                      likes={product.likes}
                      price={product.price}
                      productId={product._id}
                      title={product.title}
                      views={product.views}
                    />
                  </Link>
                ))}
        </div>
      </Container>
    </div>
  );
}
