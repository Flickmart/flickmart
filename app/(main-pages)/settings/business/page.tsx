"use client";
import * as z from "zod";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { useSidebar } from "@/components/ui/sidebar";
import BusinessSettings from "@/components/settings/business";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import Loader from "@/components/multipage/Loader";
const businessFormSchema = z.object({
  businessName: z.string().min(1, "Business name is required"),
  description: z
    .string()
    .min(10, "You must type a minimum of 10 characters")
    .max(250, "You can only type a maximum of 250 characters"),
  location: z.string().min(1, "Address is required"),
  contactNumber: z.string().min(1, "Contact number is required"),
  businessProfile: z.string().min(1, "Add a business logo"),
});

type BusinessFormValues = z.infer<typeof businessFormSchema>;

export default function BusinessDetailsPage() {
  const userStore = useQuery(api.store.getStoresByUserId);
  const router = useRouter();

  useEffect(() => {
    // When User store variable becomes defined
    if (userStore?.error?.status === 404) {
      router.push("/create-store");
    }
  }, [userStore]);

  if (userStore?.error?.status === 404) {
    return (
      <div className="h-screen grid place-items-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 w-full ">
      <header className=" flex shadow-md h-20 px-4 items-center">
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
              <BreadcrumbPage>Business</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>
      <BusinessSettings />
    </div>
  );
}
