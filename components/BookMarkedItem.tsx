"use client";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { initialChat, shareProduct } from "@/utils/helpers";
import { useMutation, useQuery } from "convex/react";
import {
  EllipsisVertical,
  ImageIcon,
  ImageOff,
  MapPin,
  MessageSquareText,
  Share,
} from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function BookedMarkedItem({
  product,
  type,
}: {
  product: Doc<"product">;
  type: "saved" | "wishlist";
}) {
  const [isDelOpen, setIsDelOpen] = useState(false);
  const router = useRouter();
  const bookmarkProduct = useMutation(api.product.addBookmark);
  const user = useQuery(api.users.current);

  if (!user) {
    console.log("User Authentication Required");
    router.push("/sign-in");
  }

  return (
    <div className="w-full py-1 relative items-center  bg-white flex lg:gap-5 gap-3 text-sm">
      <div className="w-2/5 h-48 aspect-square flex text-gray-700 lg:h-80 justify-center items-center">
        {product.images[0] ? (
          <Image
            src={product.images[0]}
            className="size-full   object-cover"
            alt={product.title}
            height={1000}
            width={1000}
          />
        ) : (
          <ImageIcon strokeWidth={1} className="size-full" />
        )}
      </div>
      <div className="flex gap-3 w-3/5 lg:justify-between flex-col py-3 capitalize">
        <div className="flex items-center justify-between">
          <h1 className="text-sm lg:text-2xl font-semibold">{product.title}</h1>
          <div
            onMouseEnter={() => setIsDelOpen(true)}
            onMouseLeave={() => setIsDelOpen(false)}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              setIsDelOpen((prev) => !prev);
            }}
            className="p-1.5 rounded-full text-flickmart-chat-orange hover:bg-orange-100 transition-colors duration-300 relative"
          >
            <EllipsisVertical />
          </div>
        </div>
        {isDelOpen && (
          <motion.button
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            onMouseEnter={() => setIsDelOpen(true)}
            onMouseLeave={() => setIsDelOpen(false)}
            onClick={async (e) => {
              e.stopPropagation();
              e.preventDefault();
              setIsDelOpen(false);
              const deleted = await bookmarkProduct({
                productId: product._id,
                type,
              });
              deleted === "removed" &&
                toast.success(`Item removed from ${type}`);
            }}
            className="z-30 absolute top-8 right-8 py-2 px-6 bg-white text-black border rounded-sm text-sm"
          >
            Remove
          </motion.button>
        )}
        <span className="font-semibold text-sm lg:text-xl">
          &#8358;{product.price.toLocaleString()}
        </span>
        <div>
          <span className="bg-flickmart text-white py-1.5 px-2 rounded-xs text-[10px] lg:text-sm">
            {product.condition}
          </span>
        </div>

        <div className="flex gap-1 items-center text-flickmart-gray text-[10px] lg:text-base">
          <MapPin className="size-4" />
          <span>{product.location}</span>
        </div>
        <div
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          className=" flex gap-3 items-center  "
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => {
              initialChat({
                user: user ?? null,
                userId: product.userId,
                onNavigate: router.push,
              });
            }}
            className="bg-flickmart text-white rounded-sm w-2/4 lg:w-1/4 text-xs flex justify-center min-w-1/4 items-center  lg:text-lg lg:py-2.5 gap-2 px-2 py-2 "
          >
            <MessageSquareText className="size-4" />
            <span>Chat</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() =>
              shareProduct({
                title: product.title,
                description: product.description,
                productId: product._id,
              })
            }
            className="border border-flickmart flex items-center gap-2 py-2 text-xs px-2 rounded-sm w-2/4 lg:w-1/4 lg:text-lg lg:py-2.5 text-flickmart justify-center"
          >
            <Share className="size-4" /> <span>Share</span>
          </motion.button>
        </div>
      </div>
    </div>
  );
}
