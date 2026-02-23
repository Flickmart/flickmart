'use client';
import { useQuery } from 'convex/react';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import * as z from 'zod';
import Loader from '@/components/multipage/Loader';
import BusinessSettings from '@/components/settings/business';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import { api } from 'backend/convex/_generated/api';

const businessFormSchema = z.object({
  businessName: z.string().min(1, 'Business name is required'),
  description: z
    .string()
    .min(10, 'You must type a minimum of 10 characters')
    .max(250, 'You can only type a maximum of 250 characters'),
  location: z.string().min(1, 'Address is required'),
  contactNumber: z.string().min(1, 'Contact number is required'),
  businessProfile: z.string().min(1, 'Add a business logo'),
});

type BusinessFormValues = z.infer<typeof businessFormSchema>;

export default function BusinessDetailsPage() {
  const userStore = useQuery(api.store.getStoresByUserId);
  const router = useRouter();

  useEffect(() => {
    // When User store variable becomes defined
    if (userStore?.error?.status === 404) {
      router.push('/create-store');
    }
  }, [userStore]);

  if (userStore?.error?.status === 404) {
    return (
      <div className="grid h-screen place-items-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-4">
      <header className="flex h-20 items-center px-4 shadow-md">
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
              <BreadcrumbPage>Business</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>
      <BusinessSettings />
    </div>
  );
}
