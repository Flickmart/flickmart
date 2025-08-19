"use client";
import React, { useEffect, useState } from "react";
import Container from "./Container";

import ProductCard from "../multipage/ProductCard";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import { Skeleton } from "../ui/skeleton";
import { useIsMobile } from "@/hooks/use-mobile";

const testData = {
  recommendations: {
    data: [
      {
        _id: "p1001",
        images: ["/mobiles.png"],
        title: "Classic White Sneakers",
        price: 4500,
      },
      {
        _id: "p1002",
        images: ["/jacket.png"],
        title: "Bluetooth Wireless Earbuds",
        price: 7500,
      },
      {
        _id: "p1003",
        images: ["/pets.png"],
        title: "Ergonomic Laptop Stand",
        price: 12000,
      },
      {
        _id: "p1004",
        images: ["/pets.png"],
        title: "Ergonomic Laptop Stand",
        price: 12000,
      },
      {
        _id: "p1005",
        images: ["/pets.png"],
        title: "Ergonomic Laptop Stand",
        price: 12000,
      },
      {
        _id: "p1006",
        images: ["/pets.png"],
        title: "Ergonomic Laptop Stand",
        price: 12000,
      },
    ],
    error: null,
  },
};

type Product = {
  _id: string;
  images: string[];
  title: string;
  price: number;
};

type RecommendationsResponse = {
  recommendations: {
    data: Product[];
    error: string | null;
  };
};

export default function PopularSection() {
  // const recommendations = useQuery(api.product.getRecommendations, {});
  const recommendations = testData.recommendations;
  const all = useQuery(api.product.getAll, { limit: 10 });
  const isMobile = useIsMobile();

  useEffect(() => {
    if (recommendations?.error) {
      console.log("there was an error getting recommendations");
    }
  }, [recommendations]);

  return (
    <div className="text-center capitalize lg:space-y-10 space-y-5 pb-12">
      <h2 className=" lg:text-3xl text-2xl text-gray-800 font-semibold">
        Popular
      </h2>
      <Container>
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
                    />
                  </Link>
                ))
              : recommendations?.data.map((product, index) => (
                  <Link href={`/product/${product._id}`} key={product._id}>
                    <ProductCard
                      image={product.images[0]}
                      title={product.title}
                      price={product.price}
                    />
                  </Link>
                ))}
        </div>
      </Container>
    </div>
  );
}
