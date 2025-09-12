"use client";
import { useQuery } from "convex/react";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Mail,
  MapPin,
  Phone,
  User,
  Verified,
  Wallet,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter} from "next/navigation";
import { useState } from "react";
import MobileNav from "@/components/MobileNav";
import { PushNotificationSetup } from "@/components/notifications/PushNotificationSetup";

import MiniListings from "@/components/settings/MiniListings";
import RecentListings from "@/components/settings/RecentListings";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { useAuthUser } from "@/hooks/useAuthUser";

// This would typically come from an API or database

export default function PublicProfile() {
  // const {  isLoading } = useAuthUser();
  const { userId } = useParams()
  const user = useQuery(api.users.current, {userId: userId? userId as Id<"users"> : undefined});
  const [userProductsLength, setUserProductsLength] = useState<number>(0);
  const router = useRouter();
  const store = useQuery(api.store.getExternalUserStore, {userId: userId? userId as Id<"users"> : undefined});
  const hasStore = store && "error" in store && store?.error?.status;
  const productsByUser = useQuery(api.product.getByUserId, {userId: user?._id})




  // Get Wallet Balance
  // if (isLoading) {
  //   return (
  //     <div className="grid h-screen place-items-center">
  //       <div className="h-32 w-32 animate-spin rounded-full border-flickmart border-b-2" />
  //     </div>
  //   );
  // }

  function updateUserProductsLength(length: number) {
    setUserProductsLength(length);
  }
  return (
    <>
      <MobileNav />
      <div className="w-full">
        <div className="min-h-screen bg-gray-50/50 px-4 pt-4 pb-10 lg:p-8">
          <div className="mx-auto max-w-5xl">
            {/* Header */}
            <span className="font-semibold text-lg">
              {user?.username || "--"}
            </span>
            <div className="my-3 flex items-center gap-2">
              <div>
                <Avatar className="h-24 w-24">
                  <AvatarImage alt="Profile picture" src={user?.imageUrl} />
                  <AvatarFallback>
                    {user?.name
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1">
                  <h1 className="min-w-10 font-semibold text-base capitalize">
                    {user?.name || "--"}
                  </h1>
                  {user?.verified ? (
                    <Image
                      alt="verified"
                      className=""
                      height={16}
                      src="/vector.png"
                      width={16}
                    />
                  ) : null}
                </div>
                <span className="flex items-center gap-1 text-sm py-0.5">
                  <User className="h-5 w-5" />
                  {hasStore === 404 ? "Buyer" : "Seller"}
                </span>
                <div className="text-sm flex gap-2">
                  <span>Items for sale{' '}{productsByUser?.length}</span>
                  <span>Items sold{' '}0</span>
                </div>
              </div>
            </div>
            <div className="my-4 flex flex-col gap-2">
              <span className="text-sm">{user?.description}</span>
              <p className="pt-1.5 text-muted-foreground text-sm">
                Member since{" "}
                {user?._creationTime
                  ? new Date(user._creationTime).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : ""}
              </p>
            </div>
            <div>
              <MiniListings
                updateLength={updateUserProductsLength}
                userId={user?._id as Id<"users">}
              />
            </div>
            <div className="mt-6 mb-12">
              <div className="flex flex-col gap-2">
                <h1 className="font-semibold text-lg/5">Contact Information</h1>
                <p className="text-xs text-muted-foreground">
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
                        <i className="text-gray-400 text-sm">
                          phone not provided
                        </i>
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
                        <i className="text-gray-400 text-sm">
                          email not provided
                        </i>
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
                        <i className="text-gray-400 text-sm normal-case">
                          location not provided
                        </i>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
