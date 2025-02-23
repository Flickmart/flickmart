"use client";
import { useState } from "react";
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
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function PrivacyPage() {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [adPersonalization, setAdPersonalization] = useState(true);
  const [cookieTracking, setCookieTracking] = useState(true);

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
              <BreadcrumbPage>Privacy & Security</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4">
        <Tabs defaultValue="security" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="security">Account Security</TabsTrigger>
            <TabsTrigger value="privacy">Privacy Controls</TabsTrigger>
            <TabsTrigger value="data">Data Protection</TabsTrigger>
          </TabsList>

          <TabsContent value="security" className="space-y-4">
            <div className="rounded-lg border p-4 space-y-4">
              <h2 className="text-lg font-semibold">Two-Factor Authentication</h2>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Enable 2FA</p>
                  <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                </div>
                <Switch checked={twoFactorEnabled} onCheckedChange={setTwoFactorEnabled} />
              </div>
              {twoFactorEnabled && (
                <Button variant="outline" className="w-full mt-2">
                  Set up 2FA
                </Button>
              )}

              <div className="flex items-center justify-between pt-4">
                <div>
                  <p className="font-medium">Biometric Login</p>
                  <p className="text-sm text-muted-foreground">Use Face ID or Fingerprint to log in</p>
                </div>
                <Switch checked={biometricEnabled} onCheckedChange={setBiometricEnabled} />
              </div>

              <div className="pt-4">
                <Button variant="outline" className="w-full">
                  View Login Activity
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="privacy" className="space-y-4">
            <div className="rounded-lg border p-4 space-y-4">
              <h2 className="text-lg font-semibold">Notification Preferences</h2>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-muted-foreground">Receive updates via email</p>
                </div>
                <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
              </div>

              <div className="flex items-center justify-between pt-4">
                <div>
                  <p className="font-medium">Push Notifications</p>
                  <p className="text-sm text-muted-foreground">Receive mobile push notifications</p>
                </div>
                <Switch checked={pushNotifications} onCheckedChange={setPushNotifications} />
              </div>

              <div className="flex items-center justify-between pt-4">
                <div>
                  <p className="font-medium">Ad Personalization</p>
                  <p className="text-sm text-muted-foreground">Allow personalized advertising</p>
                </div>
                <Switch checked={adPersonalization} onCheckedChange={setAdPersonalization} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="data" className="space-y-4">
            <div className="rounded-lg border p-4 space-y-4">
              <h2 className="text-lg font-semibold">Data Protection</h2>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Cookie Tracking</p>
                  <p className="text-sm text-muted-foreground">Allow cookie tracking for better experience</p>
                </div>
                <Switch checked={cookieTracking} onCheckedChange={setCookieTracking} />
              </div>

              <div className="pt-4 space-y-2">
                <Button variant="outline" className="w-full">
                  Download My Data
                </Button>
                <Button variant="outline" className="w-full">
                  Delete Account
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}