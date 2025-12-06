'use client';

import { useRef } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import useSlider from '@/hooks/useSlider';

export default function Slider() {
  const banners = [
    'flick-ban-5.jpg',
    'flick-ban-6.jpg',
    'flick-ban-7.jpg',
    'flick-ban-3.jpg',
    'flick-ban-4.jpg',
  ];
  const { setApi } = useSlider();
  const catRef = useRef<HTMLDivElement>(null);

  // Adding categories
  // const catInsert = useMutation(api.categories.insertSubCategory);
  // useEffect(() => {
  //   try {
  //     const insertToDB = async () => {
  //       const category = await addCategories("electronics");
  //       await catInsert(category);
  //       toast.success("Categories added successfully");
  //     };

  //     insertToDB();
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }, []);

  // useEffect(() => {
  //   catRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  // }, []);

  return (
    <div className="section-px py-4 lg:py-5" ref={catRef}>
      <Carousel className="overflow-hidden rounded-xl" setApi={setApi}>
        <CarouselContent>
          {banners.map((img, index) => (
            <CarouselItem className="p-0" key={index}>
              <div
                className={
                  'flex h-40 items-end justify-center space-y-2.5 bg-center bg-cover bg-no-repeat p-7 pb-2 text-gray-200 capitalize sm:h-56 lg:h-80 lg:space-y-7 lg:px-5 lg:py-3'
                }
                style={{
                  backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), url(/${img})`,
                }}
              >
                {/* <RadioGroup
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
                </RadioGroup> */}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
}
