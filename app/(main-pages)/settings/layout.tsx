"use client";

import { useRouter } from "next/navigation";

import { AppSidebar } from "@/components/settings/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  return (
    <SidebarProvider className="lg:min-h-[calc(100svh-72px)]">
      {/* <AppSidebar /> */}
      <SidebarInset>
        <div className="flex-1 overflow-auto">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
