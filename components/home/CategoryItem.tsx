import Image from "next/image";
import React from "react";

export default function CategoryItem({
  categoryName,
}: {
  categoryName: string;
}) {
  return (
    <div className="bg-gray-200 lg:p-0  lg:h-80 h-52 rounded-xl capitalize flex flex-col items-center justify-center space-y-7 text-gray-700">
      <Image
        src={`/${categoryName}.png`}
        alt={categoryName}
        width={200}
        height={200}
        className="h-2/3 w-3/4 object-contain "
      />
      <span className="font-semibold lg:text-xl">{categoryName}</span>
    </div>
  );
}
