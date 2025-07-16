"use client";

import {
  UserButton,
  SignInButton,
  useUser,
  SignOutButton,
  SignedIn,
  SignedOut,
} from "@clerk/nextjs";
import { Bell, Loader2, Menu, MessageSquareText } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "./ui/button";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function Navbar({ children }: { children?: React.ReactNode }) {
  const { isSignedIn, isLoaded } = useUser();
  const [open, setOpen] = useState(false);
  const unreadNotifications =
    useQuery(api.notifications.getUnreadNotifications) || [];
  const wishlistLength =
    useQuery(api.product.getAllSavedOrWishlist, {
      type: "wishlist",
    })?.data?.length || 0;

  const userStore = useQuery(api.store.getStoresByUserId);

  const pathname = usePathname();

  return (
    <header
      className={cn(
        "sticky z-30 top-0 w-full shadow-sm shadow-black/20",
        { "lg:py-2": pathname !== "/" },
        {
          "bg-white hidden sm:block": pathname !== "/",
          "bg-flickmartLight": pathname === "/",
        }
      )}
    >
      <div className="w-[95%] mx-auto py-1">
        <div className="w-full flex justify-between items-center">
          <Link href={"/"} className="flex gap-1   items-center">
            <Image
              src="/flickmart-logo.svg"
              width={500}
              height={500}
              className="h-12 w-12"
              alt=""
            />
            <h1 className="font-bold text-xl pt-1">
              Flick<span className="text-flickmart">Mart</span>
            </h1>
          </Link>
          {children}
          <div className="hidden lg:flex items-center gap-8">
            <div
              className="relative flex items-center gap-3"
              tabIndex={0} // Makes it focusable
            >
              <Link
                href="/chats"
                className={cn({
                  "bg-white rounded-full shadow-[0_5px_5px_#00000050] p-[10px]":
                    pathname !== "/",
                })}
              >
                <MessageSquareText
                  className={cn({
                    "size-[30px] stroke-[1.5]": pathname === "/",
                    "size-[25px] stroke-[1.5]": pathname !== "/",
                  })}
                />
              </Link>
              <Link
                href="/notifications"
                className={cn({
                  "bg-white rounded-full shadow-[0_5px_5px_#00000050] p-[10px]":
                    pathname !== "/",
                })}
              >
                <div className="relative">
                  {unreadNotifications.length > 0 && (
                    <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {unreadNotifications.length}
                    </div>
                  )}
                  <Bell
                    className={cn({
                      "size-[30px] stroke-[1.5]": pathname === "/",
                      "size-[25px] stroke-[1.5]": pathname !== "/",
                    })}
                  />
                </div>
              </Link>
              {isSignedIn && (
                <div
                  className={cn({
                    "bg-white rounded-full shadow-[0_5px_5px_#00000050] size-[45px] p-[10px] flex items-center justify-center":
                      pathname !== "/",
                  })}
                >
                  <UserButton />
                </div>
              )}
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
                href={userStore?.data ? "/post-ad" : "/create-store"}
              >
                SELL
              </Link>
            </button>
          </div>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <div className="relative  lg:hidden ">
                {unreadNotifications.length > 0 && (
                  <div className="absolute -top-0 -right-0 bg-red-500 text-white text-xs rounded-full w-3 h-3 flex items-center justify-center" />
                )}
                <Menu
                  size={32}
                  strokeWidth={2}
                  absoluteStrokeWidth
                  className="h-8 w-8"
                />
              </div>
            </SheetTrigger>
            <SheetContent side="top" className="p-0">
              <div className=" inset-0 z-30 w-full h-screen bg-white">
                <div className="w-[95%] mx-auto h-full">
                  <SheetHeader>
                    <div className="w-full flex items-center justify-between py-1">
                      <div className="flex gap-1 items-center">
                        <Image
                          src="/flickmart-logo.svg"
                          width={500}
                          height={500}
                          className="h-12 w-12"
                          alt=""
                        />
                        <SheetTitle className="font-bold text-xl pt-1">
                          Flick<span className="text-flickmart">Mart</span>
                        </SheetTitle>
                      </div>
                    </div>
                  </SheetHeader>
                  <div className="w-full flex flex-col justify-between h-4/6">
                    <div className="w-full flex flex-col font-medium">
                      <Link
                        onClick={() => setOpen(false)}
                        href={"/wallet"}
                        className="border-b border-[#E8ECEF] py-4"
                      >
                        Wallet
                      </Link>
                      <Link
                        onClick={() => setOpen(false)}
                        href="/settings"
                        className="border-b border-[#E8ECEF] py-4 "
                      >
                        <span>Settings</span>
                      </Link>
                      <Link
                        onClick={() => setOpen(false)}
                        href={"#"}
                        className="border-b border-[#E8ECEF] py-4 "
                      >
                        <span>About Us</span>
                      </Link>
                      <Link
                        onClick={() => setOpen(false)}
                        href={"/contact"}
                        className="border-b border-[#E8ECEF] py-4"
                      >
                        Contact Us
                      </Link>
                    </div>
                    <div className="text-[#6C7275]">
                      <Link
                        onClick={() => setOpen(false)}
                        href="/notifications"
                        className="border-b border-[#E8ECEF] py-4 flex justify-between items-center"
                      >
                        <span>Notification</span>
                        <span className="h-6 w-6 flex justify-center items-center bg-black rounded-full px-1.5 py-0.5 text-[10px] text-white">
                          <span className="mt-0.5">
                            {unreadNotifications.length}
                          </span>
                        </span>
                      </Link>
                      <Link
                        onClick={() => setOpen(false)}
                        href="/saved?wishlist=true"
                        className="border-b border-[#E8ECEF] py-4 flex justify-between items-center"
                      >
                        <span>Wishlist</span>
                        <span className="h-6 w-6 flex justify-center items-center bg-black rounded-full px-1.5 py-0.5 text-[10px] text-white">
                          <span className="mt-[1px]">{wishlistLength}</span>
                        </span>
                      </Link>
                      <div className="pt-5">
                        <SignedIn>
                          <SignOutButton
                            signOutOptions={{ redirectUrl: "/sign-in" }}
                          >
                            <button
                              onClick={() => setOpen(false)}
                              className="bg-black hover:scale-105 h-12 transition-all duration-300 text-white rounded-md py-3 w-full mt-2"
                            >
                              Logout
                            </button>
                          </SignOutButton>
                        </SignedIn>
                        <SignedOut>
                          <Link href="/sign-in">
                            <button className="bg-black hover:scale-105 h-12 transition-all duration-300 text-white rounded-md py-3 w-full mt-2">
                              Sign in
                            </button>
                          </Link>
                        </SignedOut>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
