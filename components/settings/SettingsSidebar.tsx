"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  onClick?: () => void;
}

export function SettingsSidebar({ className, onClick }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const menuItems = [
    { icon: "/icons/user.svg", title: "Personal Details", link: "/settings/personal" },
    { icon: "/icons/business.svg", title: "Business Details", link: "/settings/business" },
    { icon: "/icons/phone.svg", title: "Change Phone Number", link: "/settings/phone" },
    { icon: "/icons/email.svg", title: "Change Email", link: "/settings/email" },
    { icon: "/icons/password.svg", title: "Password", link: "/settings/password" },
    { icon: "/icons/notification.svg", title: "Manage Notifications", link: "/settings/notifications" },
    { icon: "/icons/disable-chat.svg", title: "Disable Chats", link: "/settings/chats" },
    { icon: "/icons/switch.svg", title: "Switch Account", link: "/settings/switch" },
    { icon: "/icons/delete.svg", title: "Delete Account", link: "/settings/delete" },
    { icon: "/icons/logout.svg", title: "Log Out", link: "/sign-in" },
  ];

  const handleItemClick = (link: string) => {
    router.push(link);
    if (onClick) onClick();
  };

  return (
    <div className={cn("w-full min-h-screen", className)}>
      <div className="space-y-4 py-4 h-full w-full">
        <div className="px-3 py-2 w-full">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Settings
          </h2>
          <div className="h-full flex flex-col justify-around w-full">
            {menuItems.map((item, index) => (
              <Button
                key={index}
                variant={pathname === item.link ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => handleItemClick(item.link)}
              >
                <Image
                  src={item.icon}
                  alt={item.title}
                  width={24}
                  height={24}
                  className="mr-2 h-4 w-4"
                />
                {item.title}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}