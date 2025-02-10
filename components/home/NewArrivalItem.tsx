import Image from "next/image";
import React from "react";

interface NewArrivalsProp {
  image: string;
  name: string;
  price: number;
}

export default function NewArrivalItem({
  image,
  name,
  price,
}: NewArrivalsProp) {
  return (
    <div className="flex flex-col justify-between lg:w-1/4 min-w-40 relative  flex-grow">
      <span className="absolute bg-white uppercase px-3 py-1 top-5 left-5 font-bold text-black rounded-sm">
        new
      </span>
      <div className="flex-grow bg-gray-100 rounded-md flex flex-col items-center justify-center gap-3 py-4 lg:py-0">
        <Image
          src={`/${image}.png`}
          alt={name}
          width={500}
          height={500}
          className="h-2/3 w-3/4 object-cover "
        />
        <button className="bg-flickmart text-white w-3/4 rounded-lg py-3">
          save
        </button>
      </div>
      <div className=" flex flex-col lg:py-4 lg:space-y-3 space-y-1 pt-2 font-semibold">
        <span className="">{name}</span>
        <span>${price}</span>
      </div>
    </div>
  );
}
