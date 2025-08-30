"use client";

import { useMutation, useQuery } from "convex/react";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { usePushNotifications } from "@/providers/PushNotificationProvider";
import { TestPushNotification } from "@/components/TestPushNotification";
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
  const [notifications, setNotifications] = useState(true);
  const { isMobile } = useSidebar();
  const router = useRouter();
  const user = useQuery(api.users.current);
  const [emailNotification, setEmailNotification] = useState(
    user?.allowNotifications
  );
  const updateNotifications = useMutation(api.users.updateUser);

  // Custom push notifications integration
  const {
    isSupported,
    permission,
    isSubscribed,
    promptForPermission,
    subscribe,
    unsubscribe,
  } = usePushNotifications();

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
                {!isSupported && (
                  <span className="block text-red-500 text-xs mt-1">
                    Not supported in this browser
                  </span>
                )}
                {permission === "denied" && (
                  <span className="block text-red-500 text-xs mt-1">
                    Notifications blocked. Enable in browser settings.
                  </span>
                )}
                {permission === "default" && (
                  <span className="block text-yellow-600 text-xs mt-1">
                    Click to enable notifications
                  </span>
                )}
              </p>
            </div>
            <Switch
              checked={isSubscribed}
              disabled={!isSupported || permission === "denied"}
              onCheckedChange={async (checked) => {
                try {
                  if (checked) {
                    if (permission === "default") {
                      await promptForPermission();
                    } else {
                      await subscribe();
                    }
                  } else {
                    await unsubscribe();
                  }
                } catch (error) {
                  console.error("Error toggling push notifications:", error);
                }
              }}
            />
          </div>
        </div>

        {/* Test Notification Component */}
        <TestPushNotification />
      </div>
    </div>
  );
}
