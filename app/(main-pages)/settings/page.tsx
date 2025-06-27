"use client";

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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartSpline,
  Store,
  Palette,
  Activity,
  UserCog,
  ShieldCheck,
  Languages,
  Bell,
  HelpCircle,
  MessageSquare,
  Info,
} from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Loader from "@/components/multipage/Loader";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const user = useQuery(api.users.current);
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/sign-in");
    }
  }, [user]);
  if (!user)
    return (
      <div className="h-screen grid place-items-center">
        <Loader />
      </div>
    );
  return (
    <div>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-6">
        {/* <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" /> */}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Settings</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>
      <div className="flex flex-1 flex-col gap-6 p-6">
        <h1 className="text-2xl font-bold">Settings Dashboard</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Main Settings */}
          {/* <Card>
            <CardHeader className="flex flex-row items-center gap-2">
              <ChartSpline className="h-5 w-5" />
              <div>
                <CardTitle>Analytics</CardTitle>
                <CardDescription>
                  View your sales and performance metrics
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <a
                href="/settings/analytics"
                className="text-sm text-blue-600 hover:underline"
              >
                Manage analytics settings →
              </a>
            </CardContent>
          </Card> */}

          <Card>
            <CardHeader className="flex flex-row items-center gap-2">
              <Store className="h-5 w-5" />
              <div>
                <CardTitle>Products</CardTitle>
                <CardDescription>
                  Manage your product listings and inventory
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <a
                href="/settings/products"
                className="text-sm text-blue-600 hover:underline"
              >
                Manage product settings →
              </a>
            </CardContent>
          </Card>

          {/* Display & Appearance */}
          <Card>
            <CardHeader className="flex flex-row items-center gap-2">
              <Palette className="h-5 w-5" />
              <div>
                <CardTitle>Theme Settings</CardTitle>
                <CardDescription>
                  Customize the look and feel of your interface
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <a
                href="/settings/appearance"
                className="text-sm text-blue-600 hover:underline"
              >
                Manage appearance settings →
              </a>
            </CardContent>
          </Card>

          {/* <Card>
            <CardHeader className="flex flex-row items-center gap-2">
              <Activity className="h-5 w-5" />
              <div>
                <CardTitle>Accessibility</CardTitle>
                <CardDescription>Configure accessibility preferences</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <a href="/settings/accessibility" className="text-sm text-blue-600 hover:underline">Manage accessibility settings →</a>
            </CardContent>
          </Card> */}

          {/* Account Settings */}
          <Card>
            <CardHeader className="flex flex-row items-center gap-2">
              <UserCog className="h-5 w-5" />
              <div>
                <CardTitle>Personal Details</CardTitle>
                <CardDescription>
                  Update your personal information
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <a
                href="/settings/personal"
                className="text-sm text-blue-600 hover:underline"
              >
                Manage personal details →
              </a>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center gap-2">
              <Store className="h-5 w-5" />
              <div>
                <CardTitle>Business Details</CardTitle>
                <CardDescription>
                  Update your business information
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <a
                href="/settings/business"
                className="text-sm text-blue-600 hover:underline"
              >
                Manage business details →
              </a>
            </CardContent>
          </Card>

          {/* <Card>
            <CardHeader className="flex flex-row items-center gap-2">
              <ShieldCheck className="h-5 w-5" />
              <div>
                <CardTitle>Privacy & Security</CardTitle>
                <CardDescription>Manage your privacy and security settings</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <a href="/settings/privacy" className="text-sm text-blue-600 hover:underline">Manage privacy settings →</a>
            </CardContent>
          </Card> */}

          {/* Preferences */}
          {/* <Card>
            <CardHeader className="flex flex-row items-center gap-2">
              <Languages className="h-5 w-5" />
              <div>
                <CardTitle>Language & Region</CardTitle>
                <CardDescription>Set your preferred language and region</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <a href="/settings/language" className="text-sm text-blue-600 hover:underline">Manage language settings →</a>
            </CardContent>
          </Card> */}

          <Card>
            <CardHeader className="flex flex-row items-center gap-2">
              <Bell className="h-5 w-5" />
              <div>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>
                  Configure your notification preferences
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <a
                href="/settings/notifications"
                className="text-sm text-blue-600 hover:underline"
              >
                Manage notification settings →
              </a>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
