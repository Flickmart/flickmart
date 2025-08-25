'use client';
import { useQuery } from 'convex/react';
import {
  ArrowLeft,
  ChevronLeft,
  Mail,
  MapPin,
  Phone,
  Verified,
  Wallet,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import MobileNav from '@/components/MobileNav';
import { PushNotificationSetup } from '@/components/notifications/PushNotificationSetup';
import { PushNotificationTest } from '@/components/notifications/PushNotificationTest';
import RecentListings from '@/components/settings/RecentListings';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';
import { useAuthUser } from '@/hooks/useAuthUser';

// This would typically come from an API or database

export default function PublicProfile() {
  const { user, isLoading } = useAuthUser();
  // const params = useParams();
  const [userProductsLength, setUserProductsLength] = useState<number>(0);
  const router = useRouter();
  const store = useQuery(api.store.getStoresByUserId);
  const hasStore = store?.error?.status;

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
        <div className="min-h-screen bg-gray-50/50 px-4 pt-7 pb-10 lg:p-8">
          <div className="mx-auto max-w-5xl space-y-5">
            {/* Header */}

            <Card className="p-6">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="h-24 w-24">
                    <AvatarImage alt="Profile picture" src={user?.imageUrl} />
                    <AvatarFallback>
                      {user?.name
                        .split(' ')
                        .map((n: string) => n[0])
                        .join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col gap-2">
                    <h1 className="min-w-10 font-semibold text-2xl">
                      {user?.name}
                    </h1>
                    <p className="text-muted-foreground text-sm">
                      @{user?.username}
                    </p>
                    <div className="flex items-center gap-3 text-amber-400">
                      <span className="ml-1 text-muted-foreground text-sm">
                        {hasStore === 404 ? 'Buyer' : 'Seller'}
                      </span>
                      {user?.verified ? <Verified size={23} /> : null}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Button>
                    <Link
                      className="size-full"
                      href={'/settings/personal/update'}
                    >
                      Edit Profile
                    </Link>
                  </Button>
                  <p className="pt-1.5 text-muted-foreground text-sm">
                    Member since{' '}
                    {user?._creationTime
                      ? new Date(user._creationTime).toLocaleDateString(
                          'en-US',
                          {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          }
                        )
                      : ''}
                  </p>
                </div>
              </div>
              <Separator className="my-4" />
              <div className="flex flex-wrap gap-4 text-sm">
                <div>
                  <span className="font-medium">0</span> items sold
                </div>
                <div>
                  <span className="font-medium">{userProductsLength}</span>{' '}
                  items for sale
                </div>
                <div>Preferred payments: Flickpay</div>
              </div>
            </Card>

            {/* Main Content */}
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Left Column */}
              <div className="space-y-6 lg:col-span-2">
                {/* About Me */}
                <Card className="p-6">
                  <h2 className="font-semibold text-lg">About Me</h2>
                  <Separator className="my-4" />
                  <p className="!leading-normal">
                    {user?.description || (
                      <i className="text-gray-400 text-sm">
                        about not provided
                      </i>
                    )}
                  </p>
                </Card>

                {/* Recent Listings */}
                <RecentListings
                  updateLength={updateUserProductsLength}
                  userId={user?._id as Id<'users'>}
                />
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Contact Information */}
                <Card className="p-6">
                  <h2 className="font-semibold text-lg">Contact Information</h2>
                  <Separator className="my-4" />
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {user?.email || (
                          <i className="text-gray-400 text-sm">
                            email not provided
                          </i>
                        )}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {user?.contact?.phone || (
                          <i className="text-gray-400 text-sm">
                            phone not provided
                          </i>
                        )}
                      </span>
                    </div>
                  </div>
                </Card>

                {/* Location */}
                <Card className="p-6">
                  <h2 className="font-semibold text-lg">Location</h2>
                  <Separator className="my-4" />
                  <div className="flex items-center gap-2 capitalize">
                    <MapPin className="mt-1 h-4 w-4 text-muted-foreground" />
                    <p>
                      {user?.contact?.address || (
                        <i className="text-gray-400 text-sm normal-case">
                          location not provided
                        </i>
                      )}
                    </p>
                  </div>
                </Card>
                <Card className="p-6">
                  <Link
                    className="flex cursor-pointer items-center gap-6 rounded-md px-2 py-2 transition-all duration-300 hover:bg-gray-100"
                    href="/wallet"
                  >
                    <Wallet />
                    <span className="font-semibold text-lg">Wallet</span>
                  </Link>
                </Card>

                {/* Push Notifications */}
                <PushNotificationSetup />

                {/* Test Component (Development Only) */}
                <PushNotificationTest />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
