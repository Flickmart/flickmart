import { useProductsByCategoryOrSubCategory } from "@/hooks/useProdByCat";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function SubcategoryItem({
  category,
  subcategory,
}: {
  category: string;
  subcategory: string;
}) {
  const productsByCat = useProductsByCategoryOrSubCategory(subcategory ?? "");

  const imgSrc = subcategory.includes("-")
    ? subcategory.split(" ").slice(0, 2).join(" ")
    : subcategory;

  return (
    <Link
      href={`/categories/${category}?subcategory=${subcategory}`}
      key={subcategory}
    >
      <div className="flex px-4 border-b py-3 hover:bg-gray-100 transition-all duration-400   gap-3 items-center">
        <div className="size-16">
          <Image
            height={200}
            width={200}
            src={`/categories/${imgSrc}.png`}
            alt={subcategory}
            className="size-full object-contain"
          />
        </div>
        <div className="flex flex-col gap-1 capitalize">
          <span className="font-bold text-base">{subcategory}</span>
          <span className="text-sm normal-case">
            {productsByCat?.length}{" "}
            {(productsByCat?.length ?? 0) === 1 ? "ad" : "ads"}
          </span>
        </div>
      </div>
    </Link>
  );
}
