import Navbar from "@/components/Navbar";
import SearchInput from "@/components/SearchInput";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Suspense } from "react";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar>
        <div className="w-1/3 bg-gray-100 rounded-lg">
          <SearchInput/>
        </div>
      </Navbar>
      <SidebarProvider>
        <Suspense fallback={<div>Loading...</div>}>
          {children}
        </Suspense>
      </SidebarProvider>
    </>
  );
}
