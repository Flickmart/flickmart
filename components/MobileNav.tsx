"use client";
import useNav from "@/hooks/useNav";
import {
  Bookmark,
  House,
  MessageSquareText,
  Store,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { FadeLoader } from "react-spinners";

export default function MobileNav() {
  const pathname = usePathname();
  const isVisible = useNav();
  const router = useRouter();
  const [isLoadingAd, setIsLoadingAd] = useState(false);

  // Fetch unread notifications count
  const unreadNotifications =
    useQuery(api.notifications.getUnreadNotifications) || [];
  const unreadCount = unreadNotifications.filter(
    (notification) => notification.type === "new_message"
  ).length;

  // Pages where SearchBox should not be shown
  const hiddenPages = ["/sign-in", "/sign-up", "/forgot-password", "/chats", "/notifications", ];
  const userStore = useQuery(api.store.getStoresByUserId);
  const firstUserStore = userStore?.data;

  if (hiddenPages.includes(pathname)) {
    return null; // Don't render any component
  }
  useEffect(() => {
    router.prefetch("/post-ad");
    if (firstUserStore && isLoadingAd) {
      setIsLoadingAd(false);
      router.push("/post-ad");
    }
  }, [pathname, firstUserStore]);

  return (
    <header
      className={`${isVisible ? "translate-y-0" : "translate-y-[160%]"} transition duration-300 z-40 bg-white lg:hidden w-full fixed bottom-0 text-[12px]`}
    >
      <div className="relative w-[94%] mx-auto flex justify-between py-3">
        <Link
          href="/"
          className="flex flex-col items-center justify-center gap-1.5 group"
        >
          <House
            className={`${pathname === "/" ? "text-flickmart" : "text-flickmart-gray"} group-hover:text-flickmart duration-500 h-5 w-5`}
          />
          <span
            className={`${pathname === "/" ? "text-flickmart" : ""} group-hover:text-flickmart duration-500`}
          >
            Home
          </span>
        </Link>
        <Link
          href="/saved"
          className="flex flex-col items-center justify-center gap-1.5 group"
        >
          <Bookmark
            className={`${pathname === "/saved" ? "text-flickmart" : "text-flickmart-gray"} group-hover:text-flickmart duration-500 h-5 w-5`}
          />
          <span
            className={`${pathname === "/saved" ? "text-flickmart" : ""} group-hover:text-flickmart duration-500`}
          >
            Saved
          </span>
        </Link>
        <Link
          onClick={(e) => {
            if (userStore === undefined) {
              toast("Retrieving your store, please wait...", {
                description: "This may take a few seconds.",
                duration: 3000,
                position: "top-center",
                style: { background: "#fff", color: "#000" },
              });
              setIsLoadingAd(true);
            }
          }}
          href={
            userStore === undefined
              ? "#"
              : userStore?.data
                ? "/post-ad"
                : "/create-store"
          }
          className="mx-6 flex flex-col items-center justify-center gap-1.5 group"
        >
          <div className=" mx-6 absolute -top-10 flex flex-col gap-1.5 items-center bg-white rounded-full p-3">
            <div className="bg-flickmart p-5 rounded-full flex justify-center items-center text-white shadow-lg shadow-black/20">
              <Store className=" h-5 w-5" />
            </div>
            <span className="group-hover:text-flickmart duration-500">
              Sell
            </span>
          </div>
        </Link>
        <Link
          href={"/chats"}
          className="flex flex-col items-center justify-center gap-1.5 group relative"
        >
          <div className="relative">
            <MessageSquareText
              className={`${pathname === "/chats" ? "text-flickmart" : "text-flickmart-gray"} group-hover:text-flickmart duration-500 h-5 w-5`}
            />
            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full min-w-4 h-4 flex items-center justify-center px-1">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </div>
          <span
            className={`${pathname === "/chats" ? "text-flickmart" : ""} group-hover:text-flickmart duration-500`}
          >
            Chats
          </span>
        </Link>
        <Link
          href="settings/personal"
          className="flex flex-col items-center justify-center gap-1.5 group"
        >
          <UserRound
            className={`${pathname === "/profile" ? "text-flickmart" : "text-flickmart-gray"} group-hover:text-flickmart duration-500 h-5 w-5`}
          />
          <span
            className={`${pathname === "/profile" ? "text-flickmart" : ""} group-hover:text-flickmart duration-500`}
          >
            Profile
          </span>
        </Link>
      </div>
    </header>
  );
}
