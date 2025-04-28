"use client"
import React from "react";
import Container from "./Container";
import NewArrivalItem from "./NewArrivalItem";
import { ArrowRight } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function NewArrivals() {
  const newProducts = useQuery(api.product.getNewProducts)
  console.log(newProducts)
  const firstTenProducts = newProducts?.slice(0, 10)
  return (
    <Container className="!flex items-center flex-col justify-start py-5 capitalize text-gray-800 space-y-5 ">
      <div className="lg:w-5/6 w-full flex justify-between ">
        <h2 className=" lg:text-3xl text-2xl  font-semibold">new arrivals</h2>
        <p className=" flex  space-x-2 pt-1.5 lg:pt-2">
          <span className=" underline underline-offset-8 lg:text-base text-xs">
            more products
          </span>
          <ArrowRight className="text-gray-600 text-xs " />
        </p>
      </div>
      <div className=" flex justify-between   lg:w-5/6 gap-x-5 w-full overflow-x-auto ">
      {firstTenProducts?.map((item)=> 
        <NewArrivalItem image={item.images[0]} name={item.title} price={item.price} />
      )}
      </div>
    </Container>
  );
}
