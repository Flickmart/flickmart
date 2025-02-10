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
    <div className=" w-1/4 relative ">
      <span className="absolute bg-white uppercase px-3 py-1 top-5 left-5 font-bold text-black rounded-sm">
        new
      </span>
      <div className="h-5/6 bg-gray-100 rounded-md flex flex-col items-center justify-center gap-3">
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
      <div className="h-1/6 flex flex-col py-4 space-y-3 font-semibold">
        <span className="">{name}</span>
        <span>${price}</span>
      </div>
    </div>
  );
}
