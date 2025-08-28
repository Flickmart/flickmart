"use client";
import { useQuery } from "convex/react";
import {
  ArrowLeft,
  ChevronLeft,
  Mail,
  MapPin,
  Phone,
  User,
  Verified,
  Wallet,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import MobileNav from "@/components/MobileNav";
import { PushNotificationSetup } from "@/components/notifications/PushNotificationSetup";
import { PushNotificationTest } from "@/components/notifications/PushNotificationTest";
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
        <div className="min-h-screen bg-gray-50/50 px-4 pt-4 pb-10 lg:p-8">
          <div className="mx-auto max-w-5xl">
            {/* Header */}
            <span className="font-semibold text-lg">
              {user?.username || "lotanna567"}
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
              <div>
                <div className="flex items-center gap-1">
                  <h1 className="min-w-10 font-semibold text-base capitalize">
                    {user?.name || "Lotanna Stores"}
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
                <span className="flex items-center gap-2 text-sm">
                  <User className="h-5 w-5" />
                  {hasStore === 404 ? "Buyer" : "Seller"}
                </span>
              </div>
            </div>
            <div className="my-4 flex flex-col gap-2">
              <span className="text-sm">Hey there i use Flickmart!</span>
              <div className="mt-1.5 flex items-center gap-2">
                <Button className="w-5/12">
                  <Link
                    className="size-full"
                    href={"/settings/personal/update"}
                  >
                    Edit Profile
                  </Link>
                </Button>
                <Button className="w-5/12">Share Profile</Button>
                <Button className="w-2/10">
                  <Link className="size-full" href={"/wallet"}>
                    <Wallet />
                  </Link>
                </Button>
              </div>
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
            {/* Push Notifications */}
            <PushNotificationSetup />

            {/* Test Component (Development Only) */}
            <PushNotificationTest />
          </div>
        </div>
      </div>
    </>
  );
}
