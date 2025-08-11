"use client";
import Loader from "@/components/multipage/Loader";
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
  const [subCat, setSubCat] = useState("");

  const subcategories = useQuery(api.categories.getCategory, {
    category: category ?? "homes",
  });
  const productsByCat = useProductsByCategoryOrSubCategory(subCat ?? "");

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
        const imgSrc = subcategory.title.includes("-")
          ? subcategory.title.split(" ").slice(0, 2).join(" ")
          : subcategory.title;

        return (
          <Link
            href={`/categories/${category}?subcategory=${subcategory.title}`}
            key={subcategory.title}
          >
            <div className="flex px-4 border-b py-3 hover:bg-gray-100 transition-all duration-400   gap-3 items-center">
              <div className="size-16">
                <Image
                  height={200}
                  width={200}
                  src={`/categories/${imgSrc}.png`}
                  alt={subcategory.title}
                  className="size-full object-contain"
                />
              </div>
              <div className="flex flex-col gap-1 capitalize">
                <span className="font-bold text-base">{subcategory.title}</span>
                <span className="text-sm normal-case">
                  {productsByCat?.length} ads
                </span>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
