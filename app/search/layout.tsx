import { Suspense } from 'react';
import Navbar from '@/components/Navbar';
import { SidebarProvider } from '@/components/ui/sidebar';

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <SidebarProvider>
        <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
      </SidebarProvider>
    </>
  );
}
