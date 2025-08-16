"use client";
import React, { useEffect, useState } from "react";
import Container from "./Container";

import ProductCard from "../multipage/ProductCard";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import { Skeleton } from "../ui/skeleton";
import { useIsMobile } from "@/hooks/use-mobile";

export default function BestSellers() {
  const recommendations = useQuery(api.product.getRecommendations, {});
  const all = useQuery(api.product.getAll, { limit: 10 });
  const isMobile = useIsMobile();

  useEffect(() => {
    if (recommendations?.error) {
      console.log("there was an error getting recommendations");
    }
  }, [recommendations]);

  return (
    <div className="text-center capitalize lg:space-y-10 space-y-5">
      <h2 className=" lg:text-3xl text-2xl text-gray-800 font-semibold">
        best sellers
      </h2>
      <Container className="!min-h-[40vh]">
        <div className="grid grid-cols-2 lg:grid-cols-4 lg:w-4/6 w-full lg:gap-x-5 lg:gap-y-10 gap-x-1 gap-y-4">
          {recommendations === undefined || all === undefined
            ? Array.from({ length: isMobile ? 4 : 8 }).map((_, index) => (
                // Skeleton Loader
                <div
                  className="lg:h-80 h-56 w-full bg-gray-100 flex flex-col justify-around items-center "
                  key={index}
                >
                  <Skeleton className="h-3/4 w-11/12 lg:w-full bg-gray-200" />
                  <div className="h-1/4 p-2 flex flex-col justify-center w-full space-y-2">
                    <Skeleton className="w-3/4 h-4 bg-gray-200" />
                    <Skeleton className="w-1/3 h-3 bg-gray-200" />
                  </div>
                </div>
              ))
            : !recommendations?.data?.length
              ? all?.map((product, index) => (
                  <Link href={`/product/${product._id}`} key={product._id}>
                    <ProductCard
                      image={product.images[0]}
                      title={product.title}
                      price={product.price}
                      key={index}
                    />
                  </Link>
                ))
              : recommendations?.data.map((product, index) => (
                  <Link href={`/product/${product._id}`} key={product._id}>
                    <ProductCard
                      image={product.images[0]}
                      title={product.title}
                      price={product.price}
                      key={index}
                    />
                  </Link>
                ))}
        </div>
      </Container>
    </div>
  );
}
