"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { ArrowLeft } from "lucide-react";

export default function NotificationsPage() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const { isMobile, openMobile, setOpenMobile } = useSidebar();

  return (
    <div>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        {!isMobile ? (
          <SidebarTrigger className="-ml-1" />
        ) : (
          <>
            <ArrowLeft
              className="cursor-pointer -ml-1"
              onClick={() => setOpenMobile(!openMobile)}
            />
          </>
        )}
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/settings">Settings</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Notifications</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>
      <div className="space-y-4">
        <div className="rounded-lg border p-4 space-y-4">
          <h2 className="text-lg font-semibold">Notifications</h2>

          <div className="flex items-center justify-between pt-4">
            <div>
              <p className="font-medium"> Notifications</p>
              <p className="text-sm text-muted-foreground">
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
              <p className="text-sm text-muted-foreground">
                Receive marketing & transactional emails
              </p>
            </div>
            <Switch
              checked={emailNotifications}
              onCheckedChange={setEmailNotifications}
            />
          </div>

          <div className="flex items-center justify-between pt-4">
            <div>
              <p className="font-medium">Push Notifications</p>
              <p className="text-sm text-muted-foreground">
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
