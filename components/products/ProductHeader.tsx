import { CircleUserRound, ExternalLink, Eye, MapPin, MessageCircle, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import type { Id } from '@/convex/_generated/dataModel';
import { useAuthUser } from '@/hooks/useAuthUser';
import { useTrack } from '@/hooks/useTrack';
import { initialChat, shareProduct, timeSince } from '@/utils/helpers';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

export default function ProductHeader({
  location,
  title,
  price,
  timestamp,
  userId,
  productId,
  description,
  aiEnabled,
  recommendationId,
  views,
  handleChat
}: {
  location: string;
  title: string;
  price: number;
  timestamp: string;
  userId: Id<'users'>;
  productId: Id<'product'>;
  description: string;
  aiEnabled: boolean;
  recommendationId: string;
  views: number;
  handleChat: ()=> void;
}) {
  const sellerPresence = useQuery(api.presence.getUserLastSeen, {userId})
  const date = new Date(sellerPresence?.lastUpdated ?? timestamp);
  const dateNow = new Date();
  const router = useRouter();
  const { user, isAuthenticated } = useAuthUser({
    redirectOnUnauthenticated: false,
  });

  async function handleShare() {
    shareProduct({ title, description, productId, price, location });
  }

  return (
    <div className="w-full space-y-4 rounded-md bg-white p-5 lg:space-y-3">
      <div className='flex justify-between gap-2 items-center text-center'>
        <div className="flex items-center gap-1.5 font-light text-gray-500 text-xs">
          <span className="capitalize flex gap-1">
            <MapPin size={17} />
            {location},
          </span>
          <span className="normal-case">{timeSince(dateNow.getTime() - date.getTime())}</span>
        </div>
        <div className='flex items-center text-xs gap-2 text-muted-foreground'>
          <Eye size={17} />
          <span>{views} views</span>
        </div>
      </div>
      {/* <div className='flex justify-between items-center'> */}
      <h2 className="font-bold text-gray-800 text-xl capitalize">{title}</h2>
      {/* { aiEnabled && <span className='text-xs px-2.5 font-semibold text-gray-700 py-1 rounded-2xl bg-green-200'>NKEM Assisted</span>} */}
      {/* </div> */}
      <div className="flex items-center space-x-3">
        <span className="inline-block font-extrabold text-flickmart-chat-orange text-lg tracking-wider">
          &#8358;{price.toLocaleString()}
        </span>
        {/* <span className="bg-green-500/80 tracking-widest p-1 rounded-md text-white font-semibold text-xs">Negotiable</span> */}
      </div>
      <div className="flex gap-3 text-white">
        <button
          className="flex w-2/4 items-center justify-center gap-2 rounded-md bg-flickmart-chat-orange p-2 px-3 font-medium lg:w-1/4"
          onClick={handleChat}
        >
          {' '}
          <MessageCircle /> Chat vendor
        </button>
        <button
          className="flex w-2/4 items-center justify-center gap-2 rounded-md border border-flickmart-chat-orange p-2 px-3 font-medium text-flickmart-chat-orange lg:w-1/4"
          onClick={handleShare}
        >
          {' '}
          <ExternalLink /> Share
        </button>
      </div>
    </div>
  );
}
