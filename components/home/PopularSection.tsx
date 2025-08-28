'use client';
import { useQuery } from 'convex/react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { api } from '@/convex/_generated/api';
import { useIsMobile } from '@/hooks/use-mobile';
import ProductCard from '../multipage/ProductCard';
import { Skeleton } from '../ui/skeleton';
import Container from './Container';

export default function PopularSection() {
  const recommendations = useQuery(api.product.getRecommendations, {});
  const all = useQuery(api.product.getAll, { limit: 10 });
  const isMobile = useIsMobile();
  const popular = useQuery(api.interactions.getPopularProducts);

  useEffect(() => {
    if (recommendations?.error) {
      console.log('there was an error getting recommendations');
    }
  }, [recommendations]);

  return (
    <div className="space-y-5 pb-12 text-center capitalize lg:space-y-10">
      <h2 className="font-semibold text-2xl text-gray-800 lg:text-3xl">
        Popular
      </h2>
      <Container>
        <div className="grid w-full grid-cols-2 gap-x-1 gap-y-4 lg:w-4/6 lg:grid-cols-4 lg:gap-x-5 lg:gap-y-10">
          {popular === undefined || all === undefined
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
            : popular?.data?.length
              ? popular?.data.map((product, index) => (
                  <Link href={`/product/${product._id}`} key={product._id}>
                    <ProductCard
                      image={product.images[0]}
                      price={product.price}
                      title={product.title}
                    />
                  </Link>
                ))
              : all?.map((product, index) => (
                  <Link href={`/product/${product._id}`} key={product._id}>
                    <ProductCard
                      image={product.images[0]}
                      price={product.price}
                      title={product.title}
                    />
                  </Link>
                ))}
        </div>
      </Container>
    </div>
  );
}
