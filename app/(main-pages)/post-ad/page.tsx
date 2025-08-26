'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { useState } from 'react';
import MobileNav from '@/components/MobileNav';
import Loader from '@/components/multipage/Loader';
import PostAdForm from '@/components/post-ad/PostAdForm';
import { useAuthUser } from '@/hooks/useAuthUser';

export default function Page() {
  const queryClient = new QueryClient();
  const [clear, setClear] = useState<boolean>(false);
  const { user, isLoading, isAuthenticated } = useAuthUser();

  if (isLoading) return <Loader />;
  if (!isAuthenticated) return null; // Will be redirected by useAuthUser

  return (
    <QueryClientProvider client={queryClient}>
      <MobileNav />
      <div className="flex min-h-screen flex-col items-center justify-center space-y-5 bg-gray-100 p-3 lg:p-10">
        <div className="flex h-20 w-full items-center justify-between rounded-lg bg-white lg:w-5/6">
          <span className="pl-7 font-semibold text-gray-700 text-xl">
            Post Product
          </span>
          <span
            className="cursor-pointer pr-7 font-medium text-red-500"
            onClick={() => {
              setClear(true);
            }}
          >
            Clear
          </span>
        </div>
        <PostAdForm clear={clear} setClear={setClear} />
      </div>
    </QueryClientProvider>
  );
}
