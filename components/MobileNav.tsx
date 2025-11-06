'use client';
import { useQuery } from 'convex/react';
import {
  Bookmark,
  House,
  MessageSquareText,
  Store,
  UserRound,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { api } from '@/convex/_generated/api';
import { useAuthUser } from '@/hooks/useAuthUser';
import useNav from '@/hooks/useNav';

export default function MobileNav() {
  const pathname = usePathname();
  const isVisible = useNav();
  const router = useRouter();
  const [isLoadingAd, setIsLoadingAd] = useState(false);
  const { user } = useAuthUser();

  // Fetch unread chat messages count
  const conversations = useQuery(
    api.chat.getConversations,
    user?._id ? { userId: user._id } : 'skip'
  );

  // Calculate total unread messages count from all conversations
  const unreadMessagesCount =
    conversations?.reduce((total, conversation) => {
      const userUnreadCount =
        conversation.unreadCount &&
        user?._id &&
        user._id in conversation.unreadCount
          ? conversation.unreadCount[user._id as string]
          : 0;
      return total + userUnreadCount;
    }, 0) || 0;

  // Pages where SearchBox should not be shown
  const _hiddenPages = ['/sign-in', '/sign-up', '/forgot-password', '/chat'];
  const userStore = useQuery(api.store.getStoresByUserId);
  const firstUserStore = userStore?.data;

  // if (hiddenPages.includes(pathname)) {
  //   return null; // Don't render any component
  // }
  useEffect(() => {
    router.prefetch('/post-ad');
    if (firstUserStore && isLoadingAd) {
      setIsLoadingAd(false);
      router.push('/post-ad');
    }
  }, [pathname, firstUserStore, isLoadingAd, router]);

  return (
    <nav
      className={`${isVisible ? "translate-y-0" : "translate-y-[160%]"} fixed bottom-0 z-40 w-full bg-white text-[12px] transition duration-300 lg:hidden ${pathname.includes("/chat") ? "md:hidden" : ""}`}
    >
      <div className="relative mx-auto flex w-[94%] justify-between py-3">
        <Link
          className="group flex flex-col items-center justify-center gap-1.5"
          href="/"
        >
          <House
            className={`${pathname === '/' ? 'text-flickmart' : 'text-flickmart-gray'} h-5 w-5 duration-500 group-hover:text-flickmart`}
          />
          <span
            className={`${pathname === '/' ? 'text-flickmart' : ''} duration-500 group-hover:text-flickmart`}
          >
            Home
          </span>
        </Link>
        <Link
          className="group flex flex-col items-center justify-center gap-1.5"
          href="/saved"
        >
          <Bookmark
            className={`${pathname === '/saved' ? 'text-flickmart' : 'text-flickmart-gray'} h-5 w-5 duration-500 group-hover:text-flickmart`}
          />
          <span
            className={`${pathname === '/saved' ? 'text-flickmart' : ''} duration-500 group-hover:text-flickmart`}
          >
            Saved
          </span>
        </Link>
        <Link
          className="group mx-6 flex flex-col items-center justify-center gap-1.5"
          href={
            userStore === undefined
              ? '#'
              : userStore?.data
                ? '/post-ad'
                : '/create-store'
          }
          onClick={(_e) => {
            if (userStore === undefined) {
              toast('Retrieving your store, please wait...', {
                description: 'This may take a few seconds.',
                duration: 3000,
                position: 'top-center',
                style: { background: '#fff', color: '#000' },
              });
              setIsLoadingAd(true);
            }
          }}
        >
          <div className="-top-10 absolute mx-6 flex flex-col items-center gap-1.5 rounded-full bg-white p-3">
            <div className="flex items-center justify-center rounded-full bg-flickmart p-5 text-white shadow-black/20 shadow-lg">
              <Store className="size-5" />
            </div>
            <span
              className={`${pathname === '/post-ad' ? 'text-flickmart' : ''} duration-500 group-hover:text-flickmart`}
            >
              Sell
            </span>
          </div>
        </Link>
        <Link
          className="group relative flex flex-col items-center justify-center gap-1.5"
          href={'/chat'}
        >
          <div className="relative">
            <MessageSquareText
              className={`${pathname.startsWith('/chat') ? 'text-flickmart' : 'text-flickmart-gray'} h-5 w-5 duration-500 group-hover:text-flickmart`}
            />
            {unreadMessagesCount > 0 && (
              <span className="-top-2 -right-2 absolute flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-white text-xs">
                {unreadMessagesCount > 99 ? '99+' : unreadMessagesCount}
              </span>
            )}
          </div>
          <span
            className={`${pathname.startsWith('/chat') ? 'text-flickmart' : ''} duration-500 group-hover:text-flickmart`}
          >
            Chats
          </span>
        </Link>
        <Link
          className="group flex flex-col items-center justify-center gap-1.5"
          href="/settings/personal"
        >
          <UserRound
            className={`${pathname === '/settings/personal' ? 'text-flickmart' : 'text-flickmart-gray'} h-5 w-5 duration-500 group-hover:text-flickmart`}
          />
          <span
            className={`${pathname === '/settings/personal' ? 'text-flickmart' : ''} duration-500 group-hover:text-flickmart`}
          >
            Profile
          </span>
        </Link>
      </div>
    </nav>
  );
}
