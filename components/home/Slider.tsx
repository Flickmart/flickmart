"use client";
import React, { useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "../ui/button";

export default function Slider() {
  const [api, setApi] = useState<CarouselApi>();
  const [count, setCount] = useState(0);
  const [current, setCurrent] = useState(0);

  useEffect(
    function () {
      if (!api) {
        return;
      }
      setCount(api.scrollSnapList().length);

      setCurrent(api?.selectedScrollSnap() + 1);

      api.on("select", () => setCurrent(api.selectedScrollSnap() + 1));
    },
    [api]
  );
  return (
    <Carousel setApi={setApi}>
      <CarouselContent>
        {Array.from({ length: 3 }).map((_, index) => (
          <CarouselItem key={index}>
            <div className="slide   rounded-2xl lg:py-3 lg:px-5 p-7 capitalize h-full lg:min-h-60 flex flex-col justify-center   items-center space-y-7">
              <div className=" text-center">
                <h1 className="font-medium lg:text-4xl text-2xl">
                  this is slide one
                </h1>
                <p className="font-light leading-relaxed lg:leading-loose lg:text-base text-xs text-gray-300 ">
                  Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ab
                  reiciendis consequuntur
                </p>
              </div>
              <Button className="rounded-3xl capitalize p-5  bg-black text-sm  lg:text-xl lg:px-10 lg:py-6">
                button
              </Button>
              <RadioGroup
                value={current.toString()}
                defaultValue="1"
                className="flex"
              >
                {Array.from({ length: count }).map((_, index) => (
                  <RadioGroupItem
                    onClick={() =>
                      index + 1 > current
                        ? api?.scrollNext()
                        : api?.scrollPrev()
                    }
                    key={index}
                    value={(index + 1).toString()}
                    className=" lg:w-6 lg:h-6 border  border-flickmartLight"
                  />
                ))}
              </RadioGroup>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="bg-black  ml-16 " />
      <CarouselNext className="bg-black  mr-16 " />
    </Carousel>
  );
}
