"use client";
import Image from "next/image";
import Link from "next/link";

export default function CategoryItem({
  categoryName,
}: {
  categoryName: string;
}) {
  return (
    <Link href={`/categories/${categoryName}`}>
      <div className="hover:cursor-pointer transition-transform sm:hover:-translate-y-2 duration-300 flex flex-col items-center gap-[6px]">
        <div className="bg-[#f4f7fa] rounded-lg shadow-sm shadow-black/30 lg:p-0 size-[70px] lg:rounded-xl capitalize flex flex-col items-center sm:size-[90px] justify-center">
          <Image
            src={`/${categoryName}.png`}
            alt={categoryName}
            width={200}
            height={200}
            className="w-3/4 h-3/5 object-contain"
          />
        </div>
        <span className="font-bold text-gray-800 text-[13px] capitalize sm:text-sm md:text-[15px]">
          {categoryName}
        </span>
      </div>
    </Link>
  );
}
