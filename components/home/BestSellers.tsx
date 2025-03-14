import React from "react";
import Container from "./Container";
import Image from "next/image";
import { Bookmark } from "lucide-react";
import Link from "next/link";

export default function BestSellers() {
  return (
    <div className="text-center capitalize lg:space-y-10 space-y-5">
      <h2 className=" lg:text-3xl text-2xl text-gray-800 font-semibold">
        best sellers
      </h2>
      <Container>
        <div className="grid grid-cols-2 lg:grid-cols-4 lg:w-4/6 w-full grid-rows-2 lg:gap-x-5 lg:gap-y-10 gap-x-1 gap-y-4">
          {Array.from({ length: 8 }).map((_, index) => (
            // Best Seller Item
            <Link href={`/product/jacket`} key={index}>
              <div className=" flex flex-col justify-between  min-h-64  rounded-md border border-gray-200 relative">
                <span className="absolute bg-white uppercase px-3 py-1 top-4 lg:top-5 lg:left-5 left-3 lg:text-base text-sm font-bold text-black rounded-sm">
                  hot
                </span>
                <span className=" p-1  bg-white absolute top-4 lg:top-5 lg:right-5 right-3 rounded-full">
                  <Bookmark className="fill-gray-500" />
                </span>
                <Image
                  src="/jacket.png"
                  alt="jacket"
                  width={500}
                  height={500}
                  className="h-3/5 p-0.5 rounded-md "
                />
                <div className="flex flex-col p-3 space-y-2 text-left text-gray-800 font-semibold">
                  <span className="lg:text-base text-sm">
                    Freestyle Crew Racer leather jacket
                  </span>
                  <span className="text-flickmart lg:text-sm text-xs">
                    $149.99
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </div>
  );
}
