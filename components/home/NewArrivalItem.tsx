import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { Check } from "lucide-react";
import Image from "next/image";
import React from "react";

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
  productId
}: NewArrivalsProp) {
  const saved = useQuery(api.product.getSavedOrWishlistProduct, { productId, type:"saved"})
  return (
    <div className="flex flex-col justify-between lg:w-1/4 min-w-60 min-h-60 relative  flex-grow">
      <span className="absolute bg-white uppercase px-3 py-1 top-5 left-5 font-bold text-black rounded-sm">
        new
      </span>
      <div className="flex-grow bg-gray-100 rounded-md flex flex-col items-center justify-center gap-3 py-4 lg:py-0">
        <Image
          src={image}
          alt={name}
          width={500}
          height={500}
          className="lg:h-2/3 h-48 w-3/4 object-cover "
        />
        <button  className={`bg-flickmart flex  items-center justify-center gap-2 ${saved?.added ? "bg-white border border-flickmart text-gray-800" : "text-white"}  w-5/6 rounded-lg py-3`}>
          {saved?.added? "Saved" : "Save" }
          {saved?.added && <Check/>}
        </button>
      </div>
      <div className=" flex flex-col lg:py-4 lg:space-y-3 space-y-1 pt-2 font-semibold">
        <span className="">{name}</span>
        <span>&#8358;{price.toLocaleString()}</span>
      </div>
    </div>
  );
}
