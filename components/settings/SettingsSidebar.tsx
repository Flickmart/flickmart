'use client';

import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  onClick?: () => void;
}

export function SettingsSidebar({ className, onClick }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const menuItems = [
    {
      icon: '/icons/user.svg',
      title: 'Personal Details',
      link: '/settings/personal',
    },
    {
      icon: '/icons/business.svg',
      title: 'Business Details',
      link: '/settings/business',
    },
    {
      icon: '/icons/phone.svg',
      title: 'Change Phone Number',
      link: '/settings/phone',
    },
    {
      icon: '/icons/email.svg',
      title: 'Change Email',
      link: '/settings/email',
    },
    {
      icon: '/icons/password.svg',
      title: 'Password',
      link: '/settings/password',
    },
    {
      icon: '/icons/notification.svg',
      title: 'Manage Notifications',
      link: '/settings/notifications',
    },
    {
      icon: '/icons/disable-chat.svg',
      title: 'Disable Chats',
      link: '/settings/chats',
    },
    {
      icon: '/icons/switch.svg',
      title: 'Switch Account',
      link: '/settings/switch',
    },
    {
      icon: '/icons/delete.svg',
      title: 'Delete Account',
      link: '/settings/delete',
    },
    { icon: '/icons/logout.svg', title: 'Log Out', link: '/sign-in' },
  ];

  const handleItemClick = (link: string) => {
    router.push(link);
    if (onClick) {
      onClick();
    }
  };

  return (
    <div className={cn('min-h-screen w-full', className)}>
      <div className="h-full w-full space-y-4 py-4">
        <div className="w-full px-3 py-2">
          <h2 className="mb-2 px-4 font-semibold text-lg tracking-tight">
            Settings
          </h2>
          <div className="flex h-full w-full flex-col justify-around">
            {menuItems.map((item, index) => (
              <Button
                className="w-full justify-start"
                key={index}
                onClick={() => handleItemClick(item.link)}
                variant={pathname === item.link ? 'secondary' : 'ghost'}
              >
                <Image
                  alt={item.title}
                  className="mr-2 h-4 w-4"
                  height={24}
                  src={item.icon}
                  width={24}
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
