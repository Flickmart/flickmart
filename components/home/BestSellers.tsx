'use client';
import { useAction, useQuery } from 'convex/react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { api } from '@/convex/_generated/api';
import { useIsMobile } from '@/hooks/use-mobile';
import ProductCard from '../multipage/ProductCard';
import { Skeleton } from '../ui/skeleton';
import Container from './Container';
import { Doc } from '@/convex/_generated/dataModel';

export default function BestSellers() {
  const isMobile = useIsMobile();
  const all = useQuery(api.product.getAll, { limit: 10 });
  const recommendations = useAction(api.recommend.recommendItems)
  const [recommendation, setRecommendation] = useState<Array<Doc<"product">>|null>(null)
  const user = useQuery(api.users.current, {})

  // Fetch Recommendations Once Component Mounts
  useEffect(()=>{
    async function fetchRecommendations(){
     const results: Array<Doc<"product">> = await recommendations({queryStrings: "?count=10&returnProperties=true&cascadeCreate=true"})
     console.log(results)
     setRecommendation(results)
    }
    fetchRecommendations()
  },[user])

  return (
    <section className="">
      <h2 className="section-title">Best Sellers</h2>
      <Container className="!min-h-[40vh]">
        <div className="grid w-full grid-cols-2 gap-4 lg:grid-cols-4">
          {recommendation === null || all === undefined
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
            : recommendation?.length
              ? recommendation?.map((product, index) => (
                  <Link href={`/product/${product._id}`} key={product._id}>
                    <ProductCard
                      image={product.images[0]}
                      key={index}
                      price={product.price}
                      title={product.title}
                    />
                  </Link>
                ))
              : all?.map((product) => (
                  <ProductCard
                    image={product.images[0]}
                    key={product._id}
                    likes={product.likes || 0}
                    location={product.location}
                    price={product.price}
                    productId={product._id}
                    title={product.title}
                  />
                ))}
        </div>
      </Container>
    </section>
  );
}
