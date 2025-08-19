"use client";

import Image from "next/image";
import {
  MessageSquare,
  Share2,
  ChevronRight,
  Search,
  ChevronLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { use, useEffect, useState } from "react";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { formatDistanceToNow } from "date-fns";
import ProductCard from "@/components/multipage/ProductCard";
import Link from "next/link";
import Loader from "@/components/multipage/Loader";
import { Command, CommandInput } from "@/components/ui/command";
import { useRouter } from "next/navigation";
import { shareProduct } from "@/utils/helpers";

const VendorProfile = ({
  params,
}: {
  params: Promise<{ vendorId: Id<"users"> }>;
}) => {
  const { vendorId } = use(params);

  const user = useQuery(api.users.getUser, { userId: vendorId });
  const store = useQuery(api.store.getStoreByUserId);

  if (!user) {
    return <Loader />;
  }

  return (
    <div className="z-50 flex lg:w-full ">
      <div className="relative bg-white  h-full w-full overflow-y-auto  lg:w-full">
        <ProfileContent user={user} store={store as Doc<"store">} />
      </div>
    </div>
  );
};
export default VendorProfile;

// Profile content component to share between mobile and desktop views
interface ProfileContentProps {
  user: Doc<"users">;
  store: Doc<"store">;
}

const ProfileContent = ({ user, store }: ProfileContentProps) => {
  const [search, setSearch] = useState("");
  const presence = useQuery(api.presence.getUserPresence, { userId: user._id });
  const products = useQuery(api.product.getByUserId);
  const [isHidden, setIsHidden] = useState(false);
  const router = useRouter();
  const filteredProducts = products?.filter((product) =>
    product.title.toLowerCase().includes(search.toLowerCase())
  );
  const handleSearch = (value: string) => {
    setSearch(value);
  };
  return (
    <>
      <div className="p-4 lg:w-3/6 lg:mx-auto">
        {/* Profile Header */}
        <div
          className={`${isHidden ? "hidden" : "block"} transition-all duration-300 ease-in-out flex flex-col items-start mb-6`}
        >
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 rounded-full -z-10"></div>
              <Image
                src={`${user.imageUrl || "placeholder.svg"}`}
                alt={`${user.name}'s profile picture`}
                width={150}
                height={150}
                className="rounded-full border-4 border-white size-[80px] shadow-lg object-cover"
                priority
              />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">{user.name}</h1>
              {!!presence && (
                <p className="text-xs text-gray-500 mt-1">
                  {presence?.status === "online" ? (
                    "online"
                  ) : (
                    <span>
                      Last seen{" "}
                      {formatDistanceToNow(presence?.lastUpdated, {
                        addSuffix: true,
                      })}{" "}
                    </span>
                  )}
                </p>
              )}
            </div>
          </div>

          {store ? (
            <div className="mt-4 text-center max-w-md">
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
          className={`${isHidden ? "hidden" : "block"} transition-all duration-300 ease-in-out grid grid-cols-2 gap-3 mb-6 max-w-lg`}
        >
          <Button
            onClick={() => router.push(`/chat?vendorId=${user._id}`)}
            variant="outline"
            className="flex justify-center items-center py-5 rounded-xl border-gray-200 hover:bg-orange-50 hover:border-orange-200 transition-all"
          >
            <MessageSquare className="h-6 w-6 text-orange-500" />
            <span className="text-md font-medium">Message</span>
          </Button>
          <Button
            onClick={() =>
              shareProduct({
                title: store.name || "Check out this store",
                url: `https://flickmart.app/vendors/${user._id}`,
                description: `Have you checked out ${user.name}'s store on Flickmart?`,
              })
            }
            variant="outline"
            className="flex justify-center items-center py-5 rounded-xl border-gray-200 hover:bg-orange-50 hover:border-orange-200 transition-all"
          >
            <Share2 className="h-6 w-6 text-orange-500" />
            <span className="text-md font-medium">Share</span>
          </Button>
        </div>

        {/* Products Section */}
        {!!store && (
          <div className="mb-6">
            <div
              className={`${isHidden ? "hidden" : "block"} transition-all duration-300 ease-in-out flex justify-between items-center mb-4`}
            >
              <h2 className="text-xl font-semibold text-gray-800">
                More Products
              </h2>
              <Button
                onClick={() => setIsHidden(true)}
                variant="ghost"
                className="text-gray-500 rounded-full flex items-center gap-1 hover:text-orange-600"
              >
                <span>{products?.length}</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Search Bar */}
            <div className="flex items-center relative mb-4">
              {isHidden && (
                <div
                  onClick={() => setIsHidden(false)}
                  className="text-gray-800 rounded-full p-2 transition-all duration-300 ease-in-out hover:bg-flickmart/10"
                >
                  <ChevronLeft size={25} />
                </div>
              )}

              <Command>
                <CommandInput
                  placeholder={`Search in ${user.name}'s store...`}
                  onValueChange={handleSearch}
                  value={search}
                  className="shadow-none"
                />
              </Command>
            </div>

            <div className="grid lg:w-full grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProducts
                ?.slice(0, isHidden ? filteredProducts.length : 6)
                .map((item) => (
                  <div key={item._id}>
                    <Link href={`/product/${item._id}`}>
                      <ProductCard
                        image={item.images[0]}
                        title={item.title}
                        price={item.price}
                      />
                    </Link>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};
