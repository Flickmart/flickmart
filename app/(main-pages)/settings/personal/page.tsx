"use client";
import {
  Mail,
  MapPin,
  Star,
  Facebook,
  Instagram,
  Twitter,
  ArrowLeft,
  Phone,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams, useRouter } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";

// This would typically come from an API or database

export default function PublicProfile() {
  const params = useParams();
  // const username = params.username as string;
  const user = useQuery(api.users.current);
  const userProducts = useQuery(api.product.getByUserId, {
    userId: user?._id as Id<"users">,
  });
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50/50 px-4 pb-10 pt-0 lg:p-8">
      <div className="mx-auto max-w-5xl space-y-5">
        <div className="flex items-center gap-2 text-gray-600">
          <ArrowLeft
            className="cursor-pointer size-7 "
            onClick={() => router.push("/")}
          />
          <Breadcrumb className="bg-white py-7 pl-2">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/settings">Settings</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Personal</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        {/* Header */}

        <Card className="p-6">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={user?.imageUrl} alt="Profile picture" />
                <AvatarFallback>
                  {user?.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col  gap-2">
                <h1 className="text-2xl min-w-10 font-semibold">
                  {user?.name}
                </h1>
                <p className="text-sm text-muted-foreground">
                  @{user?.username}
                </p>
                <span className="ml-1 text-sm text-muted-foreground">
                  Buyer
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-2 ">
              <Button>
                <Link href={`/settings/personal/update`} className="size-full">
                  Edit Profile
                </Link>
              </Button>
              <p className="text-sm pt-1.5 text-muted-foreground">
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
          </div>
          <Separator className="my-4" />
          <div className="flex flex-wrap gap-4 text-sm">
            <div>
              <span className="font-medium">10</span> items sold
            </div>
            <div>
              <span className="font-medium">{userProducts?.length}</span> items
              for sale
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
              <h2 className="text-lg font-semibold">About Me</h2>
              <Separator className="my-4" />
              <p className="!leading-normal">
                {user?.description || (
                  <i className="text-gray-400 text-sm">about not provided</i>
                )}
              </p>
            </Card>

            {/* Recent Listings */}

            {!userProducts?.length ? null : (
              <Card className="p-6">
                <h2 className="text-lg font-semibold mb-4">Recent Listings</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {userProducts
                    ?.slice()
                    .reverse()
                    .slice(0, 3)
                    .map((listing) => (
                      <Link key={listing._id} href={`/product/${listing._id}`}>
                        <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
                          <img
                            src={listing.images[0] || "/placeholder.svg"}
                            alt={listing.title}
                            className="w-full h-32 object-cover"
                          />
                          <div className="p-2 space-y-1">
                            <h3 className="font-medium">{listing.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              &#8358;{listing.price.toLocaleString("en-US")}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                </div>
              </Card>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Contact Information */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold">Contact Information</h2>
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
              <h2 className="text-lg font-semibold">Location</h2>
              <Separator className="my-4" />
              <div className="flex items-center gap-2 capitalize">
                <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                <p>
                  {user?.contact?.address || (
                    <i className="normal-case text-gray-400 text-sm">
                      location not provided
                    </i>
                  )}
                </p>
              </div>
            </Card>
            <Card className="p-6">
              <Link
                href="/wallet"
                className="flex items-center gap-6 transition-all duration-300 py-2 px-2 rounded-md cursor-pointer hover:bg-gray-100"
              >
                <Wallet />
                <span className="text-lg font-semibold">Wallet</span>
              </Link>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
