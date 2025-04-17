"use client"
import React from "react";
import Container from "./Container";

import ProductCard from "../multipage/ProductCard";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function BestSellers() {
  try{
    const recommendations = useQuery(api.product.getRecommendations, {});
    console.log(recommendations)
  }catch(err){
    console.log(err)
  }
  return (
    <div className="text-center capitalize lg:space-y-10 space-y-5">
      <h2 className=" lg:text-3xl text-2xl text-gray-800 font-semibold">
        best sellers
      </h2>
      <Container>
        <div className="grid grid-cols-2 lg:grid-cols-4 lg:w-4/6 w-full grid-rows-2 lg:gap-x-5 lg:gap-y-10 gap-x-1 gap-y-4">
          {Array.from({ length: 8 }).map((_, index) => (
            // Best Seller Item
            <ProductCard key={index}/> 
          ))}
        </div>
      </Container>
    </div>
  );
}
