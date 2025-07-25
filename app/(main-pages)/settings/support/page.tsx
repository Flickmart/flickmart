"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function SupportPage() {
  const { isMobile, openMobile, setOpenMobile } = useSidebar();
  return (
    <div>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <ArrowLeft
          className="cursor-pointer -ml-1"
          onClick={() => setOpenMobile(!openMobile)}
        />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <Link href="/settings">Settings</Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Contact Support</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="rounded-lg text-center space-y-5 border p-4">
          <h2 className="text-lg font-semibold mb-4">Contact Support</h2>
          <p className="text-muted-foreground">
            Get in touch with our support team for assistance
          </p>
          <Button className="w-full h-10">Go to Contact page</Button>
        </div>
      </div>
    </div>
  );
}
