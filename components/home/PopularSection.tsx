"use client";
import { useQuery } from "convex/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { api } from "@/convex/_generated/api";
import { useIsMobile } from "@/hooks/use-mobile";
import ProductCard from "../multipage/ProductCard";
import { Skeleton } from "../ui/skeleton";
import Container from "./Container";

export default function PopularSection() {
  const recommendations = useQuery(api.product.getRecommendations, {});
  const all = useQuery(api.product.getAll, { limit: 10 });
  const isMobile = useIsMobile();
  const popular = useQuery(api.interactions.getPopularProducts);


  useEffect(() => {
    if (recommendations?.error) {
      console.log("there was an error getting recommendations");
    }
  }, [recommendations]);

  return (
    <div className="space-y-5 pb-12 lg:space-y-10">
      <h2 className="section-title">Popular</h2>
      <Container>
        <div className="grid w-full grid-cols-2 gap-x-4 gap-y-4 lg:grid-cols-4">
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
              ? popular?.data.map((product) => (
                  <ProductCard
                    key={product._id}
                    image={product.images[0]}
                    price={product.price}
                    title={product.title}
                    location={product.location}
                    likes={product.likes || 0}
                    productId={product._id}
                  />
                ))
              : all?.map((product, index) => (
                  <ProductCard
                    key={product._id}
                    image={product.images[0]}
                    price={product.price}
                    title={product.title}
                    location={product.location}
                    likes={product.likes || 0}
                    productId={product._id}
                  />
                ))}
        </div>
      </Container>
    </div>
  );
}
