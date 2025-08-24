'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useIsMobile } from '@/hooks/use-mobile';

export default function CategoryItem({
  categoryName,
}: {
  categoryName: string;
}) {
  const isMobile = useIsMobile();
  return (
    <Link
      className="block"
      href={
        isMobile
          ? `/categories?category=${categoryName}`
          : `/categories/${categoryName}`
      }
    >
      <div className="flex h-full flex-col items-center gap-[6px] hover:cursor-pointer md:gap-2">
        <div className="flex h-full w-full flex-col items-center justify-center rounded-lg bg-[#f4f7fa] capitalize lg:rounded-xl">
          <Image
            alt={categoryName}
            className="h-3/5 w-3/4 object-contain"
            height={200}
            src={`/${categoryName}.png`}
            width={200}
          />
        </div>
        <span className="font-bold text-[13px] text-gray-800 capitalize sm:text-sm md:text-base xl:text-xl">
          {categoryName}
        </span>
      </div>
    </Link>
  );
}
