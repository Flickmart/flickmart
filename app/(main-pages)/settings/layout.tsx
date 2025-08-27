'use client';
import Loader from '@/components/multipage/Loader';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { useAuthUser } from '@/hooks/useAuthUser';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading, isAuthenticated } = useAuthUser();

  if (isLoading) {
    return (
      <div className="grid h-screen place-items-center">
        <Loader />
      </div>
    );
  }

  // if (!isAuthenticated) {
  //   return null; // Will be redirected by useAuthUser
  // }

  return <SidebarProvider>{children}</SidebarProvider>;
}
