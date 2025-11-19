"use client";
import Image from "next/image";
import Link from "next/link";
import { useIsMobile } from "@/hooks/use-mobile";
import { ChevronRight } from "lucide-react";
import useResponsive from "@/hooks/useResponsive";
import { Dispatch, RefObject, SetStateAction } from "react";
import { useRef } from "react";

export default function CategoryItem({
  categoryName,
  setShowSubCategories,
  setCategoryItemTop,
}: {
  categoryName: string;
  setShowSubCategories: Dispatch<SetStateAction<false | string>>;
  setCategoryItemTop: Dispatch<SetStateAction<number>>;
}) {
  const isMobile = useIsMobile();
  const isLarge = useResponsive("min-width: 1024px");

  const categoryItemRef = useRef<HTMLAnchorElement | null>(null);

  const handleSubCategories = () => {
    if (isLarge) {
      setShowSubCategories(categoryName);
      if (categoryItemRef?.current) {
        const categoryItemTop =
          categoryItemRef.current.getBoundingClientRect().top;
        setCategoryItemTop(categoryItemTop);
      }
    }
  };

  return (
    <Link
      ref={categoryItemRef}
      onMouseEnter={handleSubCategories}
      className="block relative z-20 h-28 lg:h-16 lg:w-full lg:bg-white lg:p-1 lg:border-t lg:border-black/20 lg:first:border-none lg:first:rounded-t lg:last:rounded-b"
      href={
        isMobile
          ? `/categories?category=${categoryName}`
          : `/categories/${categoryName}`
      }
    >
      <div className="flex h-full duration-300 transition-colors flex-col items-center hover:cursor-pointer sm:hover:bg-gray-100 sm:rounded-sm lg:h-full lg:duration-300 lg:transition-colors lg:items-center lg:hover:cursor-pointer lg:rounded-sm lg:flex lg:flex-row lg:justify-between lg:bg-[#F8F8F8] lg:pl-2 lg:hover:bg-flickmart/15">
        <div className="flex size-full flex-col items-center justify-center gap-2 lg:justify-start lg:gap-[10px] lg:flex-row">
          <div className="h-3/5 w-4/5 lg:bg-[#596A98] lg:size-[45px] lg:rounded">
            <Image
              alt={categoryName}
              className="size-full object-contain"
              height={200}
              src={`/${categoryName}.png`}
              width={200}
            />
          </div>
          <span className="font-bold text-[13px] text-gray-800 capitalize sm:text-sm lg:font-poppins lg:font-normal">
            {categoryName}
          </span>
        </div>
        <ChevronRight className="hidden text-flickmart lg:block" />
      </div>
    </Link>
  );
}
