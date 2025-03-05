import * as React from "react";
import { usePathname } from "next/navigation";

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
  useSidebar,
} from "@/components/ui/sidebar";
import { SearchForm } from "./search-form";
import Link from "next/link";
import { NavUser } from "./nav-user";
import {
  Activity,
  ChartSpline,
  Languages,
  Palette,
  Store,
  ShieldCheck,
  HelpCircle,
  MessageSquare,
  Info,
  Bell,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const data = {
  user: {
    name: "ebuka",
    email: "ebuka@gmail.com",
    avatar: "/avatars/shadcn.jpg",
    username: "ebuka223",
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
          icon: <ChartSpline />,
          url: "/settings/analytics",
        },
        {
          title: "Products",
          icon: <Store />,
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
          icon: <Palette />,
          url: "/settings/appearance",
        },
        {
          title: "Accessibility",
          icon: <Activity />,
          url: "/settings/accessibility",
        },
      ],
    },
    {
      title: "Account Settings",
      url: "#",
      items: [
        {
          title: "Business Details",
          icon: <Store />,
          url: "/settings/business",
        },
        {
          title: "Privacy & Security",
          icon: <ShieldCheck />,
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
          icon: <Languages />,
          url: "/settings/language",
        },
        {
          title: "Notifications",
          icon: <Bell />,
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
          icon: <HelpCircle />,
          url: "/settings/help",
        },
        {
          title: "Contact Support",
          icon: <MessageSquare />,
          url: "/settings/support",
        },
        {
          title: "About",
          icon: <Info />,
          url: "/settings/about",
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
              <AvatarFallback className="rounded-lg">EB</AvatarFallback>
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
                <SidebarMenu key={item.title}>
                  <SidebarMenuItem>
                    <Link href={item.url}>
                      <SidebarMenuButton
                        isActive={pathname === item.url}
                        onClick={() => setOpenMobile(!openMobile)}
                      >
                        {item.icon} {item.title}
                      </SidebarMenuButton>
                    </Link>
                  </SidebarMenuItem>
                </SidebarMenu>
              ))}
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      {/* <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter> */}
    </Sidebar>
  );
}
