"use client";
import React from "react";
import Container from "./Container";
import NewArrivalItem from "./NewArrivalItem";
import { ArrowRight } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import { Skeleton } from "../ui/skeleton";
import { useIsMobile } from "@/hooks/use-mobile";

export default function NewArrivals() {
  const newProducts = useQuery(api.product.getNewProducts);
  const isMobile = useIsMobile();
  const firstTenProducts = newProducts?.slice(0, 10);
  const all = useQuery(api.product.getAll, { limit: 10 });

  return (
    <div className="mt-0 lg:w-5/6 mx-auto !flex items-center flex-col justify-start py-5 capitalize text-gray-800 space-y-5 ">
      <div className="lg:w-5/6 w-full flex justify-between ">
        <h2 className=" lg:text-3xl text-2xl font-semibold">new arrivals</h2>
        <p className=" flex  space-x-2 pt-1.5 lg:pt-2">
          <span className=" underline underline-offset-8 lg:text-base text-xs">
            more products
          </span>
          <ArrowRight className="text-gray-600 text-xs " />
        </p>
      </div>
      <div className=" flex justify-between lg:w-5/6 gap-x-5 lg:gap-x-10 w-full overflow-x-auto ">
        {firstTenProducts === undefined || all === undefined
          ? Array.from({ length: isMobile ? 3 : 5 }).map((_, index) => (
              <div
                key={index}
                className="min-h-80 w-full lg:h-96 flex flex-col bg-gray-100"
              >
                <Skeleton
                  key={index}
                  className="h-3/4 lg:w-full w-60 bg-gray-200"
                />
                <div className="w-full p-4 h-1/4 grid place-items-center">
                  <Skeleton className=" w-5/6 h-10 bg-gray-200" />
                </div>
                <div className="w-full h-1/5 flex flex-col justify-center bg-white px-2 lg:px-0 space-y-2">
                  <Skeleton className=" w-3/4 h-4 bg-gray-200" />
                  <Skeleton className=" w-1/3 h-3 bg-gray-200" />
                </div>
              </div>
            ))
          : (firstTenProducts?.length ? firstTenProducts : all)?.map((item) => (
              <Link key={item._id} href={`/product/${item._id}`}>
                <NewArrivalItem
                  productId={item._id}
                  image={item.images[0]}
                  name={item.title}
                  price={item.price}
                />
              </Link>
            ))}
      </div>
    </div>
  );
}
