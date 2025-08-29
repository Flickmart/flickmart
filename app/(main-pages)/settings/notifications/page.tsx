'use client';

import { useMutation, useQuery } from 'convex/react';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger, useSidebar } from '@/components/ui/sidebar';
import { Switch } from '@/components/ui/switch';
import { api } from '@/convex/_generated/api';

export default function NotificationsPage() {
  const [pushNotifications, setPushNotifications] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const { isMobile, openMobile, setOpenMobile } = useSidebar();
  const router = useRouter();
  const user = useQuery(api.users.current);
  const [emailNotification, setEmailNotification] = useState(
    user?.allowNotifications
  );
  const updateNotifications = useMutation(api.users.updateUser);


  return (
    <div className="flex w-full flex-col">
      <header className="flex h-20 shrink-0 items-center px-4 shadow-md">
        {isMobile ? (
          <>
            <ChevronLeft
              className="size-7 cursor-pointer"
              onClick={() => router.back()}
            />
          </>
        ) : (
          <SidebarTrigger className="-ml-1" />
        )}
        <Separator className="mr-2 h-4" orientation="vertical" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <Link href="/settings">Settings</Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Notifications</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>
      <div className="space-y-4">
        <div className="space-y-4 rounded-lg border p-4 py-6">
          <h2 className="font-semibold text-lg">Notifications</h2>

          <div className="flex items-center justify-between pt-4">
            <div>
              <p className="font-medium"> Notifications</p>
              <p className="text-muted-foreground text-sm">
                Show notifications
              </p>
            </div>
            <Switch
              checked={notifications}
              onCheckedChange={setNotifications}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Email Notifications</p>
              <p className="text-muted-foreground text-sm">
                Receive marketing & transactional emails
              </p>
            </div>
            <Switch
              checked={emailNotification}
              onCheckedChange={(checked) => {
                setEmailNotification(checked);
                updateNotifications({ allowNotifications: checked });
              }}
            />
          </div>

          <div className="flex items-center justify-between pt-4">
            <div>
              <p className="font-medium">Push Notifications</p>
              <p className="text-muted-foreground text-sm">
                Receive alerts on your device
              </p>
            </div>
            <Switch
              checked={pushNotifications}
              onCheckedChange={setPushNotifications}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
