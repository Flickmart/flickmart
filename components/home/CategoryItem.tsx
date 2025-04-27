'use client';
import Image from "next/image";
import Link from "next/link";

export default function CategoryItem({ categoryName } : { categoryName: string; }) {

  return (
    <div className="hover:cursor-pointer relative">
      <div className="bg-[#f4f7fa] lg:p-0  h-36 lg:h-52 lg:rounded-xl capitalize flex flex-col items-center justify-center space-y-4 lg:space-y-7 text-gray-800">
        <Image
          src={`/${categoryName}.png`}
          alt={categoryName}
          width={200}
          height={200}
          className="h-1/3 w-3/4 object-contain "
        />
        <span className="font-bold text-sm lg:text-xl">{categoryName}</span>
      </div>
      <Link href={`/categories/${categoryName}`} className="hidden absolute inset-0 z-10 lg:block h-full w-full"></Link>
    </div>
  );
}
