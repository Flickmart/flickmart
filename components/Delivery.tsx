'use client';

import Image from 'next/image';
import { usePathname } from 'next/navigation';
import React from 'react';
import { toast } from 'sonner';
import { Button } from './ui/button';

export default function Delivery() {
  const pathname = usePathname();

  // Pages where SearchBox should not be shown
  const hiddenPages = [
    '/sign-in',
    '/sign-up',
    '/forgot-password',
    '/notifications',
    '/settings',
    'post-ad',
    '/create-store',
    '/saved',
    '/chat',
  ];

  if (hiddenPages.includes(pathname)) {
    return null; // Don't render any component
  }
  return (
    <div className="justify-between gap-8 bg-flickmartLight lg:flex lg:h-96">
      <Image
        alt="delivery"
        className="h-full w-full object-cover lg:w-5/12"
        height={500}
        priority
        src="/delivery.png"
        width={500}
      />
      <div className="flex flex-grow items-center capitalize">
        <div className="flex flex-col justify-center space-y-4 p-7 lg:space-y-7 lg:p-5">
          <h2 className="font-bold text-2xl text-red-950 uppercase lg:text-3xl">
            delivery services
          </h2>
          <div className="flex flex-col space-y-2">
            <h3 className="text-xl normal-case lg:text-2xl">
              Become a delivery partner with us.
            </h3>
            <p className="">bringing your orders right to your doorstep</p>
            <span>quick services - no delays</span>
          </div>

          <Button
            className="w-2/4 bg-black py-5 capitalize"
            onClick={() => toast.success('Coming Soon...')}
          >
            apply now
          </Button>
        </div>
      </div>
    </div>
  );
}
