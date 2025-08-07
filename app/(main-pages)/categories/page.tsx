"use client";
import Loader from "@/components/multipage/Loader";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React from "react";

export default function Subcategories() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category");
  const subcategories = useQuery(api.categories.getCategory, {
    category: category ?? "homes",
  });

  if (!subcategories) {
    return (
      <div className="h-[70vh] w-full grid place-items-center">
        <Loader />
      </div>
    );
  }
  console.log(subcategories?.items[0].image);
  return (
    <div className=" text-gray-800  h-screen w-full">
      {subcategories?.items.map((subcategory) => (
        <Link href={`/categories/${category}`} key={subcategory.title}>
          <div className="flex px-4 border-b py-3 hover:bg-gray-100 transition-all duration-400   gap-3 items-center">
            <div className="size-16">
              <img
                height={200}
                width={200}
                src={subcategory.image}
                alt={subcategory.title}
                className="size-full object-contain"
              />
            </div>
            <div className="flex flex-col gap-1 capitalize">
              <span className="font-bold text-base">{subcategory.title}</span>
              <span className="text-sm">{subcategory.size}</span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
