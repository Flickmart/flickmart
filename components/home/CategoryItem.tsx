"use client";
import Image from "next/image";
import Link from "next/link";

export default function CategoryItem({
  categoryName,
}: {
  categoryName: string;
}) {
  return (
    <Link href={`/categories/${categoryName}`} className="block">
      <div className="hover:cursor-pointer flex flex-col items-center gap-[6px] h-full md:gap-2">
        <div className="bg-[#f4f7fa] rounded-lg capitalize flex flex-col w-full h-full items-center justify-center lg:rounded-xl">
          <Image
            src={`/${categoryName}.png`}
            alt={categoryName}
            width={200}
            height={200}
            className="w-3/4 h-3/5 object-contain"
          />
        </div>
        <span className="font-bold text-gray-800 text-[13px] capitalize sm:text-sm md:text-base xl:text-xl">
          {categoryName}
        </span>
      </div>
    </Link>
  );
}
