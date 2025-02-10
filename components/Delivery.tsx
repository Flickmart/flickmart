import Image from "next/image";
import React from "react";

export default function Delivery() {
  return (
    <div className="h-96 bg-flickmartLight flex gap-8 justify-between">
      <Image
        src="/delivery.png"
        width={500}
        height={500}
        alt="delivery"
        className="w-2/4  "
      />
      <div className="flex-grow flex items-center capitalize ">
        <div className="p-5 flex flex-col justify-center space-y-7">
          <h2 className="uppercase font-bold text-4xl text-red-950">
            delivery services
          </h2>
          <h3 className=" text-3xl">Become a delivery partner with us</h3>
          <p className="  text-lg">
            bringing your orders right to your doorstep
          </p>
          <span>quick services - no delays</span>
        </div>
      </div>
    </div>
  );
}
