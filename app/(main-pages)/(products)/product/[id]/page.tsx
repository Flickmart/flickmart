"use client";
import {
  Bookmark,
  ChevronLeft,
  Heart,
  MessageCircle,
  Store,
  ThumbsDown,
  ThumbsUp,
  X,
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
import { useParams, useRouter } from "next/navigation";
import { useIsMobile } from "@/hooks/use-mobile";
import Link from "next/link";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import Image from "next/image";
import useSlider from "@/hooks/useSlider";
import { Drawer, DrawerTrigger } from "@/components/ui/drawer";
import CommentContent from "@/components/products/CommentContent";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { useIsLarge } from "@/hooks/useLarge";
import { SyncLoader } from "react-spinners";

export default function ProductPage() {
  const [viewed, setViewed] = useState(false);
  const isVisible = useNav();
  const isMobile = useIsMobile();
  const isLarge = useIsLarge();
  const params = useParams();
  const productId = params.id as Id<"product">;
  const likeProduct = useMutation(api.product.likeProduct);
  const dislikeProduct = useMutation(api.product.dislikeProduct);
  const bookmarkProduct = useMutation(api.product.addBookmark);
  const productData = productId
    ? useQuery(api.product.getById, { productId })
    : null;
  const like = useQuery(api.product.getLikeByProductId, { productId });
  const saved = useQuery(api.product.getSavedOrWishlistProduct, {
    productId,
    type: "saved",
  });
  const wishlist = useQuery(api.product.getSavedOrWishlistProduct, {
    productId,
    type: "wishlist",
  });
  const view = useMutation(api.views.createView);
  const exchangePossible = productData?.exchange === true ? "yes" : "no";
  const { setApi, setAutoScroll } = useSlider();
  const comments = useQuery(api.comments.getCommentsByProductId, { productId });
  const user = useQuery(api.users.current);
  const router = useRouter();

  const productIcons = [
    {
      label: "likes",
      icon: (
        <ThumbsUp
          className={`transition-[stroke, fill] duration-500 ease-in-out transform hover:scale-110 ${like?.liked ? "fill-flickmart stroke-none" : "fill-none stroke-current"}`}
        />
      ),
    },
    {
      label: "dislikes",
      icon: (
        <ThumbsDown
          className={`transition-[stroke, fill] duration-500 ease-in-out transform hover:scale-110 ${like?.disliked ? "fill-flickmart stroke-none" : "fill-none stroke-current"}`}
        />
      ),
    },
    {
      label: "wishlist",
      icon: (
        <Heart
          className={`transition-[stroke, fill] duration-500 ease-in-out transform hover:scale-110 ${wishlist?.data?.added ? "fill-red-600 stroke-none" : "fill-none stroke-current"}`}
        />
      ),
    },
  ];

  const handleGestures = async (label: string) => {
    try {
      if (!user) {
        toast.error("Please sign in to perform this action");
        return;
      }
      if (label === "likes") {
        await likeProduct({ productId });
      }
      if (label === "dislikes") {
        await dislikeProduct({ productId });
      }
      if (label === "wishlist" || label === "saved") {
        const bookmarked = await bookmarkProduct({ productId, type: label });

        // bookmarked?.added

        typeof bookmarked === "object" && bookmarked?.added
          ? toast.success(`Item added to ${label}`)
          : toast.success(`Item removed from ${label}`);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const [enlarge, setEnlarge] = useState(false);

  if (isLarge && enlarge) {
    setEnlarge(false);
    setAutoScroll(true);
  }

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!productData) {
      setLoading(true);
      return;
    }
    // View Page once it loads
    if (!viewed) {
      view({ productId }).then((data) => console.log(data));
      setViewed(true);
      return;
    }
    setLoading(false);
  }, [productData, viewed]);

  if (loading) {
    return (
      <div className="bg-black/50 flex justify-center items-center z-50 fixed  inset-0">
        <SyncLoader color="#f81" />
      </div>
    );
  }

  return (
    <Drawer>
      <div className="min-h-screen lg:p-5 space-y-7 bg-slate-100  gap-x-6">
        <div className="lg:grid lg:grid-cols-2 gap-5 space-y-3">
          <div className="flex flex-col justify-center items-center border">
            <div
              onClick={(e) => {
                e.stopPropagation();
                setEnlarge(false);
                setAutoScroll(true);
              }}
              className={
                enlarge
                  ? "block bg-black fixed w-screen h-screen z-[60] top-0 right-0  sm:bg-black/75"
                  : "hidden"
              }
            >
              <button type="button">
                <ChevronLeft
                  size={30}
                  className="text-white absolute hover:text-flickmart top-6 left-2 transition-colors sm:hidden"
                />
                <X
                  size={30}
                  className="text-white absolute hover:text-flickmart top-6 left-2 transition-colors hidden sm:block"
                />
              </button>
            </div>
            <div
              onClick={() => {
                setEnlarge(true);
                setAutoScroll(false);
              }}
              className={`cursor-pointer  sm:cursor-default ${enlarge ? "enlarge" : ""}`}
            >
              <Carousel setApi={setApi}>
                <CarouselContent>
                  {productData?.images.map((image, index) => {
                    return (
                      <CarouselItem key={index}>
                        <Image
                          src={image}
                          alt={productData.title}
                          width={500}
                          height={500}
                          className="w-full h-full lg:h-[550px] object-cover aspect-square"
                        />
                      </CarouselItem>
                    );
                  })}
                </CarouselContent>
              </Carousel>
            </div>

            {isMobile ? (
              <ProductHeader
                description={productData?.description || ""}
                productId={productId}
                location={productData?.location ?? ""}
                price={productData?.price ?? 0}
                title={productData?.title ?? ""}
                timestamp={productData?.timeStamp ?? ""}
                userId={productData?.userId!}
              />
            ) : null}
            <div className="bg-white rounded-md flex justify-around w-full p-5">
              {productIcons.map((item) => {
                return (
                  <div
                    key={item.label}
                    onClick={() => handleGestures(item.label)}
                    className="capitalize space-y-3 text-center cursor-pointer"
                  >
                    <div className={`flex justify-center`}>{item.icon}</div>{" "}
                    <span className="inline-block text-sm lg:text-lg">
                      {productData?.likes && item.label === "likes"
                        ? productData.likes
                        : productData?.dislikes && item.label === "dislikes"
                          ? productData.dislikes
                          : item.label}
                    </span>
                  </div>
                );
              })}
              <DrawerTrigger className="">
                <div className="capitalize space-y-3 text-center cursor-pointer">
                  <div className={`flex justify-center`}>
                    <MessageCircle />
                  </div>
                  <span className="inline-block text-sm lg:text-lg">
                    {comments?.length ? comments.length : "comment"}
                  </span>
                </div>
              </DrawerTrigger>
              <CommentContent productId={productId} />
            </div>
          </div>
          <div className="flex flex-col justify-center space-y-3">
            {isMobile && comments?.length ? (
              <Comment productId={productId} />
            ) : null}
            {isMobile ? null : (
              <ProductHeader
                description={productData?.description ?? ""}
                productId={productId}
                location={productData?.location ?? ""}
                price={productData?.price ?? 0}
                title={productData?.title ?? ""}
                timestamp={productData?.timeStamp ?? ""}
                userId={productData?.userId!}
              />
            )}
            <div className="space-y-2 bg-white rounded-md p-5">
              <h3 className="text-flickmart-chat-orange font-semibold text-lg tracking-wider">
                Description
              </h3>
              <p className="text-justify text-sm leading-snug break-words">
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
              <div
                onClick={() => handleGestures("saved")}
                className="bg-white rounded-md shadow-md w-1/4 lg:w-1/12 flex justify-center items-center hover:scale-110 transition-all duration-300"
              >
                <button className="rounded-full text-flickmart-chat-orange p-2 shadow-lg bg-white ">
                  <Bookmark
                    className={`transition-[stroke, fill] duration-500 ease-in-out transform hover:scale-110 ${saved?.data?.added ? "fill-flickmart stroke-none" : "fill-none stroke-current"}`}
                  />
                </button>
              </div>
              <Link
                href="/post-ad"
                className="w-full hover:scale-105 transition-all duration-300"
              >
                <button className="bg-flickmart-chat-orange flex text-white py-4 capitalize gap-10 font-medium items-center rounded-md w-full justify-center">
                  <Store size={25} className="!font-thin" />
                  <span className="text-lg">post ads like this</span>
                </button>
              </Link>
            </div>
          </div>
        </div>
        {isMobile || !comments?.length ? null : (
          <Comment productId={productId} />
        )}
        <SimilarAdverts productId={productId} />
      </div>
    </Drawer>
  );
}
