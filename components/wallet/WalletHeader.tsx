import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CardHeader } from "@/components/ui/card";
import { Bell, Headphones } from "lucide-react";
import { type Doc } from "@/convex/_generated/dataModel";

interface WalletHeaderProps {
  user: Doc<"users">;
  isMobile?: boolean;
}

export default function WalletHeader({
  user,
  isMobile = false,
}: WalletHeaderProps) {
  const IconComponent = isMobile ? Headphones : Bell;
  const iconSize = isMobile ? "h-6 w-6" : "h-7 w-7";
  const notificationSize = isMobile ? "h-3 w-3" : "h-4 w-4";
  const notificationTextSize = isMobile ? "text-[10px]" : "text-[11px]";
  const displayName = user?.name?.trim() || "Guest";
  const initials = displayName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n.charAt(0))
    .join("")
    .toUpperCase();



  return (
    <CardHeader className={`bg-white ${isMobile ? "p-4" : "border-b p-6"}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12">
            <AvatarImage alt={user?.name} src={user?.imageUrl} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-semibold text-lg">{user?.name}</h2>
            <p className="text-gray-500 text-sm">Welcome, let's make payment</p>
          </div>
        </div>
        <div className="relative">
          <IconComponent className={`${iconSize} text-gray-600`} />
          <div
            className={`-top-1 -right-1 absolute flex ${notificationSize} items-center justify-center rounded-full bg-red-500 text-white text-xs`}
          >
            <span className={notificationTextSize}>1</span>
          </div>
        </div>
      </div>
    </CardHeader>
  );
}
