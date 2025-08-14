import { api } from "@/convex/_generated/api";
import Image from "next/image";
import React from "react";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";

interface NewArrivalsProp {
  image: string;
  name: string;
  price: number;
  productId: Id<"product">;
}

export default function NewArrivalItem({
  image,
  name,
  price,
  productId,
}: NewArrivalsProp) {
  // const saved = useQuery(api.product.getSavedOrWishlistProduct, {
  //   productId,
  //   type: "saved",
  // });
  // if (saved?.error && saved.data === null) {
  //   console.log(saved.error.message);
  // }

  return (
    <div className="flex flex-col justify-between lg:min-w-72 min-w-60 min-h-60 lg:min-h-30 relative flex-grow">
      <span className="absolute bg-white uppercase px-3 py-1 top-5 left-5 font-bold text-black rounded-sm">
        new
      </span>
      <div className="flex-grow bg-gray-100 rounded-md min-h-40 flex flex-col items-center justify-center">
        <div className="lg:h-64 h-48 bg-gray-300 w-full">
          <Image
            src={image || "/no-image.png"}
            alt={name}
            width={500}
            height={500}
            className="size-full object-cover "
          />
        </div>
        <div className="text-[13px] w-full py-6 px-4 flex flex-col h-1/4 font-semibold">
          <span className="">{name}</span>
          <span>&#8358;{price.toLocaleString()}</span>
        </div>
      </div>
      <div className=" flex lg:py-4 lg:space-y-3 space-y-1 pt-2 font-semibold">
        
      </div>
    </div>
  );
}
