import { CarouselApi } from "@/components/ui/carousel";
import { useEffect, useState } from "react";

export default function useSlider(){
  const [api, setApi] = useState<CarouselApi>();
  const [count, setCount] = useState(0);
  const [current, setCurrent] = useState(0);

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

  return { api, setApi, count, current} 
}