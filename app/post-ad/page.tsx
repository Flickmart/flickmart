"use client";
import PostAdForm from "@/components/post-ad/PostAdForm";
import React from "react";

export default function Page() {

  return (
      <div className="bg-gray-100 p-3  lg:p-10 min-h-screen space-y-5 flex flex-col justify-center items-center">
        <div className="bg-white lg:w-5/6 w-full h-20 rounded-lg flex items-center justify-between">
          <span className="text-xl text-gray-700 font-semibold pl-7">
            Post Product
          </span>
          <span className="text-red-500 font-medium pr-7 cursor-pointer">
            Clear
          </span>
        </div>
        <PostAdForm />
      </div>
  );
}
