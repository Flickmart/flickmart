import { ChevronRight } from "lucide-react";
import Image from "next/image";
import React from "react";

export default function SheetItems({
  categoryName,
  imageUrl,
  type,
  closeSheet,
}: {
  closeSheet?: () => void;
  categoryName: string;
  imageUrl?: string;
  type: string;
}) {
  const imgSrc = categoryName.includes(":")
    ? categoryName.split(" ").slice(0, 2).join(" ").replace(":", "")
    : categoryName;
  return (
    <div
      onClick={() => {
        if (type === "subcategories" && closeSheet) {
          closeSheet();
          return;
        }
        return;
      }}
      className={`cursor-pointer flex items-center justify-between py-2 pr-5 border-t  ${type === "categories" ? "border-gray-300" : "border-gray-200"} `}
    >
      <div className="flex items-center pl-4 gap-5">
        <div className="size-14">
          <Image
            height={300}
            width={300}
            src={
              type === "categories"
                ? `/${categoryName}.png`
                : `/categories/${imgSrc}.png`
            }
            // src={imageUrl}
            alt={categoryName}
            className="size-full object-contain"
          />
        </div>
        <span className="text-gray-800 font-semibold">{categoryName}</span>
      </div>
      <div className="text-gray-600">
        {type === "categories" ? <ChevronRight /> : null}
      </div>
    </div>
  );
}
