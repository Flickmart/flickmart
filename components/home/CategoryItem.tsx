'use client';
import { ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { type Dispatch, type SetStateAction, useRef } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import useResponsive from '@/hooks/useResponsive';

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
  const isLarge = useResponsive('min-width: 1024px');

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
      className="relative z-20 block h-28 lg:h-16 lg:w-full lg:border-black/20 lg:border-t lg:bg-white lg:p-1 lg:last:rounded-b lg:first:rounded-t lg:first:border-none"
      href={
        isMobile
          ? `/categories?category=${categoryName}`
          : `/categories/${categoryName}`
      }
      onMouseEnter={handleSubCategories}
      ref={categoryItemRef}
    >
      <div className="flex h-full flex-col items-center transition-colors duration-300 hover:cursor-pointer sm:rounded-sm sm:hover:bg-gray-100 lg:flex lg:h-full lg:flex-row lg:items-center lg:justify-between lg:rounded-sm lg:bg-[#F8F8F8] lg:pl-2 lg:transition-colors lg:duration-300 lg:hover:cursor-pointer lg:hover:bg-flickmart/15">
        <div className="flex size-full flex-col items-center justify-center gap-2 lg:flex-row lg:justify-start lg:gap-[10px]">
          <div className="h-3/5 w-4/5 lg:size-[45px] lg:rounded lg:bg-[#596A98]">
            <Image
              alt={categoryName}
              className="size-full object-contain"
              height={200}
              src={`/${categoryName}.png`}
              width={200}
            />
          </div>
          <span className="font-bold text-[13px] text-gray-800 capitalize sm:text-sm lg:font-normal lg:font-poppins">
            {categoryName}
          </span>
        </div>
        <ChevronRight className="hidden text-flickmart lg:block" />
      </div>
    </Link>
  );
}
