"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default function NotificationsPage() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [inAppNotifications, setInAppNotifications] = useState(true);
  const [whatsappNotifications, setWhatsappNotifications] = useState(false);
  const [orderUpdates, setOrderUpdates] = useState(true);
  const [promotions, setPromotions] = useState(true);
  const [dndMode, setDndMode] = useState(false);
  const [dndStartTime, setDndStartTime] = useState("22:00");
  const [dndEndTime, setDndEndTime] = useState("08:00");

  return (
    <div>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
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
      <div className="flex flex-1 flex-col gap-4 p-4">
        <Tabs defaultValue="channels" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="channels">Notification Channels</TabsTrigger>
            <TabsTrigger value="preferences">Notification Preferences</TabsTrigger>
          </TabsList>

          <TabsContent value="channels" className="space-y-4">
            <div className="rounded-lg border p-4 space-y-4">
              <h2 className="text-lg font-semibold">Communication Channels</h2>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-muted-foreground">Receive marketing & transactional emails</p>
                </div>
                <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
              </div>

              <div className="flex items-center justify-between pt-4">
                <div>
                  <p className="font-medium">SMS Notifications</p>
                  <p className="text-sm text-muted-foreground">Receive OTPs and delivery updates via SMS</p>
                </div>
                <Switch checked={smsNotifications} onCheckedChange={setSmsNotifications} />
              </div>

              <div className="flex items-center justify-between pt-4">
                <div>
                  <p className="font-medium">Push Notifications</p>
                  <p className="text-sm text-muted-foreground">Receive alerts on your device</p>
                </div>
                <Switch checked={pushNotifications} onCheckedChange={setPushNotifications} />
              </div>

              <div className="flex items-center justify-between pt-4">
                <div>
                  <p className="font-medium">In-App Notifications</p>
                  <p className="text-sm text-muted-foreground">Show notifications in the app</p>
                </div>
                <Switch checked={inAppNotifications} onCheckedChange={setInAppNotifications} />
              </div>

              <div className="flex items-center justify-between pt-4">
                <div>
                  <p className="font-medium">WhatsApp Notifications</p>
                  <p className="text-sm text-muted-foreground">Receive updates via WhatsApp</p>
                </div>
                <Switch checked={whatsappNotifications} onCheckedChange={setWhatsappNotifications} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="preferences" className="space-y-4">
            <div className="rounded-lg border p-4 space-y-4">
              <h2 className="text-lg font-semibold">Notification Categories</h2>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Order Updates</p>
                  <p className="text-sm text-muted-foreground">Updates about your orders and deliveries</p>
                </div>
                <Switch checked={orderUpdates} onCheckedChange={setOrderUpdates} />
              </div>

              <div className="flex items-center justify-between pt-4">
                <div>
                  <p className="font-medium">Promotions & Offers</p>
                  <p className="text-sm text-muted-foreground">Marketing updates and special offers</p>
                </div>
                <Switch checked={promotions} onCheckedChange={setPromotions} />
              </div>

              <div className="border-t mt-4 pt-4">
                <h3 className="text-lg font-semibold mb-4">Do Not Disturb</h3>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="font-medium">Enable DND Mode</p>
                    <p className="text-sm text-muted-foreground">Mute notifications during specific hours</p>
                  </div>
                  <Switch checked={dndMode} onCheckedChange={setDndMode} />
                </div>
                {dndMode && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="dndStart" className="text-sm font-medium">Start Time</label>
                      <input
                        id="dndStart"
                        type="time"
                        value={dndStartTime}
                        onChange={(e) => setDndStartTime(e.target.value)}
                        className="w-full p-2 border rounded-md"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="dndEnd" className="text-sm font-medium">End Time</label>
                      <input
                        id="dndEnd"
                        type="time"
                        value={dndEndTime}
                        onChange={(e) => setDndEndTime(e.target.value)}
                        className="w-full p-2 border rounded-md"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="border-t mt-4 pt-4">
                <Button variant="outline" className="w-full">
                  Unsubscribe from All Marketing Emails
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}