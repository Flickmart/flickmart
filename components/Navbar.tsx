"use client";

import { UserButton, SignInButton, useUser } from "@clerk/nextjs";
import {
  Bell,
  ChevronDown,
  Loader2,
  Menu,
  MessageSquareText,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function Navbar() {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const { isSignedIn, isLoaded } = useUser();
  const unreadNotifications =
    useQuery(api.notifications.getUnreadNotifications) || [];

  const userStore = useQuery(api.store.getStoresByUserId);

  const toggleNav = () => {
    setIsNavOpen((prev) => !prev);
  };

  return (
    <header className="fixed z-30 top-0 w-full bg-flickmartLight shadow-sm shadow-black/20">
      <div className="w-[95%] mx-auto py-1">
        <div className="w-full flex justify-between items-center">
          <Link href={"/"} className="flex gap-1 items-center">
            <Image
              src="/flickmart-logo.svg"
              width={500}
              height={500}
              className="h-12 w-12"
              alt=""
            />
            <h1 className="font-bold text-xl mt-2">
              Flick<span className="text-flickmart">Mart</span>
            </h1>
          </Link>

          <div className="hidden lg:flex items-center gap-8">
            <div
              className="relative flex items-center gap-3"
              tabIndex={0} // Makes it focusable
            >
              <Link href="/chats">
                <MessageSquareText
                  size={32}
                  strokeWidth={2.5}
                  absoluteStrokeWidth
                  className="h-8 w-8"
                />
              </Link>
              <Link href="/notifications">
                <div className="relative">
                  {unreadNotifications.length > 0 && (
                    <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {unreadNotifications.length}
                    </div>
                  )}
                  <Bell
                    size={32}
                    strokeWidth={3}
                    absoluteStrokeWidth
                    className="h-8 w-8"
                  />
                </div>
              </Link>
              {isSignedIn && <UserButton />}
              {!isLoaded && <Loader2 className="h-8 w-8 animate-spin" />}
              {isLoaded && !isSignedIn && (
                <Link
                  href="/sign-in"
                  className="text-flickmart font-medium hover:underline"
                >
                  Sign in
                </Link>
              )}
            </div>
            <button className="text-sm font-bold rounded-md bg-flickmart text-white">
              <Link
                className="py-2 px-8 inline-block"
                href={userStore?.[0] ? `/post-ad/${userStore?.[0]._id}` : "/create-store"}
              >
                SELL
              </Link>
            </button>
          </div>
          <button onClick={toggleNav} className="lg:hidden">
            <Menu className="" strokeWidth={1.25} />
          </button>
        </div>
      </div>
      {isNavOpen && (
        <div className="lg:hidden absolute inset-0 z-30 w-full h-screen bg-white">
          <div className="w-[95%] mx-auto h-full">
            <div className="w-full flex items-center justify-between py-1">
              <div className="flex gap-1 items-center">
                <Image
                  src="/flickmart-logo.svg"
                  width={500}
                  height={500}
                  className="h-12 w-12"
                  alt=""
                />
                <h1 className="font-bold text-xl mt-2">
                  Flick<span className="text-flickmart">Mart</span>
                </h1>
              </div>
              <button onClick={toggleNav} className="lg:hidden">
                <X className="" strokeWidth={1.25} />
              </button>
            </div>
            <div className="w-full flex flex-col justify-between h-4/6">
              <div className="w-full flex flex-col font-medium">
                <Link href={"#"} className="border-b border-[#E8ECEF] py-4">
                  Fund Account
                </Link>
                <Link
                  href={"#"}
                  className="border-b border-[#E8ECEF] py-4 flex justify-between items-center"
                >
                  <span>Setting</span>
                  <ChevronDown />
                </Link>
                <Link
                  href={"#"}
                  className="border-b border-[#E8ECEF] py-4 flex justify-between items-center"
                >
                  <span>About Us</span>
                  <ChevronDown />
                </Link>
                <Link href={"#"} className="border-b border-[#E8ECEF] py-4">
                  Contact Us
                </Link>
              </div>
              <div className="text-[#6C7275]">
                <Link
                  href={"#"}
                  className="border-b border-[#E8ECEF] py-4 flex justify-between items-center"
                >
                  <span>Notification</span>
                  <span className="h-6 w-6 flex justify-center items-center bg-black rounded-full px-1.5 py-0.5 text-[10px] text-white">
                    <span className="mt-0.5">2</span>
                  </span>
                </Link>
                <Link
                  href={"#"}
                  className="border-b border-[#E8ECEF] py-4 flex justify-between items-center"
                >
                  <span>Wishlist</span>
                  <span className="h-6 w-6 flex justify-center items-center bg-black rounded-full px-1.5 py-0.5 text-[10px] text-white">
                    <span className="mt-[1px]">2</span>
                  </span>
                </Link>
                <Link
                  href={"#"}
                  className="bg-black text-white rounded-md py-4 flex justify-center items-center mt-2"
                >
                  <span>Logout</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
