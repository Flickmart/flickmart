"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { retrieveUserSession } from "@/app/(auth-pages)/auth";
import useUserStore from "@/store/useUserStore";
import { AppSidebar } from "@/components/settings/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const updateUserInfo = useUserStore((state) => state.updateUserInfo);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { user } = await retrieveUserSession();
        if (!user) {
          console.log("No User");
          router.push("/sign-in");
          return;
        }
        console.log(user);
        updateUserInfo(user);
      } catch (error) {
        console.error("Error checking session:", error);
        router.push("/sign-in");
      }
    };

    checkSession();
  }, [router]);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex-1 overflow-auto">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}