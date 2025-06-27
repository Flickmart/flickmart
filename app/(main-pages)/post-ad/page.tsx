"use client";
import Loader from "@/components/multipage/Loader";
import PostAdForm from "@/components/post-ad/PostAdForm";
import { api } from "@/convex/_generated/api";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function Page() {
  const queryClient = new QueryClient();
  const [clear, setClear] = useState<boolean>(false);
  const router = useRouter();

  const user = useQuery(api.users.current);

  useEffect(
    function () {
      if (!user) {
        router.push("/sign-in");
      }
    },
    [user, router]
  );

  if (!user) return <Loader />;

  return (
    <QueryClientProvider client={queryClient}>
      <div className="bg-gray-100 p-3  lg:p-10 min-h-screen space-y-5 flex flex-col justify-center items-center">
        <div className="bg-white lg:w-5/6 w-full h-20 rounded-lg flex items-center justify-between">
          <span className="text-xl text-gray-700 font-semibold pl-7">
            Post Product
          </span>
          <span
            onClick={() => {
              setClear(true);
            }}
            className="text-red-500 font-medium pr-7 cursor-pointer"
          >
            Clear
          </span>
        </div>
        <PostAdForm clear={clear} setClear={setClear} />
      </div>
    </QueryClientProvider>
  );
}
