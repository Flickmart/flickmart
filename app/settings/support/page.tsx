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
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { ArrowLeft } from "lucide-react";

export default function SupportPage() {
  const { isMobile, openMobile, setOpenMobile } = useSidebar();
  return (
    <div>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        {!isMobile ? (
          <SidebarTrigger className="-ml-1" />
        ) : (
          <>
            <ArrowLeft
              className="cursor-pointer -ml-1"
              onClick={() => setOpenMobile(!openMobile)}
            />
          </>
        )}
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/settings">Settings</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Contact Support</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="rounded-lg border p-4">
          <h2 className="text-lg font-semibold mb-4">Contact Support</h2>
          <p className="text-muted-foreground">
            Get in touch with our support team for assistance
          </p>
        </div>
      </div>
    </div>
  );
}
