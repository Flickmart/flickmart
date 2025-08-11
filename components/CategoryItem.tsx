"use client";
import { api } from "@/convex/_generated/api";
import { useProductsByCategoryOrSubCategory } from "@/hooks/useProdByCat";

import { useQuery } from "convex/react";
import Image from "next/image";
import Link from "next/link";

type Category = {
  title: string;
  size?: number;
  image?: string;
};

type CategoryItemProps = {
  item: Category;
  category: string;
  toggleSidebar: () => void;
};

export default function CatItem({
  item,
  category,
  toggleSidebar,
}: CategoryItemProps) {
  const productsBySubCat = useProductsByCategoryOrSubCategory(item.title);
  const imgSrc = item.title.includes("-")
    ? item.title.split(" ").slice(0, 2).join(" ")
    : item.title;

  return (
    <Link
      href={`/categories/${category}?subcategory=${item.title}`}
      className="py-3 lg:border-b text-black hover:bg-gray-200 transition-all duration-500 ease-in-out"
    >
      <div onClick={toggleSidebar} className="flex gap-2 items-center lg:pl-5">
        <div className="flex h-12 w-12 aspect-square md:hidden justify-center items-center overflow-hidden">
          {item.image && (
            <Image
              src={`/categories/${imgSrc}.png`}
              width={500}
              height={500}
              className="max-w-full max-h-full"
              alt={item.title}
            />
          )}
        </div>
        <div className="text-left">
          <h2 className="text-[16px] lg:text-sm font-medium md:font-normal capitalize md:tracking-tighter">
            {item.title}
          </h2>
          <span className="text-[14px] lg:text-[10px] text-gray-500">{`${productsBySubCat?.length ?? 0} ads`}</span>
        </div>
      </div>
    </Link>
  );
}
