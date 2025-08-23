'use client';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import { useIsMobile } from '@/hooks/use-mobile';

export default function page() {
  const router = useRouter();
  const isMobile = useIsMobile();
  return (
    <div className="w-full">
      {isMobile && (
        <header className="flex h-20 shrink-0 items-center px-4 shadow-md">
          <ChevronLeft
            className="size-7 cursor-pointer"
            onClick={() => router.back()}
          />
          <Separator className="mr-2 h-4" orientation="vertical" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <Link href="/settings">Settings</Link>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Analytics</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
      )}
      <div className="grid h-[80vh] place-items-center font-semibold text-gray-600 text-xl">
        <span>Coming Soon...</span>
      </div>
    </div>
  );
}
