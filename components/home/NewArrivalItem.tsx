import { useQuery } from 'convex/react';
import { MapPin } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';

type NewArrivalsProp = {
  image: string;
  name: string;
  price: number;
  productId: Id<'product'>;
  location?: string;
  likes?: number;
  views?: number;
  rating?: number;
};

export default function NewArrivalItem({
  image,
  name,
  price,
  productId,
  location,
  likes,
  views,
  rating,
}: NewArrivalsProp) {
  const saved = useQuery(api.product.getSavedOrWishlistProduct, {
    productId,
    type: 'saved',
  });
  if (saved?.error && saved.data === null) {
    console.log(saved.error.message);
  }
  const comments = useQuery(api.comments.getCommentsByProductId, {
    productId,
  });

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

  return (
    <div className="relative flex w-60 flex-grow flex-col justify-between overflow-hidden sm:w-72">
      <span className="absolute top-3 left-3 rounded-sm bg-white px-3 py-1 font-bold text-black uppercase shadow-md">
        new
      </span>
      <div className="flex-grow rounded-md">
        <div className="h-[40vh] w-full lg:h-64">
          <Image
            alt={name}
            className="size-full object-cover"
            height={500}
            src={image || '/no-image.png'}
            width={500}
          />
        </div>
        <div className="flex flex-col gap-1 pt-2 pb-3">
          <div className="flex items-center gap-1 font-medium text-gray-700 text-sm capitalize">
            <MapPin className="size-4 text-red-500" />
            {location}
          </div>
          <span className="font-semibold">{name}</span>
          <div className="relative flex items-center justify-between text-sm">
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
                  <div
                    className={`custom-transition absolute top-0 flex gap-1 font-semibold text-[#A8A8A8] ${position}`}
                    key={engagementName}
                  >
                    <span>{engagement}</span> <span>{engagementName}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
