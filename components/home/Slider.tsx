"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  // CarouselNext,
  // CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "../ui/button";

const banners= [
  "flick-ban-1.jpg",
  "flick-ban-2.jpg",
  "flick-ban-3.jpg",
  "flick-ban-4.jpg"
]

export default function Slider() {
  const [api, setApi] = useState<CarouselApi>();
  const [count, setCount] = useState(0);
  const [current, setCurrent] = useState(0);
  const catRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    catRef.current?.scrollIntoView({behavior: "smooth", block: "start"})
  },[])

  useEffect(
    function () {
     const intervalId= setInterval(()=>{
        if(current === count){
          api?.scrollTo(0)
        }else{
          api?.scrollNext()
        }
      }, 2000)

      if (!api) {
        return;
      }
      setCount(api.scrollSnapList().length);

      setCurrent(api?.selectedScrollSnap() + 1);

      api.on("select", () => setCurrent(api.selectedScrollSnap() + 1));

      return ()=>{
        clearTimeout(intervalId)
      }
    },
    [api, current, count]
  );
  return (
    <div className="py-3 lg:py-5 px-1 lg:px-2" ref={catRef}>
      <Carousel setApi={setApi}>
        <CarouselContent>
          {banners.map((img, index) => (
            <CarouselItem key={index}>
              <div
                style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), url(/${img})` }}
                className={`lg:py-3 bg-no-repeat bg-center bg-cover text-gray-200  lg:px-5 pb-2 p-7 capitalize h-32 lg:min-h-60 flex items-end justify-center lg:space-y-7 space-y-2.5`}>
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
      </Carousel>
    </div>
  );
}
