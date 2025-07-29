"use client";
import Image from "next/image";
import Link from "next/link";

export default function CategoryItem({
  categoryName,
}: {
  categoryName: string;
}) {
  return (
    <Link href={`/subcategories`}>
      <div className="hover:cursor-pointer">
        <div className="bg-[#f4f7fa] lg:p-0  h-36 lg:h-52 lg:rounded-xl capitalize flex flex-col items-center justify-center space-y-4 lg:space-y-7 text-gray-800">
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
