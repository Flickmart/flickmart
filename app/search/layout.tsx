import { Suspense } from 'react';
import Navbar from '@/components/Navbar';
import SearchInput from '@/components/SearchInput';
import { SidebarProvider } from '@/components/ui/sidebar';

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar>
        <div className="w-[40vw] rounded-lg bg-gray-100">
          <SearchInput />
        </div>
      </Navbar>
      <SidebarProvider>
        <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
      </SidebarProvider>
    </>
  );
}
