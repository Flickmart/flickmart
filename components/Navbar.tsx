'use client';

import { SignedIn, SignedOut, SignOutButton, useUser } from '@clerk/nextjs';
import { useQuery } from 'convex/react';
import {
  Bell,
  Heart,
  Loader2,
  LogOut,
  Menu,
  MessageSquareText,
  Settings,
  ShoppingBag,
  Store,
  User,
  Wallet,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type React from 'react';
import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { api } from '@/convex/_generated/api';
import { cn } from '@/lib/utils';
import Logo from './multipage/Logo';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';

export default function Navbar({ children }: { children?: React.ReactNode }) {
  const { isSignedIn, isLoaded, user } = useUser();
  const [open, setOpen] = useState(false);
  const unreadNotifications =
    useQuery(api.notifications.getUnreadNotifications) || [];
  const wishlistLength =
    useQuery(api.product.getAllSavedOrWishlist, {
      type: 'wishlist',
    })?.data?.length || 0;

  const userStore = useQuery(api.store.getStoresByUserId);

  const pathname = usePathname();

  return (
    <header
      className={cn(
        'sticky top-0 z-30 w-full shadow-black/20 shadow-sm',
        { 'lg:py-2': pathname !== '/' },
        {
          'hidden bg-white sm:block': pathname !== '/',
          'bg-flickmartLight': pathname === '/',
        }
      )}
    >
      <div className="mx-auto w-[95%] py-1">
        <div className="flex w-full items-center justify-between">
          <Link className="flex items-center gap-1" href={'/'}>
            <Logo />
          </Link>
          {children}
          <div className="hidden items-center gap-5 lg:flex">
            <div className="relative flex items-center gap-3">
              <Link
                className={cn({
                  'rounded-full bg-white p-[10px] shadow-[0_5px_5px_#00000050]':
                    pathname !== '/',
                })}
                href="/chat"
              >
                <MessageSquareText
                  className={cn({
                    'size-[30px] stroke-[1.5]': pathname === '/',
                    'size-[25px] stroke-[1.5]': pathname !== '/',
                  })}
                />
              </Link>
              <Link
                className={cn({
                  'rounded-full bg-white p-[10px] shadow-[0_5px_5px_#00000050]':
                    pathname !== '/',
                })}
                href="/notifications"
              >
                <div className="relative">
                  {unreadNotifications.length > 0 && (
                    <div className="-top-1 -right-1 absolute flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white text-xs">
                      {unreadNotifications.length}
                    </div>
                  )}
                  <Bell
                    className={cn({
                      'size-[30px] stroke-[1.5]': pathname === '/',
                      'size-[25px] stroke-[1.5]': pathname !== '/',
                    })}
                  />
                </div>
              </Link>
              {isSignedIn && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Avatar className="size-10 cursor-pointer">
                      <AvatarImage
                        alt={`${user.firstName} ${user.lastName}`}
                        src={user.imageUrl}
                      />
                      <AvatarFallback>
                        <User className="size-[25px] stroke-[1.5]" />
                      </AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="font-medium text-sm leading-none">
                          {user?.firstName} {user?.lastName}
                        </p>
                        <p className="text-muted-foreground text-xs leading-none">
                          {user?.emailAddresses[0]?.emailAddress}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link className="flex items-center" href="/wallet">
                        <Wallet className="mr-2 size-4" />
                        Wallet
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link className="flex items-center" href="/settings">
                        <Settings className="mr-2 size-4" />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        className="flex items-center"
                        href="/saved?wishlist=true"
                      >
                        <Heart className="mr-2 size-4" />
                        Wishlist
                        {wishlistLength > 0 && (
                          <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white text-xs">
                            {wishlistLength}
                          </span>
                        )}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link className="flex items-center" href="/orders">
                        <ShoppingBag className="mr-2 size-4" />
                        Orders
                      </Link>
                    </DropdownMenuItem>
                    {userStore?.data && (
                      <DropdownMenuItem asChild>
                        <Link className="flex items-center" href="/post-ad">
                          <Store className="mr-2 size-4" />
                          Post Ad
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild className="w-full">
                      <SignOutButton
                        signOutOptions={{ redirectUrl: '/sign-in' }}
                      >
                        <Button variant="ghost">
                          <LogOut className="size-4" />
                          Sign out
                        </Button>
                      </SignOutButton>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
              {!isLoaded && <Loader2 className="h-8 w-8 animate-spin" />}
              {isLoaded && !isSignedIn && (
                <button
                  className="rounded-full bg-black px-5 py-[7px] text-white hover:text-flickmart"
                  type="button"
                >
                  <Link className="font-semibold text-sm" href="/sign-in">
                    Sign in
                  </Link>
                </button>
              )}
            </div>
            <button className="rounded-md bg-flickmart font-bold text-sm text-white">
              <Link
                className="inline-block px-8 py-2"
                href={userStore?.data ? '/post-ad' : '/create-store'}
              >
                SELL
              </Link>
            </button>
          </div>
          {/* If user is signed in, display the menu button. Else, display the sign in button */}
          {isLoaded ? (
            isSignedIn ? (
              <Sheet onOpenChange={setOpen} open={open}>
                <SheetTrigger asChild className="cursor-pointer">
                  <div className="relative lg:hidden">
                    {unreadNotifications.length > 0 && (
                      <div className="-top-0 -right-0 absolute flex h-3 w-3 items-center justify-center rounded-full bg-red-500 text-white text-xs" />
                    )}
                    <Menu
                      absoluteStrokeWidth
                      className="h-8 w-8"
                      size={32}
                      strokeWidth={2}
                    />
                  </div>
                </SheetTrigger>
                <SheetContent className="p-0" side="top">
                  <div className="inset-0 z-30 h-screen w-full bg-white">
                    <div className="mx-auto h-full w-[95%]">
                      <SheetHeader>
                        <div className="flex w-full items-center justify-between py-1">
                          <div className="flex items-center gap-1">
                            <Image
                              alt=""
                              className="h-12 w-12"
                              height={500}
                              src="/flickmart-logo.svg"
                              width={500}
                            />
                            <SheetTitle className="pt-1 font-bold text-xl">
                              Flick<span className="text-flickmart">Mart</span>
                            </SheetTitle>
                          </div>
                        </div>
                      </SheetHeader>
                      <div className="flex h-4/6 w-full flex-col justify-between">
                        <div className="flex w-full flex-col font-medium">
                          <Link
                            className="border-[#E8ECEF] border-b py-4"
                            href={'/wallet'}
                            onClick={() => setOpen(false)}
                          >
                            Wallet
                          </Link>
                          <Link
                            className="border-[#E8ECEF] border-b py-4"
                            href="/settings"
                            onClick={() => setOpen(false)}
                          >
                            <span>Settings</span>
                          </Link>
                          <Link
                            className="border-[#E8ECEF] border-b py-4"
                            href={'#'}
                            onClick={() => setOpen(false)}
                          >
                            <span>About Us</span>
                          </Link>
                          <Link
                            className="border-[#E8ECEF] border-b py-4"
                            href={'/contact'}
                            onClick={() => setOpen(false)}
                          >
                            Contact Us
                          </Link>
                        </div>
                        <div className="text-[#6C7275]">
                          <Link
                            className="flex items-center justify-between border-[#E8ECEF] border-b py-4"
                            href="/notifications"
                            onClick={() => setOpen(false)}
                          >
                            <span>Notification</span>
                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-black px-1.5 py-0.5 text-[10px] text-white">
                              <span className="mt-0.5">
                                {unreadNotifications.length}
                              </span>
                            </span>
                          </Link>
                          <Link
                            className="flex items-center justify-between border-[#E8ECEF] border-b py-4"
                            href="/saved?wishlist=true"
                            onClick={() => setOpen(false)}
                          >
                            <span>Wishlist</span>
                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-black px-1.5 py-0.5 text-[10px] text-white">
                              <span className="mt-[1px]">{wishlistLength}</span>
                            </span>
                          </Link>
                          <div className="pt-5">
                            <SignedIn>
                              <SignOutButton
                                signOutOptions={{ redirectUrl: '/sign-in' }}
                              >
                                <button
                                  className="mt-2 h-12 w-full rounded-md bg-black py-3 text-white transition-all duration-300 hover:scale-105"
                                  onClick={() => setOpen(false)}
                                >
                                  Logout
                                </button>
                              </SignOutButton>
                            </SignedIn>
                            <SignedOut>
                              <Link href="/sign-in">
                                <button className="mt-2 h-12 w-full rounded-md bg-black py-3 text-white transition-all duration-300 hover:scale-105">
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
            ) : (
              <button
                className="rounded-full bg-black px-5 py-2 text-white hover:text-flickmart lg:hidden"
                type="button"
              >
                <Link className="font-semibold text-sm" href="/sign-in">
                  Sign in
                </Link>
              </button>
            )
          ) : (
            <Loader2 className="h-8 w-8 animate-spin lg:hidden" />
          )}
        </div>
      </div>
    </header>
  );
}
