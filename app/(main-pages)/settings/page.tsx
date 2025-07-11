"use client";
import * as React from "react";
import { useRouter } from "next/navigation";

import { useSidebar } from "@/components/ui/sidebar";
import Link from "next/link";
import {
  Store,
  MessageSquare,
  ChevronLeft,
  ChartNoAxesCombined,
  UserPen,
  ShoppingBag,
  Bell,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SearchForm } from "@/components/settings/search-form";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

const data = {
  navMain: [
    {
      title: "Account Settings",
      items: [
        {
          title: "Profile",
          icon: UserPen,
          description: "Manage your personal details",
          url: "/settings/personal",
        },
      ],
    },
    {
      title: "Store Settings",
      items: [
        {
          title: "Products",
          icon: ShoppingBag,
          description: "View and edit your products",
          url: "/settings/products",
        },
      ],
    },
    {
      title: "",
      items: [
        {
          title: "Store",
          icon: Store,
          description: "Manage your store details",
          url: "/settings/business",
        },
      ],
    },
    {
      title: "Performance",
      items: [
        {
          title: "Analytics",
          icon: ChartNoAxesCombined,
          description: "Track your store performance",
          url: "/settings/analytics",
        },
      ],
    },
    {
      title: "Notification Preferences",
      items: [
        {
          title: "Notifications",
          icon: Bell,
          description: "Control alerts preferences.",
          url: "/settings/notifications",
        },
      ],
    },
    {
      title: "Support",
      url: "/settings/support",
      items: [
        {
          title: "Contact Support",
          icon: MessageSquare,
          description: "Get help with your account",
          url: "/contact",
        },
      ],
    },
  ],
};

export default function SettingsPage() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const { isMobile, setOpenMobile } = useSidebar();
  const router = useRouter();
  const user = useQuery(api.users.current);

  React.useEffect(() => {
    if (isMobile) {
      setOpenMobile(true);
    }
  }, [isMobile]);

  const filteredNavMain = React.useMemo(() => {
    if (!searchQuery) return data.navMain;

    return data.navMain
      .map((group) => ({
        ...group,
        items: group.items.filter((item) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase())
        ),
      }))
      .filter((group) => group.items.length > 0);
  }, [searchQuery]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div className="flex flex-col w-full min-h-screen pb-16 ">
      <div className="  bg-white">
        {isMobile && (
          <div className=" text-gray-600 flex items-center px-3 gap-2 h-[10vh] shadow-md ">
            <div
              onClick={() => router.push("/")}
              className=" hover:bg-gray-100 transition-all duration-200 rounded-full  p-2"
            >
              <ChevronLeft size={30} />
            </div>
            <h2 className="text-xl font-medium">Settings</h2>
          </div>
        )}
        <div className="flex py-5 p-3 gap-2 items-center">
          <Link href="/settings/personal/update" className="flex gap-2 ">
            <Avatar className="size-12 rounded-full">
              <AvatarImage src={user?.imageUrl} alt={user?.name} />
              <AvatarFallback className="rounded-full">
                {user?.name.split(" ").map((item) => item[0].toUpperCase())}
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left  text-sm leading-tight">
              <span className="truncate text-lg capitalize  font-semibold">
                {user?.name}
              </span>
              <span className="truncate text-xs font-medium text-gray-600">
                {"@" + user?.username || "No username"}
              </span>
            </div>
          </Link>
        </div>
        <SearchForm onSearch={handleSearch} />
      </div>
      <div className="scrollbar-none flex flex-col  p-5 gap-7 flex-grow  ">
        {filteredNavMain.map((group) => (
          <div className="space-y-2" key={group.title}>
            <h2 className="text-gray-600 text-sm font-medium">{group.title}</h2>
            <div>
              {group.items.map((item) => (
                <Link key={item.title} href={item.url}>
                  <div className="flex items-center gap-2 hover:bg-gray-100 hover:rounded-xl  hover:p-3 transition-all duration-300">
                    <item.icon className="text-gray-800" size={30} />
                    <div className="flex flex-col text-sm z-10 ">
                      <span className="text-lg font-medium">{item.title}</span>
                      <span className="text-muted-foreground leading-tight text-base">
                        {item.description}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
