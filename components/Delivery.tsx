"use client";

import Image from "next/image";
import React from "react";
import { Button } from "./ui/button";
import { usePathname } from "next/navigation";
import { toast } from "sonner";

export default function Delivery() {
  const pathname = usePathname();

  // Pages where SearchBox should not be shown
  const hiddenPages = [
    "/sign-in",
    "/sign-up",
    "/forgot-password",
    "/notifications",
    "/settings",
    "post-ad",
    "/create-store",
    "/saved",
    "/chats",
  ];

  if (hiddenPages.includes(pathname)) {
    return null; // Don't render any component
  }
  return (
    <div className="lg:h-96 bg-flickmartLight lg:flex gap-8 justify-between">
      <Image
        priority
        src="/delivery.png"
        width={500}
        height={500}
        alt="delivery"
        className="lg:w-2/5  "
      />
      <div className="flex-grow flex items-center capitalize ">
        <div className="lg:p-5 p-7 flex flex-col justify-center lg:space-y-7 space-y-4">
          <h2 className="uppercase font-bold text-2xl lg:text-4xl text-red-950">
            delivery services
          </h2>
          <h3 className=" lg:text-3xl text-3xl normal-case">
            Become a delivery partner with us.
          </h3>
          <p className="  text-lg">
            bringing your orders right to your doorstep
          </p>
          <span>quick services - no delays</span>
          <Button onClick={()=> toast.success("Coming Soon...")} className="w-2/4 py-5 capitalize bg-black">apply now</Button>
        </div>
      </div>
    </div>
  );
}
