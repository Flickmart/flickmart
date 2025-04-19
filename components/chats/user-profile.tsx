import Image from "next/image";
import {
  MessageSquare,
  Share2,
  ChevronRight,
  Bookmark,
  Search,
  X,
  ArrowLeft,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useEffect, useState } from "react";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { format } from "date-fns";
import ProductCard from "../multipage/ProductCard";
import Link from "next/link";

interface UserProfileProps {
  open?: boolean;
  onClose: () => void;
  userId: Id<"users">;
}

interface ProfileContentProps {
  user: Doc<"users">;
  store: Doc<"store">;
}
// Profile content component to share between mobile and desktop views
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
      <div className="p-4">
        {/* Profile Header */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative mb-4">
            <div className="absolute inset-0 rounded-full -z-10 scale-110"></div>
            <Image
              src={`${user.imageUrl || "placeholder.svg"}`}
              alt={`${user.name}'s profile picture`}
              width={150}
              height={150}
              className="rounded-full border-4 border-white shadow-lg object-cover"
              priority
            />
          </div>

          <h1 className="text-2xl font-bold text-gray-800">{user.name}</h1>
          {!!presence && (
            <p className="text-sm text-gray-500 mt-1">
              {presence?.status === "online" ? (
                "online"
              ) : (
                <span>
                  Last seen today at{" "}
                  {format(presence?.lastUpdated, "h:mm aaa")}{" "}
                </span>
              )}
            </p>
          )}

          {store ? (
            <div className="mt-4 text-center max-w-md">
              <p className="text-gray-700 leading-relaxed">
                I sell quality shoes in the industry u can also get bags,
                clothes and other accessories from my store here in flickmart.
              </p>
            </div>
          ) : (
            <div className="mt-4 text-center max-w-md">
              <p className="text-gray-700 leading-relaxed">
                Hey there i'm using flickmart!
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 mb-6">
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

export default function UserProfile({
  open,
  onClose,
  userId,
}: UserProfileProps) {
  const user = useQuery(api.users.getUser, { userId: userId });
  const store = useQuery(api.store.getStoreByUserId, { userId: userId });

  // Always set up state and effects
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint is 768px
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);

    return () => {
      window.removeEventListener("resize", checkIsMobile);
    };
  }, []);

  // Conditionally render based on user and open rather than returning early
  if (!user || !open) {
    return null;
  }

  // Render UI based on mobile or desktop
  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={onClose}>
        <SheetContent className="w-full overflow-y-auto p-0" side="right">
          <ProfileContent user={user!} store={store!} />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end ">
      <div className="absolute inset-0 bg-black/20" onClick={onClose}></div>
      <div className="relative bg-white h-full w-full overflow-y-auto max-w-5xl shadow-xl">
        <div className="flex gap-x-2 p-3">
          <ArrowLeft className="h-8 w-8 cursor-pointer" onClick={onClose} />
          <h2 className="text-2xl text-black font-bold ml-6">Profile</h2>
        </div>
        <ProfileContent user={user!} store={store!} />
      </div>
    </div>
  );
}
