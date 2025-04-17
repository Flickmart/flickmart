import Image from "next/image";
import {
  MessageSquare,
  Share2,
  ChevronRight,
  Bookmark,
  Search,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
} from "@/components/ui/sheet";
import { useEffect, useState } from "react";

interface UserProfileProps {
  open?: boolean;
  onClose: () => void;
}

// Profile content component to share between mobile and desktop views
const ProfileContent = () => (
  <>
    <div className="bg-flickmart p-4 text-white">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Profile</h2>
      </div>
    </div>
    
    <div className="p-4">
      {/* Profile Header */}
      <div className="flex flex-col items-center mb-6">
        <div className="relative mb-4">
          <div className="absolute inset-0 rounded-ful blur-sm -z-10 scale-110"></div>
          <Image
            src="/placeholder.svg?height=150&width=150"
            alt="Daniella's profile picture"
            width={150}
            height={150}
            className="rounded-full border-4 border-white shadow-lg object-cover"
            priority
          />
        </div>

        <h1 className="text-2xl font-bold text-gray-800">Daniella</h1>
        <p className="text-sm text-gray-500 mt-1">
          Last seen today at 8:20PM
        </p>

        <div className="mt-4 text-center max-w-md">
          <p className="text-gray-700 leading-relaxed">
            I sell quality shoes in the industry u can also get bags, clothes
            and other accessories from my store here in flickmart.
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <Button
          variant="outline"
          className="flex flex-col items-center py-5 rounded-xl border-gray-200 hover:bg-orange-50 hover:border-orange-200 transition-all"
        >
          <MessageSquare className="h-6 w-6 text-orange-500 mb-1" />
          <span className="text-sm font-medium">Message</span>
        </Button>
        <Button
          variant="outline"
          className="flex flex-col items-center py-5 rounded-xl border-gray-200 hover:bg-orange-50 hover:border-orange-200 transition-all"
        >
          <Share2 className="h-6 w-6 text-orange-500 mb-1" />
          <span className="text-sm font-medium">Share</span>
        </Button>
      </div>

      {/* Products Section */}
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
            placeholder="Search in Daniella's store..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4].map((item) => (
            <Card key={item} className="overflow-hidden group relative">
              <div className="absolute top-2 left-2 z-10">
                <Badge className="bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-600 hover:to-orange-500">
                  HOT
                </Badge>
              </div>
              <div className="absolute top-2 right-2 z-10">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm"
                >
                  <Bookmark
                    className={`h-4 w-4 ${item % 2 === 0 ? "text-gray-400" : "text-orange-500 fill-orange-500"}`}
                  />
                </Button>
              </div>
              <div className="bg-gray-100 p-4 aspect-square flex items-center justify-center">
                <Image
                  src="/placeholder.svg?height=200&width=200"
                  alt={`Product ${item}`}
                  width={200}
                  height={200}
                  className="object-contain transition-transform group-hover:scale-105"
                />
              </div>
              <div className="p-3">
                <h3 className="font-medium text-sm truncate">
                  Premium Headphones
                </h3>
                <p className="text-orange-600 font-semibold mt-1">$129.99</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  </>
);

export default function UserProfile({ open, onClose }: UserProfileProps) {
  if (!open) return null;
  
  const [isMobile, setIsMobile] = useState(false);
  
  // Detect if we're on mobile or desktop
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint is 768px
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => {
      window.removeEventListener('resize', checkIsMobile);
    };
  }, []);
  
  // Render different UI based on mobile or desktop
  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={onClose}>
        <SheetContent className="w-full overflow-y-auto p-0" side="right">
          <ProfileContent />
        </SheetContent>
      </Sheet>
    );
  }
  
  // Desktop view - no Sheet component at all
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/20" onClick={onClose}></div>
      <div className="relative bg-white h-full w-full overflow-y-auto max-w-3xl shadow-xl">
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-4 z-10 rounded-full bg-white/90 p-1.5 text-gray-700 shadow-sm"
          onClick={onClose}
        >
          <X className="h-5 w-5" />
        </Button>
        <ProfileContent />
      </div>
    </div>
  );
}
