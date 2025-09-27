import { ExternalLink, MapPin, MessageCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';
import { toast } from 'sonner';
import type { Id } from '@/convex/_generated/dataModel';
import { useAuthUser } from '@/hooks/useAuthUser';
import { initialChat, shareProduct } from '@/utils/helpers';


export default function ProductHeader({
  location,
  title,
  price,
  timestamp,
  userId,
  productId,
  description,
  aiEnabled
}: {
  location: string;
  title: string;
  price: number;
  timestamp: string;
  userId: Id<'users'>;
  productId: Id<'product'>;
  description: string;
  aiEnabled: boolean
}) {
  const date = new Date(timestamp);
  const dateNow = new Date();
  const dateDiff = dateNow.getTime() - date.getTime();
  const router = useRouter();
  const { user, isAuthenticated } = useAuthUser({
    redirectOnUnauthenticated: false,
  });
  // Convert milliseconds to hours by dividing by number of milliseconds in an hour
  const hoursAgo = Math.floor(dateDiff / (1000 * 60 * 60));
  const minsAgo = Math.floor(dateDiff / (1000 * 60));
  const daysAgo = Math.floor(dateDiff / (1000 * 60 * 60 * 24));
  const weeksAgo = Math.floor(dateDiff / (1000 * 60 * 60 * 24 * 7));
  const monthsAgo = Math.floor(dateDiff / (1000 * 60 * 60 * 24 * 7 * 4));

  const timeSince = () => {
    let value = 0;
    let timeSpan = '';
    if (monthsAgo) {
      value = monthsAgo;
      timeSpan = 'month';
    } else if (weeksAgo) {
      value = weeksAgo;
      timeSpan = 'week';
    } else if (daysAgo) {
      value = daysAgo;
      timeSpan = 'day';
    } else if (hoursAgo) {
      value = hoursAgo;
      timeSpan = 'hour';
    } else if (minsAgo) {
      value = minsAgo;
      timeSpan = 'min';
    }
    if (value > 1) {
      timeSpan += 's';
    }
    return value && timeSpan
      ? `${value} ${timeSpan} ago`
      : 'less than a minute ago';
  };

  const handleChat = () => {
    if (!isAuthenticated) {
      toast.error('Please sign in to perform this action');
      return;
    }
    initialChat({
      user: user ?? null,
      userId,
      onNavigate: router.push,
      productId,
    });
  };

  async function handleShare() {
    shareProduct({ title, description, productId, price });
  }

  return (
    <div className="w-full space-y-4 rounded-md bg-white p-5 lg:space-y-3">
      <div className="flex items-center gap-2 font-light text-gray-500 text-xs">
        <MapPin size={17} />
        <span className="capitalize">
          {location}, <span className="normal-case">{timeSince()}</span>
        </span>
      </div>
      <div className='flex justify-between items-center'>
        <h2 className="font-bold text-gray-800 text-xl capitalize">{title}</h2>
       { aiEnabled && <span className='text-xs px-2.5 font-semibold text-gray-700 py-1 rounded-2xl bg-green-200'>NKEM Assisted</span>}
      </div>
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
