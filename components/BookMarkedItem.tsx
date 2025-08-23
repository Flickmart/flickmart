'use client';
import { useMutation } from 'convex/react';
import {
  EllipsisVertical,
  ImageIcon,
  ImageOff,
  MapPin,
  MessageSquareText,
  Share,
} from 'lucide-react';
import { motion } from 'motion/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { api } from '@/convex/_generated/api';
import type { Doc } from '@/convex/_generated/dataModel';
import { useAuthUser } from '@/hooks/useAuthUser';
import { initialChat, shareProduct } from '@/utils/helpers';

export default function BookedMarkedItem({
  product,
  type,
}: {
  product: Doc<'product'>;
  type: 'saved' | 'wishlist';
}) {
  const [isDelOpen, setIsDelOpen] = useState(false);
  const router = useRouter();
  const bookmarkProduct = useMutation(api.product.addBookmark);
  const { user, isAuthenticated } = useAuthUser({
    redirectOnUnauthenticated: false,
  });

  // If user is not authenticated, don't render the component
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="relative flex w-full items-center gap-3 bg-white py-1 text-sm lg:gap-5">
      <div className="flex aspect-square h-48 w-2/5 items-center justify-center text-gray-700 lg:h-80">
        {product?.images[0] ? (
          <Image
            alt={product?.title}
            className="size-full object-cover"
            height={1000}
            src={product?.images[0]}
            width={1000}
          />
        ) : (
          <ImageIcon className="size-full" strokeWidth={1} />
        )}
      </div>
      <div className="flex w-3/5 flex-col gap-3 py-3 capitalize lg:justify-between">
        <div className="flex items-center justify-between">
          <h1 className="font-semibold text-sm lg:text-2xl">
            {product?.title}
          </h1>
          <div
            className="relative rounded-full p-1.5 text-flickmart-chat-orange transition-colors duration-300 hover:bg-orange-100"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              setIsDelOpen((prev) => !prev);
            }}
            onMouseEnter={() => setIsDelOpen(true)}
            onMouseLeave={() => setIsDelOpen(false)}
          >
            <EllipsisVertical />
          </div>
        </div>
        {isDelOpen && (
          <motion.button
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-8 right-8 z-30 rounded-sm border bg-white px-6 py-2 text-black text-sm"
            initial={{ opacity: 0, y: -10 }}
            onClick={async (e) => {
              e.stopPropagation();
              e.preventDefault();
              setIsDelOpen(false);
              const deleted = await bookmarkProduct({
                productId: product?._id,
                type,
              });
              deleted === 'removed' &&
                toast.success(`Item removed from ${type}`);
            }}
            onMouseEnter={() => setIsDelOpen(true)}
            onMouseLeave={() => setIsDelOpen(false)}
          >
            Remove
          </motion.button>
        )}
        <span className="font-semibold text-sm lg:text-xl">
          &#8358;{product?.price.toLocaleString()}
        </span>
        <div>
          <span className="rounded-xs bg-flickmart px-2 py-1.5 text-[10px] text-white lg:text-sm">
            {product?.condition}
          </span>
        </div>

        <div className="flex items-center gap-1 text-[10px] text-flickmart-gray lg:text-base">
          <MapPin className="size-4" />
          <span>{product?.location}</span>
        </div>
        <div
          className="flex items-center gap-3"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <motion.button
            className="flex w-2/4 min-w-1/4 items-center justify-center gap-2 rounded-sm bg-flickmart px-2 py-2 text-white text-xs lg:w-1/4 lg:py-2.5 lg:text-lg"
            onClick={() => {
              initialChat({
                user: user ?? null,
                userId: product?.userId,
                onNavigate: router.push,
              });
            }}
            whileHover={{ scale: 1.05 }}
          >
            <MessageSquareText className="size-4" />
            <span>Chat</span>
          </motion.button>
          <motion.button
            className="flex w-2/4 items-center justify-center gap-2 rounded-sm border border-flickmart px-2 py-2 text-flickmart text-xs lg:w-1/4 lg:py-2.5 lg:text-lg"
            onClick={() =>
              shareProduct({
                title: product?.title,
                description: product?.description,
                productId: product?._id,
              })
            }
            whileHover={{ scale: 1.05 }}
          >
            <Share className="size-4" /> <span>Share</span>
          </motion.button>
        </div>
      </div>
    </div>
  );
}
