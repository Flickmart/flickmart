"use client";
import Loader from "@/components/multipage/Loader";
import SubcategoryItem from "@/components/post-ad/SubcategoryItem";
import { api } from "@/convex/_generated/api";
import { useProductsByCategoryOrSubCategory } from "@/hooks/useProdByCat";
import { useQuery } from "convex/react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React, { useState } from "react";

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

  return (
    <div className=" text-gray-800  h-screen w-full">
      {subcategories?.items.map((subcategory) => {
        return (
          <SubcategoryItem
            key={subcategory.title}
            category={category ?? ""}
            subcategory={subcategory.title}
          />
        );
      })}
    </div>
  );
}
