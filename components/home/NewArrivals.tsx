"use client";
import { useQuery } from "convex/react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import React from "react";
import { api } from "@/convex/_generated/api";
import { useIsMobile } from "@/hooks/use-mobile";
import { Skeleton } from "../ui/skeleton";
import Container from "./Container";
import NewArrivalItem from "./NewArrivalItem";
import { useRouter } from "next/navigation";

export default function NewArrivals() {
  const newProducts = useQuery(api.product.getNewProducts);
  const isMobile = useIsMobile();
  const firstTenProducts = newProducts?.slice(0, 10);
  const all = useQuery(api.product.getAll, { limit: 10 });
  const router = useRouter();

  return (
    <div className="!flex mx-auto mt-0 flex-col items-center justify-start space-y-5 py-5 text-gray-800 capitalize lg:w-5/6">
      <div className="flex w-full justify-between lg:w-5/6">
        <h2 className="font-semibold text-2xl lg:text-3xl">new arrivals</h2>
        <p
          className="flex space-x-2 pt-1.5 lg:pt-2 cursor-pointer"
          onClick={() => {
            router.push("/more-products");
          }}
        >
          <span className="text-xs underline underline-offset-8 lg:text-base">
            more products
          </span>
          <ArrowRight className="text-gray-600 text-xs" />
        </p>
      </div>
      <div className="flex w-full justify-between gap-x-5 overflow-x-auto lg:w-5/6 lg:gap-x-10">
        {firstTenProducts === undefined || all === undefined
          ? Array.from({ length: isMobile ? 3 : 5 }).map((_, index) => (
              <div
                className="flex min-h-80 w-full flex-col bg-gray-100 lg:h-96"
                key={index}
              >
                <Skeleton
                  className="h-3/4 w-60 bg-gray-200 lg:w-full"
                  key={index}
                />
                <div className="grid h-1/4 w-full place-items-center p-4">
                  <Skeleton className="h-10 w-5/6 bg-gray-200" />
                </div>
                <div className="flex h-1/5 w-full flex-col justify-center space-y-2 bg-white px-2 lg:px-0">
                  <Skeleton className="h-4 w-3/4 bg-gray-200" />
                  <Skeleton className="h-3 w-1/3 bg-gray-200" />
                </div>
              </div>
            ))
          : (firstTenProducts?.length ? firstTenProducts : all)?.map((item) => (
              <Link href={`/product/${item._id}`} key={item._id}>
                <NewArrivalItem
                  image={item.images[0]}
                  name={item.title}
                  price={item.price}
                  productId={item._id}
                />
              </Link>
            ))}
      </div>
    </div>
  );
}
