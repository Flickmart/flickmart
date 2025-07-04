"use client";
import Loader from "@/components/multipage/Loader";
import useCheckUser from "@/hooks/useCheckUser";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const loading = useCheckUser();
  if (loading)
    return (
      <div className="h-screen grid place-items-center">
        <Loader />;
      </div>
    );

  return (
    <SidebarProvider className="lg:min-h-[calc(100svh-72px)]">
      <div className="flex-1 overflow-auto">{children}</div>
    </SidebarProvider>
  );
}
