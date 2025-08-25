'use client';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger, useSidebar } from '@/components/ui/sidebar';

export default function SupportPage() {
  const { isMobile, openMobile, setOpenMobile } = useSidebar();
  return (
    <div>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <ArrowLeft
          className="-ml-1 cursor-pointer"
          onClick={() => setOpenMobile(!openMobile)}
        />
        <Separator className="mr-2 h-4" orientation="vertical" />
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
        <div className="space-y-5 rounded-lg border p-4 text-center">
          <h2 className="mb-4 font-semibold text-lg">Contact Support</h2>
          <p className="text-muted-foreground">
            Get in touch with our support team for assistance
          </p>
          <Button className="h-10 w-full">Go to Contact page</Button>
        </div>
      </div>
    </div>
  );
}
