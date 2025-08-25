'use client';

import { useQuery } from 'convex/react';
import Image from 'next/image';
import Link from 'next/link';
import { api } from '@/convex/_generated/api';
import { useProductsByCategoryOrSubCategory } from '@/hooks/useProdByCat';

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
  const imgSrc = item.title.includes('-')
    ? item.title.split(' ').slice(0, 2).join(' ')
    : item.title;

  return (
    <Link
      className="py-3 text-black transition-all duration-500 ease-in-out hover:bg-gray-200 lg:border-b"
      href={`/categories/${category}?subcategory=${item.title}`}
    >
      <div className="flex items-center gap-2 lg:pl-5" onClick={toggleSidebar}>
        <div className="flex aspect-square h-12 w-12 items-center justify-center overflow-hidden md:hidden">
          {item.image && (
            <Image
              alt={item.title}
              className="max-h-full max-w-full"
              height={500}
              src={`/categories/${imgSrc}.png`}
              width={500}
            />
          )}
        </div>
        <div className="text-left">
          <h2 className="font-medium text-[16px] capitalize md:font-normal md:tracking-tighter lg:text-sm">
            {item.title}
          </h2>
          <span className="text-[14px] text-gray-500 lg:text-[10px]">
            {`${productsBySubCat?.length ?? 0}`}{' '}
            {(productsBySubCat?.length ?? 0) === 1 ? 'ad' : 'ads'}
          </span>
        </div>
      </div>
    </Link>
  );
}
