"use client";

import { UserButton, SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import {
  Bell,
  Bookmark,
  ChevronDown,
  CircleUserRound,
  LogOut,
  Menu,
  MessageSquareText,
  Settings,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const cPath = usePathname();

  const toggleProfile = () => {
    setIsOpen((prev) => !prev);
  };

  const toggleNav = () => {
    setIsNavOpen((prev) => !prev);
  };

  const handleLogout = () => {
    location.href = "/sign-in";
  };

  return (
    <header
      className={
        cPath === "/home"
          ? "relative z-30 w-full bg-flickmartLight shadow-sm shadow-black/20"
          : "relative z-30 w-full bg-white shadow-sm shadow-black/20"
      }
    >
      <div className="w-[95%] mx-auto py-2">
        <div className="w-full flex justify-between items-center">
          <Link href={"/"} className="flex gap-1 items-center">
            <Image
              src="/flickmart-logo.svg"
              width={500}
              height={500}
              className="h-12 w-12"
              alt=""
            />
            <h1 className="font-bold text-xl">
              Flick<span className="text-flickmart">Mart</span>
            </h1>
          </Link>

          <div className="hidden lg:flex items-center gap-8">
            <div
              className="relative flex items-center gap-3"
              tabIndex={0} // Makes it focusable
              onBlur={() => setIsOpen(false)}
            >
              <Link href="/chats">  
                <MessageSquareText strokeWidth={1.25} className="h-8 w-8" />
              </Link>
              <Link href="/notifications">
                <Bell strokeWidth={1.25} className="h-8 w-8" />
              </Link>
              <SignedIn>
                <UserButton />
              </SignedIn>
              <SignedOut>
                <SignInButton mode="modal" />
              </SignedOut>
            </div>
            <button className="py-2 px-8 text-sm font-bold rounded-md bg-flickmart text-white">
              SELL
            </button>
          </div>
          <button onClick={toggleNav} className="lg:hidden">
            <Menu className="" strokeWidth={1.25} />
          </button>
        </div>
      </div>
      {isNavOpen && (
        <div className="lg:hidden fixed inset-0 z-30 w-full h-screen bg-white">
          <div className="w-[95%] mx-auto h-full">
            <div className="w-full flex items-center justify-between py-2">
              <div className="flex gap-1 items-center">
                <Image
                  src="/flickmart-logo.svg"
                  width={500}
                  height={500}
                  className="h-12 w-12"
                  alt=""
                />
                <h1 className="font-bold text-xl">
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
                  onClick={handleLogout}
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
