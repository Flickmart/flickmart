'use client';
import { useQuery } from 'convex/react';
import { motion } from 'motion/react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { SyncLoader } from 'react-spinners';
import BookedMarkedItem from '@/components/BookMarkedItem';
import Empty from '@/components/saved/Empty';
import { api } from 'backend/convex/_generated/api';

export default function SavedPage() {
  const [selectedTab, setSelectedTab] = useState(false);
  const searchParams = useSearchParams();
  const query = searchParams.get('wishlist');

  const saved = useQuery(api.product.getAllSavedOrWishlist, {
    type: 'saved',
  });
  const wishlist = useQuery(api.product.getAllSavedOrWishlist, {
    type: 'wishlist',
  });

  const savedLength = saved?.data?.length;
  const wishlistLength = wishlist?.data?.length;

  useEffect(() => {
    if (query === 'true') {
      setSelectedTab(true);
    }
  }, [searchParams]);

  const toggleAd = () => {
    setSelectedTab(false);
  };

  const toggleWl = () => {
    setSelectedTab(true);
  };

  return (
    <main className="flex h-[90vh] w-full flex-col bg-gray-100 pb-12">
      <div className="flex w-full shadow-lg">
        <button
          className={
            selectedTab
              ? 'w-full py-5 text-center font-bold text-flickmart-gray'
              : 'w-full py-5 text-center font-bold text-flickmart'
          }
          onClick={toggleAd}
        >
          Saved ({savedLength || 0})
        </button>
        <button
          className={
            selectedTab
              ? 'w-full py-5 text-center font-bold text-flickmart'
              : 'w-full py-5 text-center font-bold text-flickmart-gray'
          }
          onClick={toggleWl}
        >
          Wishlist ({wishlistLength || 0})
        </button>
      </div>
      {saved === undefined || wishlist === undefined ? (
        <div className="flex w-full flex-grow items-center justify-center">
          <SyncLoader color="#f97316" />
        </div>
      ) : selectedTab ? (
        <motion.div
          animate={{ opacity: 1, x: 0 }}
          className="mx-auto mt-3 flex w-[95%] flex-col gap-3 pb-5"
          initial={{ opacity: 0, x: 50 }}
          transition={{ duration: 0.5, type: 'tween', ease: 'easeInOut' }}
        >
          {wishlistLength === 0 ? (
            <Empty message="Your wishlist is empty" />
          ) : (
            wishlist?.data
              ?.slice()
              .reverse()
              .map((item) => {
                return (
                  <Link href={`/product/${item?._id}`} key={item?._id}>
                    <BookedMarkedItem product={item!} type="wishlist" />
                  </Link>
                );
              })
          )}
        </motion.div>
      ) : (
        <motion.div
          animate={{ opacity: 1, x: 0 }}
          className="mx-auto mt-3 flex w-[95%] flex-col gap-3 pb-10"
          initial={{ opacity: 0, x: 50 }}
          transition={{ duration: 0.5, type: 'tween', ease: 'easeInOut' }}
        >
          {savedLength === 0 ? (
            <Empty message="You have no saved items" />
          ) : (
            saved?.data
              ?.slice()
              .reverse()
              .map((item) => {
                return (
                  <Link href={`/product/${item?._id}`} key={item?._id}>
                    <BookedMarkedItem product={item!} type="saved" />
                  </Link>
                );
              })
          )}
        </motion.div>
      )}
    </main>
  );
}
