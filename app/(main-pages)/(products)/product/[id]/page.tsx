"use client";
import {
  Bookmark,
  Heart,
  MessageCircle,
  Store,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import SimilarAdverts from "@/components/products/SimilarAdverts";
import useNav from "@/hooks/useNav";
import ProductHeader from "@/components/products/ProductHeader";
import Comment from "@/components/products/Comment";
import { useParams } from "next/navigation";
import { useIsMobile } from "@/hooks/use-mobile";
import Link from "next/link";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import Image from "next/image";
import useSlider from "@/hooks/useSlider";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";


const productIcons = [
  { label: "likes", icon: <ThumbsUp /> },
  { label: "dislikes", icon: <ThumbsDown /> },
  { label: "wishlist", icon: <Heart /> },
  // { label: "comment", icon: <MessageCircle /> },
];

export default function ProductPage() {
  const isVisible = useNav();
  const isMobile = useIsMobile();
  const params = useParams();
  const productId = params.id as Id<"product">
  const productData = productId? useQuery(api.product.getById, { productId }) : null;
  const likeProduct= useMutation(api.product.likeProduct)
  const dislikeProduct= useMutation(api.product.dislikeProduct)
  const [liked, setLiked]= useState<boolean>(false)
  const exchangePossible= productData?.exchange=== true? "yes" : "no"
  const { setApi } = useSlider()


  async function handleLike (label: string){
    if(label === "likes"){
      if(liked) return
      await likeProduct({productId})
      setLiked(true)
    }
    if(label === "dislikes"){
      await dislikeProduct({productId})
    }
    if (label === "comments"){
    }
  }


  return (
    <div className="min-h-screen pt-3  lg:p-5 space-y-7 bg-slate-100  gap-x-6">
      <div className="lg:flex gap-5 space-y-3">
        <div className="lg:w-2/4  flex  flex-col  justify-center items-center  space-y-5">
          <Carousel setApi={setApi}>
            <CarouselContent>
              {productData?.images.map((image, index)=>{
                return(
                  <CarouselItem key={index}>
                    <Image
                      src={image}
                      alt={productData.title}
                      width={500}
                      height={500}
                      className=" w-full lg:h-[550px] lg:object-cover  aspect-square"
                    />
                  </CarouselItem>
                )
              })}
            </CarouselContent>
          </Carousel>
          {isMobile ? <ProductHeader 
            description={productData?.description || ''} 
            productId={productId} 
            location={productData?.location ?? ''} 
            price={productData?.price ?? 0} 
            title={productData?.title ?? ''} 
            timestamp={productData?.timeStamp ?? ''} 
            userId={productData?.userId!} 
          /> : null}
          <div className="bg-white rounded-md flex justify-around w-full p-5">
            {productIcons.map((item) => {
              return (
              <div
              onClick={() => handleLike(item.label)}
              key={item.label}
              className="capitalize space-y-3 text-center cursor-pointer"
              >
                <div className={`flex justify-center`}>{item.icon}</div>{" "}
                <span className="inline-block text-sm lg:text-lg">
                {(productData?.likes && item.label === "likes") ? productData.likes : 
                (productData?.dislikes && item.label === "dislikes") ? productData.dislikes : 
                item.label}
                </span>
              </div>
             )}
            )}
          </div>
        </div>
        <div className=" lg:w-2/4 flex flex-col justify-center space-y-3">
          {isMobile ? <Comment productId={productId} /> : null}
          {isMobile ? null : <ProductHeader description={productData?.description ?? ''} productId={productId} location={productData?.location ?? ''} price={productData?.price ?? 0} title={productData?.title ?? ''} timestamp={productData?.timeStamp ?? ''} userId={productData?.userId!} />}
          <div className="space-y-2 bg-white rounded-md p-5">
            <h3 className="text-flickmart-chat-orange font-semibold text-lg tracking-wider">
              Description
            </h3>
            <p className="text-justify text-sm leading-snug">
              {productData?.description}
            </p>
          </div>
          <div className="grid-cols-2 grid grid-rows-3 capitalize bg-white rounded-md p-5 gap-5">
            <span>condition</span>
            <span className="font-semibold">{productData?.condition}</span>
            <span>category</span>
            <span className="font-semibold">{productData?.category}</span>
            <span>exchange possible</span>
            <span className="font-semibold">{exchangePossible}</span>
          </div>
          <div className="bg-white px-5 rounded-md">
            <Accordion type="multiple">
              <AccordionItem value="item-1">
                <AccordionTrigger className="!font-semibold">
                  Safety Tips
                </AccordionTrigger>
                <AccordionContent className="flex flex-col space-y-2">
                  <span>
                    Avoid paying to the seller directly,use the escrow service
                    to be safe
                  </span>
                  <span>
                    Meet the seller or delivery person in a public place
                  </span>
                  <span>
                    Inspect the item carefully to ensure it matches your
                    expectation
                  </span>
                  <span>
                    Verify that the packed item is the one you inspected
                  </span>
                  <span>
                    Click i have received the goods only when you are fully
                    satisfied
                  </span>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
          <div
            className={` ${isVisible ? "translate-y-0" : "-translate-y-[-100%]"} lg:translate-y-0 transition  duration-300  flex space-x-5 p-3 lg:p-0 lg:relative bg-white fixed bottom-0 w-full z-30 `}
          >
            <div className="bg-white rounded-md shadow-md w-1/4 lg:w-1/12 flex justify-center items-center">
              <button className="rounded-full text-flickmart-chat-orange p-2 shadow-lg bg-white">
                <Bookmark />
              </button>
            </div>
            <button className="bg-flickmart-chat-orange flex text-white py-4 capitalize gap-10 font-medium items-center rounded-md w-full justify-center">
              <Store size={25} className="!font-thin" />
              <Link href="/post-ad">
                <span className="text-lg">post ads like this</span>
              </Link>
            </button>
          </div>
        </div>
      </div>
      {isMobile ? null : <Comment productId={productId} />}
      <SimilarAdverts productId={productId} />
    </div>
  );
}
