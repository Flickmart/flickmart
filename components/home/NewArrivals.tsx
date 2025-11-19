"use client";
import { useQuery } from "convex/react";
import { ArrowRight, ChevronRight } from "lucide-react";
import Link from "next/link";
import React from "react";
import { api } from "@/convex/_generated/api";
import { useIsMobile } from "@/hooks/use-mobile";
import { Skeleton } from "../ui/skeleton";
import Container from "./Container";
import NewArrivalItem from "./NewArrivalItem";
import { useRouter } from "next/navigation";

export default function NewArrivals() {
  const isMobile = useIsMobile();
  const all = useQuery(api.product.getAll, { limit: 10 });
  const firstTenProducts = all?.slice(0, 10);
  const router = useRouter();

  return (
    <section className="mx-auto mt-0 flex flex-col items-center justify-start space-y-5 py-5 capitalize">
      <div className="flex w-full items-center justify-between">
        <h2 className="section-title mb-0">New Arrivals</h2>
        <Link
          className="flex cursor-pointer items-center space-x-1 text-[#606060] transition-colors sm:hover:text-flickmart"
          href={'/more-products'}
        >
          <span className="text-lg">See All</span>
          <ChevronRight className="transition-colors" />
        </Link>
      </div>
      <div className="flex w-full justify-between gap-x-5 overflow-x-auto lg:w-5/6 lg:gap-x-10">
        {firstTenProducts === undefined
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
          : firstTenProducts?.map((item) => (
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
    </section>
  );
}
