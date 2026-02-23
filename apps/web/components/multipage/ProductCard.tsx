import { useMutation, useQuery } from 'convex/react';
import { Bookmark, MapPin } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import VerifiedBadge from '@/components/VerifiedBadge';
import { api } from 'backend/convex/_generated/api';
import type { Id } from 'backend/convex/_generated/dataModel';
import { useAuthUser } from '@/hooks/useAuthUser';

export default function ProductCard({
  image,
  title,
  price,
  location,
  likes,
  productId,
  views,
  sellerId,
}: {
  image?: string;
  title?: string;
  price?: number;
  location?: string;
  likes?: number;
  productId: Id<'product'>;
  views?: number;
  sellerId?: Id<'users'>;
}) {
  const comments = useQuery(api.comments.getCommentsByProductId, {
    productId,
  });

  // Fetch seller verified status
  const isSellerVerified = useQuery(
    api.users.isUserVerified,
    sellerId ? { userId: sellerId } : 'skip'
  );

  const [currentIndex, setCurrentIndex] = useState(0);

  const userEngagements = [
    {
      engagementName: 'Like',
      engagement: likes || 0,
    },
    {
      engagementName: 'Comment',
      engagement: comments?.length || 0,
    },
    {
      engagementName: 'View',
      engagement: views || 0,
    },
  ];
  useEffect(() => {
    const id = setTimeout(() => {
      if (currentIndex < userEngagements.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        setCurrentIndex(0);
      }
    }, 2000);
    () => {
      clearTimeout(id);
    };
  });

  const saved = useQuery(api.product.getSavedOrWishlistProduct, {
    productId,
    type: 'saved',
  });
  const bookmarkProduct = useMutation(api.product.addBookmark);

  const { isAuthenticated } = useAuthUser({
    redirectOnUnauthenticated: false,
  });
  const router = useRouter();
  const handleBookmark = async () => {
    try {
      if (!isAuthenticated) {
        toast.error('Please sign in to perform this action');
        router.push(`/sign-in?callback=/product/${productId}`);
        return;
      }
      const bookmarked = await bookmarkProduct({ productId, type: 'saved' });
      // bookmarked?.added
      typeof bookmarked === 'object' && bookmarked?.added
        ? toast.success('Item added to saved')
        : toast.success('Item removed from saved');
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="relative h-[300px] justify-between overflow-hidden rounded-md border border-[#BDBDBD] bg-white p-[6px]">
      <div className="-rotate-45 -left-10 absolute top-3 z-10 flex w-32 items-center justify-center gap-1 bg-[#FF5031] py-1 font-bold text-sm text-white uppercase">
        <Image alt="fire" height={20} src="/icons/fire-icon.png" width={20} />
        hot
      </div>
      {/* Implement bookmark feature */}
      <button
        className={
          'absolute top-2 right-2 z-10 rounded-full bg-white p-2 shadow-lg'
        }
        onClick={(e) => {
          e.stopPropagation();
          handleBookmark();
        }}
        type="button"
      >
        <Bookmark
          className={` ${saved?.data?.added ? 'fill-flickmart stroke-[#F68B1E]' : 'fill-[#6C7275] stroke-[#6C7275]'}`}
        />
      </button>
      {image ? (
        <div className="block h-[74%] overflow-hidden rounded-sm">
          <Image
            alt={title || ''}
            className="size-full border object-cover object-top transition-transform duration-300 sm:hover:scale-125"
            height={500}
            src={image || ''}
            width={500}
          />
        </div>
      ) : (
        <div className="relative block h-[74%]">
          <Image
            alt={title || ''}
            className="abs-center-x abs-center-y absolute w-1/2 rounded-sm object-top"
            height={500}
            src="/no-image.png"
            width={500}
          />
        </div>
      )}
      <div className="flex flex-col space-y-[3px] pt-1 text-left">
        <div className="flex items-center gap-1 font-medium text-gray-700 text-sm capitalize">
          <MapPin className="size-4 text-red-500" />
          {location}
        </div>
        <div className="flex items-center gap-1">
          <p className="overflow-hidden text-ellipsis whitespace-nowrap font-semibold">
            {title}
          </p>
          {isSellerVerified && <VerifiedBadge size="sm" />}
        </div>
        <div className="flex items-start justify-between text-sm">
          <span className="font-semibold text-flickmart">
            &#8358;{price?.toLocaleString()}
          </span>
          <div className="flex flex-col items-end gap-1">
            {userEngagements.map(({ engagementName, engagement }, index) => {
              if (engagement !== 1) {
                engagementName += 's';
              }
              let position = '';
              if (currentIndex > index) {
                position = '-translate-y-full opacity-0';
              } else if (currentIndex < index) {
                position = 'translate-y-full opacity-0';
              } else {
                position = 'translate-y-0';
              }
              return (
                <span
                  className={`custom-transition absolute font-semibold text-[#A8A8A8] ${position}`}
                  key={engagementName}
                >
                  {engagement} {engagementName}
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
