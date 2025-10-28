"use client";

import { useMutation, useQuery } from "convex/react";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { NotificationSettings } from "@/components/notifications/NotificationSettings";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { Switch } from "@/components/ui/switch";
import { api } from "@/convex/_generated/api";

export default function NotificationsPage() {
  const { isMobile } = useSidebar();
  const router = useRouter();
  const user =useQuery(api.users.current, {});
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
      <div className="space-y-6 p-4">
        {/* Email Notifications */}
        <div className="space-y-4 rounded-lg border p-4 py-6">
          <h2 className="font-semibold text-lg">Email Notifications</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Marketing & Transactional Emails</p>
              <p className="text-muted-foreground text-sm">
                Receive updates about your account and new features
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
        </div>

        {/* Push Notifications - Multi-device support */}
        <NotificationSettings />
      </div>
    </div>
  );
}
