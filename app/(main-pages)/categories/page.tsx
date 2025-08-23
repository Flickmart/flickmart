'use client';
import { useQuery } from 'convex/react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import React, { useState } from 'react';
import Loader from '@/components/multipage/Loader';
import SubcategoryItem from '@/components/post-ad/SubcategoryItem';
import { api } from '@/convex/_generated/api';
import { useProductsByCategoryOrSubCategory } from '@/hooks/useProdByCat';

export default function Subcategories() {
  const searchParams = useSearchParams();
  const category = searchParams.get('category');
  const subcategories = useQuery(api.categories.getCategory, {
    category: category ?? 'homes',
  });

  if (!subcategories) {
    return (
      <div className="grid h-[70vh] w-full place-items-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="h-screen w-full text-gray-800">
      {subcategories?.items.map((subcategory) => {
        return (
          <SubcategoryItem
            category={category ?? ''}
            key={subcategory.title}
            subcategory={subcategory.title}
          />
        );
      })}
    </div>
  );
}
