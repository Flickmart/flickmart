"use client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { useIsMobile } from "@/hooks/use-mobile";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

export default function page() {
  const router = useRouter();
  const isMobile = useIsMobile();
  return (
    <div className="w-full">
      {isMobile && (
        <header className="flex shadow-md  h-20 shrink-0 items-center   px-4">
          <ChevronLeft
            className="cursor-pointer size-7"
            onClick={() => router.back()}
          />
          <Separator orientation="vertical" className="mr-2 h-4" />
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
      <div className="text-xl text-gray-600 h-[80vh] grid place-items-center font-semibold">
        <span>Coming Soon...</span>
      </div>
    </div>
  );
}
