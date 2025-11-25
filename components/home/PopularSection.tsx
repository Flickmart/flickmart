'use client';
import { useQuery } from 'convex/react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { api } from '@/convex/_generated/api';
import { useIsMobile } from '@/hooks/use-mobile';
import ProductCard from '../multipage/ProductCard';
import { Skeleton } from '../ui/skeleton';
import Container from './Container';
import { useRecommend } from '@/hooks/useRecommend';
import { Id } from '@/convex/_generated/dataModel';

export default function PopularSection() {
  const isMobile = useIsMobile();
  const popular = useRecommend("Popular", 20) //Specify the scenario as the first parameter
  const user = useQuery(api.users.current, {})



  return (
    <div className="space-y-5 lg-text-center  lg:space-y-10">
      <h2 className="section-title">Popular</h2>
      <Container>
        <div className="grid w-full grid-cols-2 gap-x-4 gap-y-4 lg:grid-cols-4">
          {popular === null || !user
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
            : popular.recomms.map((product) => (
                  <ProductCard
                    key={product.id}
                    likes={product.values?.likes as number}
                    location={product.values?.location as string}
                    image={product.values?.image as string}
                    productId={product.id as Id<"product">}
                    price={product.values?.price as number}
                    title={product.values?.title as string}
                    views={product.values?.views as number}
                  />
                ))
              }
        </div>
      </Container>
    </div>
  );
}
