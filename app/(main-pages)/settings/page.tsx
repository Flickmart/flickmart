'use client';
import { useQuery } from 'convex/react';
import {
  Bell,
  ChartNoAxesCombined,
  ChevronLeft,
  MessageSquare,
  ShoppingBag,
  Store,
  UserPen,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import { SearchForm } from '@/components/settings/search-form';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useSidebar } from '@/components/ui/sidebar';
import { api } from '@/convex/_generated/api';

const data = {
  navMain: [
    {
      title: 'Account Settings',
      items: [
        {
          title: 'Profile',
          icon: UserPen,
          description: 'Manage your personal details',
          url: '/settings/personal',
        },
      ],
    },
    {
      title: 'Store Settings',
      items: [
        {
          title: 'Products',
          icon: ShoppingBag,
          description: 'View and edit your products',
          url: '/settings/products',
        },
      ],
    },
    {
      title: '',
      items: [
        {
          title: 'Store',
          icon: Store,
          description: 'Manage your store details',
          url: '/settings/business',
        },
      ],
    },
    {
      title: 'Performance',
      items: [
        {
          title: 'Analytics',
          icon: ChartNoAxesCombined,
          description: 'Track your store performance',
          url: '/settings/analytics',
        },
      ],
    },
    {
      title: 'Notification Preferences',
      items: [
        {
          title: 'Notifications',
          icon: Bell,
          description: 'Control alerts preferences.',
          url: '/settings/notifications',
        },
      ],
    },
    {
      title: 'Support',
      url: '/settings/support',
      items: [
        {
          title: 'Contact Support',
          icon: MessageSquare,
          description: 'Get help with your account',
          url: '/contact',
        },
      ],
    },
  ],
};

export default function SettingsPage() {
  const [searchQuery, setSearchQuery] = React.useState('');
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
    <div className="flex min-h-screen w-full flex-col pb-16">
      <div className="bg-white">
        {isMobile && (
          <div className="flex h-[10vh] items-center gap-2 px-3 text-gray-600 shadow-md">
            <div
              className="rounded-full p-2 transition-all duration-200 hover:bg-gray-100"
              onClick={() => router.push('/')}
            >
              <ChevronLeft size={30} />
            </div>
            <h2 className="font-medium text-lg">Settings</h2>
          </div>
        )}
        <div className="flex items-center gap-2 p-3 py-5">
          <Link className="flex gap-2" href="/settings/personal/update">
            <Avatar className="size-12 rounded-full">
              <AvatarImage alt={user?.name} src={user?.imageUrl} />
              <AvatarFallback className="rounded-full">
                {user?.name.split(' ').map((item) => item[0]?.toUpperCase())}
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold text-lg capitalize">
                {user?.name}
              </span>
              <span className="truncate font-medium text-gray-600 text-xs">
                {'@' + user?.username || 'No username'}
              </span>
            </div>
          </Link>
        </div>
        <SearchForm onSearch={handleSearch} />
      </div>
      <div className="scrollbar-none flex flex-grow flex-col gap-7 p-5">
        {filteredNavMain.map((group) => (
          <div className="space-y-2" key={group.title}>
            <h2 className="font-medium text-gray-600 text-sm">{group.title}</h2>
            <div>
              {group.items.map((item) => (
                <Link href={item.url} key={item.title}>
                  <div className="flex items-center gap-2 transition-all duration-300 hover:rounded-xl hover:bg-gray-100 hover:p-3">
                    <item.icon className="text-gray-800" size={30} />
                    <div className="z-10 flex flex-col text-sm">
                      <span className="font-medium text-base">
                        {item.title}
                      </span>
                      <span className="text-muted-foreground text-sm leading-tight">
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
