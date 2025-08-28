import { Bookmark } from "lucide-react";
import Image from "next/image";
import React from "react";

export default function ProductCard({
  image,
  title,
  price,
}: {
  image?: string;
  title?: string;
  price?: number;
}) {
  return (
    <div className="relative flex min-h-56 flex-col justify-between rounded-md border border-gray-200">
      <span className="absolute top-4 left-3 rounded-sm bg-white px-3 py-1 font-bold text-black text-sm uppercase lg:top-5 lg:left-5 lg:text-base">
        hot
      </span>
      {/* <span className="absolute top-4 right-3 rounded-full bg-white p-1 lg:top-5 lg:right-5">
        <Bookmark className="fill-gray-500" />
      </span> */}
      {image ? (
        <Image
          alt={title || ""}
          className="h-48 rounded-md object-cover object-top p-0.5 lg:h-48"
          height={500}
          src={image || ""}
          width={500}
        />
      ) : null}
      <div className="flex flex-col space-y-2 p-3 text-left font-semibold text-gray-800">
        <span className="text-sm md:text-[13px] lg:text-sm">{title}</span>
        <span className="text-flickmart text-xs lg:text-sm">
          &#8358;{price?.toLocaleString()}
        </span>
      </div>
    </div>
  );
}
