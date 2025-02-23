import * as React from "react";
import { usePathname } from "next/navigation";

import { ModeSwitcher } from "./version-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { SearchForm } from "./search-form";
import Link from "next/link";
import { NavUser } from "./nav-user";
import { ChevronRight} from "lucide-react";
import Image from "next/image";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  modes: [
    {
      id: "light",
      name: "Light Mode",
      description: "Default light appearance",
    },
    {
      id: "dark",
      name: "Dark Mode",
      description: "Darker appearance for low-light environments",
    },
    {
      id: "system",
      name: "System",
      description: "Follow system appearance",
    },
  ],
  navMain: [
    {
      title: "Main Settings",
      url: "#",
      items: [
        {
          title: "Analytics",
          url: "/settings/analytics",
        },
        {
          title: "Products",
          url: "/settings/products",
        },
      ],
    },
    {
      title: "Display & Appearance",
      url: "#",
      items: [
        {
          title: "Theme Settings",
          url: "/settings/appearance",
        },
        {
          title: "Accessibility",
          url: "/settings/accessibility",
        },
      ],
    },
    {
      title: "Account Settings",
      url: "#",
      items: [
        {
          title: "Personal Details",
          url: "/settings/personal",
        },
        {
          title: "Business Details",
          url: "/settings/business",
        },
        {
          title: "Privacy & Security",
          url: "/settings/privacy",
        },
      ],
    },
    {
      title: "Preferences",
      url: "#",
      items: [
        {
          title: "Language & Region",
          url: "/settings/language",
        },
        {
          title: "Notifications",
          url: "/settings/notifications",
        },
      ],
    },
    {
      title: "Support",
      url: "#",
      items: [
        {
          title: "Help Center",
          url: "/settings/help",
        },
        {
          title: "Contact Support",
          url: "/settings/support",
        },
        {
          title: "About",
          url: "/settings/about",
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = React.useState("");

  const filteredNavMain = React.useMemo(() => {
    if (!searchQuery) return data.navMain;

    return data.navMain.map(group => ({
      ...group,
      items: group.items.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    })).filter(group => group.items.length > 0);
  }, [searchQuery]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenuButton
          size="lg"
          className="flex items-center"
        >
          <div className="flex items-center justify-center rounded-lg  text-sidebar-primary-foreground">
            <Image src="/icons/logo.svg" width={48} height={48} alt="logo" />
          </div>
          <div className="flex flex-col gap-0.5 leading-none">
            <span className="font-semibold">Flickmart</span>
            <span className="text-xs text-muted-foreground">
              Management and Settings
            </span>
          </div>
        </SidebarMenuButton>
        <SearchForm onSearch={handleSearch} />
      </SidebarHeader>
      <SidebarContent className="scrollbar-none">
        {filteredNavMain.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              {group.items.map((item) => (
                <SidebarMenu key={item.title}>
                  <SidebarMenuItem>
                    <Link href={item.url}>
                      <SidebarMenuButton isActive={pathname === item.url}>
                        {item.title} <ChevronRight className="ml-auto" />
                      </SidebarMenuButton>
                    </Link>
                  </SidebarMenuItem>
                </SidebarMenu>
              ))}
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
