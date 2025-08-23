'use client';

// import { addCategories } from "@/utils/addCategory";
import { useMutation } from 'convex/react';
import React, { useEffect, useRef } from 'react';
import { toast } from 'sonner';
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import { api } from '@/convex/_generated/api';
import useSlider from '@/hooks/useSlider';

const banners = [
  'flick-ban-5.jpg',
  'flick-ban-1.jpg',
  'flick-ban-2.jpg',
  'flick-ban-3.jpg',
  'flick-ban-4.jpg',
];

export default function Slider() {
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
    <div className="py-3 lg:py-5" ref={catRef}>
      <Carousel setApi={setApi}>
        <CarouselContent>
          {banners.map((img, index) => (
            <CarouselItem key={index}>
              <div
                className={
                  'flex h-32 items-end justify-center space-y-2.5 bg-center bg-cover bg-no-repeat p-7 pb-2 text-gray-200 capitalize lg:min-h-60 lg:space-y-7 lg:px-5 lg:py-3'
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

// "use client";
// import { Splide, SplideSlide, SplideTrack } from "@splidejs/react-splide";
// import "@splidejs/react-splide/css";
// import Image from "next/image";

// // Define the feedData array with type annotations
// type FeedItem = {
//   id: number;
//   postImage: string;
// };

// type SliderProps = {
//   feedData: FeedItem[];
// };

// const feedData = [
//   {
//     id: 1,
//     postImage: "/slide-img.png",
//   },
//   {
//     id: 2,
//     postImage: "/flick-ban-3.jpg",
//   },
//   {
//     id: 3,
//     postImage: "/flick-ban-4.jpg",
//   },
// ];

// export default function Slider() {
//   return (
//     <div className="w-full mx-auto mb-12 rounded-md">
//       <Splide
//         options={{
//           rewind: true,
//           autoplay: true,
//           gap: "1rem",
//           arrows: false,
//           speed: 700,
//           delay: 0,
//         }}
//         hasTrack={false}
//         aria-label="..."
//       >
//         <div className="custom-wrapper">
//           {!feedData && null}
//           <SplideTrack className="h-56 md:h-[16rem] lg:h-[16rem] xl:h-[16rem] 2xl:h-[24rem]">
//             {feedData?.map((f) => (
//               <SplideSlide key={f.id} className="h-full relative">
//                 <Image
//                   src={f.postImage}
//                   width={1000}
//                   height={1000}
//                   alt="Image 1"
//                   className="object-cover object-center w-full h-full"
//                 />
//               </SplideSlide>
//             ))}
//           </SplideTrack>
//         </div>
//       </Splide>
//     </div>
//   );
// }
