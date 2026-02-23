'use client';
import { useMutation, useQuery } from 'convex/react';
import {
  ChevronLeft,
  ChevronRight,
  Mail,
  MapPin,
  Phone,
  Sparkles,
  User,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import MobileNav from '@/components/MobileNav';
import { PushNotificationSetup } from '@/components/notifications/PushNotificationSetup';

import MiniListings from '@/components/settings/MiniListings';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { api } from 'backend/convex/_generated/api';
import type { Id } from 'backend/convex/_generated/dataModel';
import { useAuthUser } from '@/hooks/useAuthUser';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';

// This would typically come from an API or database

export default function PublicProfile() {
  const { user, isLoading } = useAuthUser();
  const [_userProductsLength, setUserProductsLength] = useState<number>(0);
  const router = useRouter();
  const store = useQuery(api.store.getStoresByUserId);
  const hasStore = store?.error?.status;
  const wallet = useQuery(api.wallet.getCurrentWallet);
  const productsByUser = useQuery(api.product.getByUserId, {
    userId: user?._id,
  });
  const updateUser = useMutation(api.users.updateUser)

  // Get Wallet Balance
  if (isLoading) {
    return (
      <div className="grid h-screen place-items-center">
        <div className="h-32 w-32 animate-spin rounded-full border-flickmart border-b-2" />
      </div>
    );
  }

  function updateUserProductsLength(length: number) {
    setUserProductsLength(length);
  }
  return (
    <>
      <MobileNav />
      <div className="w-full">
        <div className="flex items-center gap-2 px-4 text-gray-600 shadow-md">
          <ChevronLeft
            className="size-7 cursor-pointer rounded-full transition-all duration-300 hover:bg-gray-200"
            onClick={() => router.back()}
          />
          <Breadcrumb className="bg-white py-7 pl-2">
            <BreadcrumbList>
              <BreadcrumbItem>
                <Link href="/settings">Settings</Link>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Personal</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="min-h-screen bg-gray-50/50 px-4 pt-4 pb-10 lg:p-8">
          <div className="mx-auto max-w-5xl">
            {/* Header */}
            <span className="font-semibold text-lg">
              {user?.username || '--'}
            </span>
            <div className="my-3 flex items-center gap-2">
              <div>
                <Avatar className="h-24 w-24">
                  <AvatarImage alt="Profile picture" src={user?.imageUrl} />
                  <AvatarFallback>
                    {user?.name
                      .split(' ')
                      .map((n: string) => n[0])
                      .join('')}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1">
                  <h1 className="min-w-10 font-semibold text-base capitalize">
                    {user?.name || '--'}
                  </h1>
                  {user?.verified ? (
                    <Image
                      alt="verified"
                      className=""
                      height={16}
                      src="/Vector.png"
                      width={16}
                    />
                  ) : null}
                </div>
                <span className="flex items-center gap-1 py-0.5 text-sm">
                  <User className="h-5 w-5" />
                  {hasStore === 404 ? 'Buyer' : 'Seller'}
                </span>
                <div className="flex gap-2 text-sm">
                  <span>Items for sale {productsByUser?.length}</span>
                  <span>Items sold 0</span>
                </div>
              </div>
            </div>
            <div className="my-4 flex flex-col gap-2">
              <span className="text-sm">{user?.description}</span>
              <div className="mt-1.5 flex items-center gap-2">
                <Button className="w-2/4">
                  <Link
                    className="size-full"
                    href={'/settings/personal/update'}
                  >
                    Edit Profile
                  </Link>
                </Button>
                <Button
                  className="w-2/4"
                  onClick={() => {
                    navigator
                      .share({
                        title: 'Check out my profile!',
                        text: 'Discover my profile on Flickmart\n',
                        url: `https://flickmart.app/business/${user?._id}`,
                        // url: `http://localhost:3001/business/${user?._id}`,
                      })
                      .then(() => {
                        console.log('Shared successfully');
                      })
                      .catch((error) => {
                        console.error('Error sharing:', error);
                      });
                  }}
                >
                  Share Profile
                </Button>
                {/* <Button className="w-2/10">
                  <Link className="size-full" href={"/wallet"}>
                    <Wallet />
                  </Link>
                </Button> */}
              </div>

              {/* Remove demo wallet */}
              <Link className="min-h-full" href={'/wallet'}>
                <div className="flex flex-col gap-2 rounded-lg bg-primary px-4 py-4 pt-2 text-white">
                  <div className="flex items-center justify-between font-medium text-xs">
                    <span>Available Balance</span>
                    <Link
                      className="flex items-center py-2"
                      href={'/wallet?action=show_history'}
                    >
                      <span>Transaction History</span>
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <h1 className="font-bold text-xl">
                        ₦{' '}
                        {wallet && 'balance' in wallet
                          ? (wallet.balance / 100).toFixed(2)
                          : '0.00'}
                      </h1>
                      <ChevronRight className="h-4 w-4" />
                    </div>
                    <Link
                      className="rounded-full bg-white px-2 py-1.5 font-semibold text-[10px] text-primary"
                      href={'/wallet?action=open_dialog'}
                    >
                      + Add Money
                    </Link>
                  </div>
                </div>
              </Link>
              <p className="pt-1.5 text-muted-foreground text-sm">
                Member since{' '}
                {user?._creationTime
                  ? new Date(user._creationTime).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })
                  : ''}
              </p>
            </div>
            <div>
              <MiniListings
                updateLength={updateUserProductsLength}
                userId={user?._id as Id<'users'>}
              />
            </div>
            <div className="mt-6 mb-12">
              <div className="flex flex-col gap-2">
                <h1 className="font-semibold text-lg/5">Contact Information</h1>
                <p className="text-muted-foreground text-xs">
                  Your contact details right here for your easy access.
                </p>
              </div>
              <div className="mt-4 rounded-lg border">
                <div className="border-b px-3 py-3">
                  <h2 className="font-medium text-sm">Phone</h2>
                  <div className="flex items-center gap-1">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {user?.contact?.phone || (
                        <i className="text-gray-400 text-sm">--</i>
                      )}
                    </span>
                  </div>
                </div>
                <div className="border-b px-3 py-3">
                  <h2 className="font-medium text-sm">E-mail</h2>
                  <div className="flex items-center gap-1">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {user?.email || (
                        <i className="text-gray-400 text-sm">--</i>
                      )}
                    </span>
                  </div>
                </div>
                <div className="px-3 py-3">
                  <h2 className="font-medium text-sm">Location</h2>
                  <div className="flex items-center gap-1">
                    <MapPin className="mt-1 h-4 w-4 text-muted-foreground" />
                    <p>
                      {user?.contact?.address || (
                        <i className="text-gray-400 text-sm normal-case">--</i>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className='flex flex-col gap-10'>
              {/* Enable NKEM AI */}
             {hasStore !== 404 && <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-purple-600 text-lg gap-2">
                    <Sparkles className="size-6" />
                    NKEM AI Sales Assistant
                  </CardTitle>
                  <CardDescription>
                    Automatically respond to customers and capture leads while you're offline.
                  </CardDescription>
                </CardHeader>
                <CardContent className='flex items-center gap-7'>
                  <span className='text-sm leading-relaxed text-muted-foreground'>
                    NKEM engages customers in real-time, answers product questions, recommends items, and collects qualified leads when you're unavailable.
                  </span>
                  <Switch 
                    className='data-[state=checked]:bg-purple-600'
                    checked={user?.aiEnabled}
                    onCheckedChange={async(checked) =>{
                      await updateUser({
                        aiEnabled: checked
                      })
                    }}
                  />
                </CardContent>
              </Card>
              }
              {/* Push Notifications */}
              <PushNotificationSetup />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
