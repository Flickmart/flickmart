"use client";

import Image from "next/image";
import { MessageSquare, Share2, ChevronRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { use, useState } from "react";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { formatDistanceToNow } from "date-fns";
import ProductCard from "@/components/multipage/ProductCard";
import Link from "next/link";
import Loader from "@/components/multipage/Loader";

const VendorProfile = ({
  params,
}: {
  params: Promise<{ vendorId: Id<"users"> }>;
}) => {
  const { vendorId } = use(params);

  const user = useQuery(api.users.getUser, { userId: vendorId });
  const store = useQuery(api.store.getStoreByUserId, { userId: vendorId });

  if (!user) {
    return <Loader />;
  }

  return (
    <div className="z-50 flex">
      <div className="relative bg-white h-full w-full overflow-y-auto max-w-5xl">
        <ProfileContent user={user!} store={store!} />
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
  const products = useQuery(api.product.getByUserId, {
    userId: user._id,
  });
  const filteredProducts = products?.filter((product) =>
    product.title.toLowerCase().includes(search.toLowerCase())
  );
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };
  return (
    <>
      <div className="p-4 lg:w-4/6 lg:mx-auto">
        {/* Profile Header */}
        <div className="flex flex-col items-start mb-6">
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
              <p className="text-sm">
                {store.description ||
                  "This user hasn't added a store description yet."}
              </p>
            </div>
          ) : (
            <div className="mt-4 text-center max-w-md">
              <p className="text-sm">Hey there. I'm using Flickmart!</p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 mb-6 max-w-lg">
          <Button
            variant="outline"
            className="flex justify-center items-center py-5 rounded-xl border-gray-200 hover:bg-orange-50 hover:border-orange-200 transition-all"
          >
            <MessageSquare className="h-6 w-6 text-orange-500" />
            <span className="text-md font-medium">Message</span>
          </Button>
          <Button
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
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                More Products
              </h2>
              <Button
                variant="ghost"
                className="text-gray-500 flex items-center gap-1 hover:text-orange-600"
              >
                <span>20</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Search Bar */}
            <div className="relative mb-4">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                value={search}
                onChange={handleSearch}
                placeholder={`Search in ${user.name}'s store...`}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProducts?.map((item) => (
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
