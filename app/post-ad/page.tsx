"use client";
import MobileHeader from "@/components/MobileHeader";
import PostAdForm from "@/components/post-ad/PostAdForm";
import { Id } from "@/convex/_generated/dataModel";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { useState } from "react";

export default function Page() {
  const queryClient = new QueryClient();
  const [clear, setClear]= useState<boolean>(false)
  return (
    <QueryClientProvider client={queryClient}>
      <div className="bg-gray-100 p-3  lg:p-10 min-h-screen space-y-5 flex flex-col justify-center items-center">
        <div className="bg-white lg:w-5/6 w-full h-20 rounded-lg flex items-center justify-between">
          <span className="text-xl text-gray-700 font-semibold pl-7">
            Post Product
          </span>
          <span onClick={() => {
            setClear(true)
            }
          } 
            className="text-red-500 font-medium pr-7 cursor-pointer">
            Clear
          </span>
        </div>
        <PostAdForm clear={clear} setClear={setClear}/>
      </div>
    </QueryClientProvider>
  );
}
