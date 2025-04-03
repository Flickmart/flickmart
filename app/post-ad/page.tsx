"use client";
import MobileHeader from "@/components/MobileHeader";
import PostAdForm from "@/components/post-ad/PostAdForm";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";

export default function Page() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <div className="bg-gray-100 lg:p-10 min-h-screen space-y-5 flex flex-col justify-center items-center">
        <MobileHeader />
        <div className="p-3">
          <PostAdForm />
        </div>
      </div>
    </QueryClientProvider>
  );
}
