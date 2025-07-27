"use client";
import Loader from "@/components/multipage/Loader";
import { useAuthUser } from "@/hooks/useAuthUser";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading, isAuthenticated } = useAuthUser();
  
  if (isLoading) {
    return (
      <div className="h-screen grid place-items-center">
        <Loader />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will be redirected by useAuthUser
  }

  return <SidebarProvider>{children}</SidebarProvider>;
}
