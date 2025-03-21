"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Bookmark,
  Heart,
  MapPin,
  MessageCircle,
  Share,
  Store,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

import { CommentDrawer } from "@/components/products/comments";
import MobileNav from "@/components/MobileNav";
import Navbar from "@/components/Navbar";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import SimilarAdverts from "@/components/products/SimilarAdverts";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useNav from "@/hooks/useNav";
import ProductHeader from "@/components/products/ProductHeader";
import Comment from "@/components/products/Comment";
const productIcons=[
  {label: "likes", icon: <ThumbsUp/>},
  {label: "dislikes", icon: <ThumbsDown/>},
  {label: "wishlist", icon: <Heart/>},
  {label: "comments", icon: <MessageCircle/>}
]

export default function ProductPage() {
  const [isCommentDrawerOpen, setIsCommentDrawerOpen] = useState(false);
  const isVisible= useNav()
  const [isMobile, setIsMobile]= useState(true)

  

  return (
    <div className="min-h-screen pt-3  lg:p-5 space-y-7 bg-slate-100  gap-x-6">
      <div className="lg:flex gap-5 space-y-3">
        <div className="lg:w-2/4  flex  flex-col  justify-center items-center  space-y-5">
          <Image src="/airpods-demo.png" alt="airpods" width={500} height={500} className=" w-full lg:h-[550px] lg:object-cover  aspect-square"/>
          {isMobile? <ProductHeader/> : null}
          <div className="bg-white rounded-md flex justify-around w-full p-5">
      {productIcons.map(item => <div key={item.label} className="capitalize space-y-3 text-center"><div className="flex justify-center">{item.icon}</div> <span className="inline-block text-sm lg:text-lg">{item.label}</span></div>)}
          </div>
        </div>
        <div className=" lg:w-2/4 flex flex-col justify-center space-y-3">
        {isMobile? <Comment/> : null}
        {isMobile? null : <ProductHeader/>}
          <div className="space-y-2 bg-white rounded-md p-5">
            <h3 className="text-flickmart-chat-orange font-semibold text-lg tracking-wider">Description</h3>
            <p className="text-justify text-sm leading-snug">Get the best sound from Airpod pro 2nd Gen, It last long
  and its very durable and noiseless  Get the best sound from Airpod pro 2nd   Gen, It last long and its very durable and noiseless  Get the best sound from  Airpod pro 2nd Gen, It last long
  and its very durable and noiseless  Get the best sound from Airpod pro Gen, It last long and its very durable and noiseless  Get the best sound from Airpod pro 2nd Gen, It last long and its very durable and noiseless  </p>
          </div>
          <div className="grid-cols-2 grid grid-rows-3 capitalize bg-white rounded-md p-5 gap-5">
            <span>condition</span>
            <span className="font-semibold">used</span> 
            <span>category</span>
            <span className="font-semibold">electronics</span>
            <span>exchange possible</span>
            <span className="font-semibold">no</span>
          </div>
          <div className="bg-white px-5 rounded-md">
            <Accordion  type="multiple">
              <AccordionItem value="item-1">
                <AccordionTrigger className="!font-semibold">Safety Tips</AccordionTrigger>
                <AccordionContent className="flex flex-col space-y-2"> 
                  <span>Avoid paying to the seller directly,use the escrow service to be safe</span>
                  <span>Meet the seller or delivery person in a public place</span>
                  <span>Inspect the item carefully to ensure it matches your expectation</span>
                  <span>Verify that the packed item is the one you inspected</span>
                  <span>Click i have received the goods only when you are fully satisfied</span>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
          <div className={` ${isVisible?"translate-y-0": "-translate-y-[-100%]"} lg:translate-y-0 transition  duration-300  flex space-x-5 p-3 lg:p-0 lg:relative bg-white fixed bottom-0 w-full z-30 `}>
            <div className="bg-white rounded-md shadow-md w-1/4 lg:w-1/12 flex justify-center items-center">
              <button className="rounded-full text-flickmart-chat-orange p-2 shadow-lg bg-white"><Bookmark/></button>
            </div>
            <button className="bg-flickmart-chat-orange flex text-white py-4 capitalize gap-10 font-medium items-center rounded-md w-full justify-center">
              <Store size={25} className="!font-thin"/>
              <span className="text-lg">post ads like this</span>
            </button>
          </div>
        </div>
      </div>
      {isMobile? null: <Comment/> }
      <SimilarAdverts/>
    </div>
  );
}



// <main className=" bg-orange-400 max-w-screen  mx-auto px-2 sm:px-4 py-4 sm:py-8 mt-16">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
//           {/* Product Images */}
//           <div className="space-y-4">
//             <Carousel>
//               <CarouselContent>
//                 <CarouselItem>
//                   <div className="relative aspect-square">
//                     <Image
//                       src="/airpods-demo.png"
//                       alt="Apple Airpod Pro 2nd Gen"
//                       fill
//                       className="rounded-lg object-cover"
//                     />
//                     <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
//                       884.03 x 916
//                     </div>
//                   </div>
//                 </CarouselItem>
//                 <CarouselItem>
//                   <div className="relative aspect-square">
//                     <Image
//                       src="/electronics.png"
//                       alt="Apple Airpod Pro 2nd Gen"
//                       fill
//                       className="rounded-lg object-cover"
//                     />
//                     <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
//                       884.03 x 916
//                     </div>{" "}
//                   </div>
//                 </CarouselItem>
//                 <CarouselItem>
//                   <div className="relative aspect-square">
//                     <Image
//                       src="/fashion.png"
//                       alt="Apple Airpod Pro 2nd Gen"
//                       fill
//                       className="rounded-lg object-cover"
//                     />
//                     <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
//                       884.03 x 916
//                     </div>
//                   </div>
//                 </CarouselItem>
//               </CarouselContent>
//             </Carousel>

//             <div className="flex items-center justify-around pt-4 border-t">
//               <Button variant="ghost" className="flex flex-col items-center">
//                 <ThumbsUp className="w-5 h-5" />
//                 <span className="text-xs">Likes</span>
//               </Button>
//               <Button variant="ghost" className="flex flex-col items-center">
//                 <ThumbsDown className="w-5 h-5" />
//                 <span className="text-xs">Dislikes</span>
//               </Button>
//               <Button
//                 variant="ghost"
//                 className="flex flex-col items-center"
//                 onClick={() => setIsCommentDrawerOpen(true)}
//               >
//                 <MessageCircle className="w-5 h-5" />
//                 <span className="text-xs">Comments</span>
//               </Button>
//               <Button variant="ghost" className="flex flex-col items-center">
//                 <Heart className="w-5 h-5" />
//                 <span className="text-xs">Wishlist</span>
//               </Button>
//             </div>
//           </div>

//           {/* Product Info */}
//           <div className="space-y-4 sm:space-y-6">
//             <div>
//               <h1 className="text-xl sm:text-2xl font-bold mb-2">
//                 Apple Airpod Pro 2nd Gen
//               </h1>
//               <div className="flex items-center gap-2">
//                 <div className="text-3xl font-bold text-orange-500">
//                   ₦53,000
//                 </div>
//                 <Badge
//                   variant="secondary"
//                   className="bg-green-100 text-green-700 hover:bg-green-100"
//                 >
//                   Verified
//                 </Badge>
//               </div>
//             </div>

//             <div className="flex gap-4">
//               <Button className="flex-1" variant="outline">
//                 <MessageCircle className="w-4 h-4 mr-2" />
//                 Chat vendor
//               </Button>
//               <Button className="flex-1">
//                 <Phone className="w-4 h-4 mr-2" />
//                 Call vendor
//               </Button>
//             </div>

//             <div className="space-y-3 sm:space-y-4">
//               <h3 className="font-semibold">Description</h3>
//               <p className="text-muted-foreground">
//                 Get the best sound from Airpod pro 2nd Gen. It lasts long and is
//                 very durable and noiseless. Get the best sound from Airpod pro
//                 2nd Gen. It lasts long and is very durable and noiseless.
//               </p>

//               <div className="space-y-2">
//                 <h3 className="font-semibold">Details</h3>
//                 <div className="grid grid-cols-2 gap-y-2">
//                   <div className="flex items-center gap-2">
//                     <span className="text-muted-foreground">Used:</span>
//                     <span>No</span>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <span className="text-muted-foreground">Category:</span>
//                     <span>Electronics</span>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <span className="text-muted-foreground">Condition:</span>
//                     <span>Exchange possible</span>
//                   </div>
//                 </div>
//               </div>

//               <div className="space-y-2">
//                 <h3 className="font-semibold">Safety Tips</h3>
//                 <ul className="space-y-2 text-sm text-red-500">
//                   <li>
//                     • Avoid paying to the seller directly, use the escrow
//                     service to be safe
//                   </li>
//                   <li>
//                     • Meet the seller or delivery person in a public place
//                   </li>
//                   <li>
//                     • Inspect the item carefully to ensure it matches your
//                     expectation
//                   </li>
//                   <li>
//                     • Verify that the packed item is the one you inspected
//                   </li>
//                   <li>
//                     • Click I have received the goods only when you are fully
//                     satisfied
//                   </li>
//                 </ul>
//               </div>
//             </div>
//             <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white mt-4 sm:mt-6">
//               Post Ads Like This
//             </Button>
//           </div>
//         </div>

//         {/* Similar Products */}
//         <div className="mt-8 sm:mt-12">
//           <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
//             Similar Adverts
//           </h2>
//           <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
//             {/* Product Cards */}
//             {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
//               <Card key={item} className="overflow-hidden">
//                 <div className="relative aspect-square">
//                   <Badge className="absolute top-2 left-2 z-10 bg-red-500">
//                     HOT
//                   </Badge>
//                   <Button
//                     size="icon"
//                     variant="ghost"
//                     className="absolute top-2 right-2 z-10 bg-white/80 hover:bg-white"
//                   >
//                     <Heart className="w-4 h-4" />
//                   </Button>
//                   <Image
//                     src="/electronics.png"
//                     alt="Product"
//                     fill
//                     className="object-cover"
//                   />
//                 </div>
//                 <div className="p-3">
//                   <h3 className="font-medium line-clamp-2">
//                     Freestyle Crew Racer leather jacket
//                   </h3>
//                   <p className="text-orange-500 font-bold mt-1">$595.00</p>
//                 </div>
//               </Card>
//             ))}
//           </div>
//         </div>
//       </main>
