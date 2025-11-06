"use client";
import Image from "next/image";
import Link from "next/link";
import { useIsMobile } from "@/hooks/use-mobile";
import { ChevronRight } from "lucide-react";

export default function CategoryItem({
  categoryName,
}: {
  categoryName: string;
}) {
  const isMobile = useIsMobile();
  return (
    <Link
      className="block h-28 lg:h-16 lg:w-full lg:bg-white lg:p-1 lg:border-t lg:border-black/20 first:border-none lg:first:rounded-t lg:last:rounded-b"
      href={
        isMobile
          ? `/categories?category=${categoryName}`
          : `/categories/${categoryName}`
      }
    >
      <div className="flex h-full duration-300 transition-colors flex-col items-center hover:cursor-pointer sm:hover:bg-gray-100 sm:rounded-sm lg:flex lg:flex-row lg:justify-between lg:bg-[#F8F8F8] lg:pl-2 lg:hover:bg-flickmart/15">
        <div className="flex size-full flex-col items-center justify-center gap-2 lg:flex-row lg:justify-start lg:gap-[10px]">
          <div className="h-3/5 w-4/5 lg:bg-[#596A98] lg:size-[45px] lg:rounded">
            <Image
              alt={categoryName}
              className="size-full object-contain"
              height={200}
              src={`/${categoryName}.png`}
              width={200}
            />
          </div>
          <span className="font-bold text-sm text-gray-800 capitalize lg:font-poppins lg:font-normal lg:text-base">
            {categoryName}
          </span>
        </div>
        <ChevronRight className="hidden text-flickmart lg:block" />
      </div>
    </Link>
  );
}
