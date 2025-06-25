"use client";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import Link from "next/link";
import { useState } from "react";
import BookedMarkedItem from "@/components/BookMarkedItem";
import { SyncLoader } from "react-spinners";
import Empty from "@/components/saved/Empty";
import { motion } from "motion/react";

function useBookmarks() {
  try {
    const saved = useQuery(api.product.getAllSavedOrWishlist, {
      type: "saved",
    });
    const wishlist = useQuery(api.product.getAllSavedOrWishlist, {
      type: "wishlist",
    });
    return { saved, wishlist };
  } catch (err) {
    console.log(err);
  }
}

export default function SavedPage() {
  const [selectedTab, setSelectedTab] = useState(false);
  const bookmarks = useBookmarks();
  const saved = bookmarks?.saved;
  const wishlist = bookmarks?.wishlist;

  const toggleAd = () => {
    setSelectedTab(false);
  };

  const toggleWl = () => {
    setSelectedTab(true);
  };
  return (
    <main className="w-full flex flex-col h-[90vh] bg-gray-100 pb-12">
      <div className="w-full flex shadow-lg ">
        <button
          onClick={toggleAd}
          className={
            selectedTab
              ? `w-full py-5 text-center text-flickmart-gray font-bold`
              : `w-full py-5 text-center text-flickmart font-bold`
          }
        >
          Saved ({saved?.length || 0})
        </button>
        <button
          onClick={toggleWl}
          className={
            selectedTab
              ? `w-full py-5 text-center text-flickmart font-bold`
              : `w-full py-5 text-center text-flickmart-gray font-bold`
          }
        >
          Wishlist ({wishlist?.length || 0})
        </button>
      </div>
      {saved === undefined || wishlist === undefined ? (
        <div className="w-full flex justify-center items-center flex-grow">
          <SyncLoader color="#f97316" />
        </div>
      ) : (
        <>
          {!selectedTab ? (
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, type: "tween", ease: "easeInOut" }}
              className="w-[95%] mx-auto pb-10 flex flex-col gap-3 mt-3"
            >
              {saved?.length === 0 ? (
                <Empty message="You have no saved items" />
              ) : (
                saved
                  ?.slice()
                  .reverse()
                  .map((item) => {
                    return (
                      <Link key={item?._id} href={`/product/${item?._id}`}>
                        <BookedMarkedItem type="saved" product={item!} />
                      </Link>
                    );
                  })
              )}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, type: "tween", ease: "easeInOut" }}
              className=" w-[95%] pb-5 mx-auto flex flex-col gap-3 mt-3"
            >
              {wishlist?.length === 0 ? (
                <Empty message="Your wishlist is empty" />
              ) : (
                wishlist
                  ?.slice()
                  .reverse()
                  .map((item) => {
                    return (
                      <Link key={item?._id} href={`/product/${item?._id}`}>
                        <BookedMarkedItem type="wishlist" product={item!} />
                      </Link>
                    );
                  })
              )}
            </motion.div>
          )}
        </>
      )}
    </main>
  );
}
