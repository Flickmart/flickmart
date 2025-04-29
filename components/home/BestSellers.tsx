"use client"
import React, { useState } from "react";
import Container from "./Container";

import ProductCard from "../multipage/ProductCard";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";

const useRecommendations = () => {
  try {
    return useQuery(api.product.getRecommendations, {});
  } catch (error) {
    console.log("Error fetching recommendations:", error);
    return null;
  }
};

export default function BestSellers() {
  const all = useQuery(api.product.getAll, { limit: 10})
  const recommendations = useRecommendations();

  return (
    <div className="text-center capitalize lg:space-y-10 space-y-5">
      <h2 className=" lg:text-3xl text-2xl text-gray-800 font-semibold">
        best sellers
      </h2>
      <Container>
        <div className="grid grid-cols-2 lg:grid-cols-4 lg:w-4/6 w-full grid-rows-2 lg:gap-x-5 lg:gap-y-10 gap-x-1 gap-y-4">
          {!recommendations?.length? 
            all?.map((product, index) => (
              <Link href={`/product/${product._id}`} key={product._id}>
                <ProductCard image={product.images[0]} title={product.title} price={product.price} key={index}/> 
              </Link>
            )) : 
            recommendations?.map((product, index) => (
              <Link href={`/product/${product._id}`} key={product._id}>
                <ProductCard image={product.images[0]} title={product.title} price={product.price} key={index}/> 
              </Link>
            ))
          }
        </div>
      </Container>
    </div>
  );
}
