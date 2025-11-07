"use client";

import { useQuery } from "convex/react";
import { formatDistanceToNow } from "date-fns";
import { ChevronLeft, ChevronRight, MessageSquare, Share2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useState } from "react";
import Loader from "@/components/multipage/Loader";
import ProductCard from "@/components/multipage/ProductCard";
import { Button } from "@/components/ui/button";
import { Command, CommandInput } from "@/components/ui/command";
import { api } from "@/convex/_generated/api";
import type { Doc, Id } from "@/convex/_generated/dataModel";
import { shareProduct } from "@/utils/helpers";

const VendorProfile = ({
  params,
}: {
  params: Promise<{ vendorId: Id<"users"> }>;
}) => {
  const { vendorId } = use(params);

  const user = useQuery(api.users.getUser, { userId: vendorId });
  const store = useQuery(api.store.getExternalUserStore, { userId: vendorId });

  if (!user) {
    return <Loader />;
  }

  return (
    <div className="z-50 flex lg:w-full">
      <div className="relative h-full w-full overflow-y-auto bg-white lg:w-full">
        <ProfileContent store={store as Doc<"store">} user={user} />
      </div>
    </div>
  );
};
export default VendorProfile;

// Profile content component to share between mobile and desktop views
type ProfileContentProps = {
  user: Doc<"users">;
  store: Doc<"store">;
};

const ProfileContent = ({ user, store }: ProfileContentProps) => {
  const [search, setSearch] = useState("");
  const presence = useQuery(api.presence.getUserOnlineStatus, {
    userId: user._id,
  });
  const products = useQuery(api.product.getByUserId, { userId: user._id });

  const [isHidden, setIsHidden] = useState(false);
  const router = useRouter();
  const filteredProducts = products?.filter((product) =>
    product.title.toLowerCase().includes(search.toLowerCase())
  );
  const handleSearch = (value: string) => {
    setSearch(value);
  };
  const firstName = store?.name?.split(" ")[0];
  const lastName = store?.name?.split(" ")[1];

  return (
    <div className="p-4 lg:mx-auto lg:w-3/6">
      {/* Profile Header */}
      <div
        className={`${isHidden ? "hidden" : "block"} mb-6 flex flex-col items-start transition-all duration-300 ease-in-out`}
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="-z-10 absolute inset-0 rounded-full" />
            <Image
              alt={`${store?.name}'s profile picture`}
              className="size-[80px] rounded-full border-4 border-white object-cover shadow-lg"
              height={150}
              priority
              src={`${store?.image || "placeholder.svg"}`}
              width={150}
            />
          </div>
          <div>
            <h1 className="font-bold text-gray-800 text-xl">
              {firstName} {lastName !== "null" ? lastName : ""}
            </h1>

            {!!presence && (
              <p className="mt-1 text-gray-500 text-xs">
                {presence?.isOnline ? (
                  "online"
                ) : (
                  <span>
                    {presence?.lastSeen && presence.lastSeen > 0 ? (
                      <>
                        Last seen{" "}
                        {formatDistanceToNow(presence.lastSeen, {
                          addSuffix: true,
                        })}
                      </>
                    ) : (
                      "offline"
                    )}
                  </span>
                )}
              </p>
            )}
          </div>
        </div>

        {store ? (
          <div className="mt-4 max-w-md text-center">
            <p className="text-sm">{store.description}</p>
          </div>
        ) : (
          <div className="mt-4 w-full max-w-md">
            <p className="text-sm">Hey there i'm using flickmart!</p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div
        className={`${isHidden ? "hidden" : "block"} mb-6 grid max-w-lg grid-cols-2 gap-3 transition-all duration-300 ease-in-out`}
      >
        <Button
          className="flex items-center justify-center rounded-xl border-gray-200 py-5 transition-all hover:border-orange-200 hover:bg-orange-50"
          onClick={() => router.push(`/chat?vendorId=${user._id}`)}
          variant="outline"
        >
          <MessageSquare className="h-6 w-6 text-orange-500" />
          <span className="font-medium text-md">Message</span>
        </Button>
        <Button
          className="flex items-center justify-center rounded-xl border-gray-200 py-5 transition-all hover:border-orange-200 hover:bg-orange-50"
          onClick={() =>
            shareProduct({
              title: store.name || "Check out this store",
              url: `https://flickmart.app/vendors/${user._id}`,
              description:
                store.description ||
                `Have you checked out ${user.name}'s store on Flickmart?`,
            })
          }
          variant="outline"
        >
          <Share2 className="h-6 w-6 text-orange-500" />
          <span className="font-medium text-md">Share</span>
        </Button>
      </div>

      {/* Products Section */}
      {!!store && (
        <div className="mb-6">
          <div
            className={`${isHidden ? "hidden" : "block"} mb-4 flex items-center justify-between transition-all duration-300 ease-in-out`}
          >
            <h2 className="font-semibold text-gray-800 text-xl">
              More Products
            </h2>
            <Button
              className="flex items-center gap-1 rounded-full text-gray-500 hover:text-orange-600"
              onClick={() => setIsHidden(true)}
              variant="ghost"
            >
              <span>{products?.length}</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Search Bar */}
          <div className="relative mb-4 flex items-center">
            {isHidden && (
              <div
                className="rounded-full p-2 text-gray-800 transition-all duration-300 ease-in-out hover:bg-flickmart/10"
                onClick={() => setIsHidden(false)}
              >
                <ChevronLeft size={25} />
              </div>
            )}

            <Command>
              <CommandInput
                className="shadow-none"
                onValueChange={handleSearch}
                placeholder={`Search in ${user.name}'s store...`}
                value={search}
              />
            </Command>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:w-full lg:grid-cols-3">
            {filteredProducts?.length ? (
              filteredProducts
                ?.slice(0, isHidden ? filteredProducts.length : 6)
                .map((item) => (
                  <div key={item._id}>
                    <Link href={`/product/${item._id}`}>
                      <ProductCard
                        productId={item._id}
                        image={item.images[0]}
                        price={item.price}
                        title={item.title}
                      />
                    </Link>
                  </div>
                ))
            ) : (
              <div className="col-span-2 flex h-96 w-full items-center justify-center">
                <p className="text-center text-gray-500">
                  No products posted yet
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
