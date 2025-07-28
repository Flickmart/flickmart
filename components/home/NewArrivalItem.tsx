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
  const saved = useQuery(api.product.getSavedOrWishlistProduct, {
    productId,
    type: "saved",
  });
  if (saved?.error && saved.data === null) {
    console.log(saved.error.message);
  }

  return (
    <div className="flex flex-col justify-between lg:min-w-72 min-w-60 min-h-60 relative  flex-grow">
      <span className="absolute bg-white uppercase px-3 py-1 top-5 left-5 font-bold text-black rounded-sm">
        new
      </span>
      <div className="flex-grow bg-gray-100 rounded-md min-h-40 flex flex-col items-center justify-center">
        <div className="lg:h-2/3 h-48 bg-gray-300 w-full ">
          <Image
            src={image || "/no-image.png"}
            alt={name}
            width={500}
            height={500}
            className="size-full object-cover "
          />
        </div>
        <div className=" w-full py-6 flex justify-center h-1/4">
          <button className={`bg-flickmart text-white  w-5/6 rounded-lg py-3 lg:py-3.5`}>
            Save
          </button>
        </div>
      </div>
      <div className=" flex flex-col lg:py-4 lg:space-y-3 space-y-1 pt-2 font-semibold">
        <span className="">{name}</span>
        <span>&#8358;{price.toLocaleString()}</span>
      </div>
    </div>
  );
}
