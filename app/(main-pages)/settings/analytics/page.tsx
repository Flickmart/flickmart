"use client";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

export default function page() {
  const router = useRouter();
  return (
    <>
      <div className="flex items-center p-5 gap-2 text-gray-600">
        <ArrowLeft
          className="cursor-pointer size-7 "
          onClick={() => router.push("/settings")}
        />
      </div>
      <div className="text-xl text-gray-600 h-[90vh] grid place-items-center font-semibold">
        <span>Coming Soon...</span>
      </div>
    </>
  );
}
