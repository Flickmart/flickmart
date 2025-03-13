import * as React from "react";
import { usePathname } from "next/navigation";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { SearchForm } from "./search-form";
import Link from "next/link";
import { Store, MessageSquare, Bell } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const data = {
  user: {
    name: "ebuka",
    email: "ebuka@gmail.com",
    avatar: "/avatar.jpeg",
    username: "ebuka223",
  },
  navMain: [
    {
      title: "Main Settings",
      url: "#",
      items: [
        {
          title: "Products",
          icon: <Store />,
          description: "Create and edit your products",
          url: "/settings/products",
        },
      ],
    },
    {
      title: "Account Settings",
      url: "#",
      items: [
        {
          title: "Store Details",
          icon: <Store />,
          description: "Create or edit your store details",
          url: "/settings/business",
        },
      ],
    },
    {
      title: "Preferences",
      url: "#",
      items: [
        {
          title: "Notifications",
          icon: <Bell />,
          description: "Manage your notification preferences",
          url: "/settings/notifications",
        },
      ],
    },
    {
      title: "Support",
      url: "#",
      items: [
        {
          title: "Contact Support",
          icon: <MessageSquare />,
          description: "Get help with your account",
          url: "/settings/support",
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = React.useState("");
  const { isMobile, openMobile, setOpenMobile } = useSidebar();

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
    <Sidebar {...props} className="bg-white max-sm:w-full">
      <SidebarHeader>
        <Link href="/settings/personal">
          <SidebarMenuButton
            size="lg"
            className="flex items-center"
            onClick={() => setOpenMobile(!openMobile)}
          >
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarImage src={data.user.avatar} alt={data.user.name} />
              <AvatarFallback className="rounded-full">EB</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">{data.user.name}</span>
              <span className="truncate text-xs">{data.user.username}</span>
            </div>
          </SidebarMenuButton>
        </Link>
        <SearchForm onSearch={handleSearch} />
      </SidebarHeader>
      <SidebarContent className="scrollbar-none">
        {filteredNavMain.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              {group.items.map((item) => (
                <SidebarMenu key={item.title} className="gap-y-0">
                  <SidebarMenuItem>
                    <Link href={item.url}>
                      <SidebarMenuButton
                        isActive={pathname === item.url}
                        onClick={() => setOpenMobile(!openMobile)}
                        className="py-0"
                      >
                        {item.icon} {item.title}
                      </SidebarMenuButton>
                      <span className="text-muted-foreground ml-2 leading-tight text-xs">
                        {item.description}
                      </span>
                    </Link>
                  </SidebarMenuItem>
                </SidebarMenu>
              ))}
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}
