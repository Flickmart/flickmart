"use client";
import React, { useEffect } from "react";
import { MoonLoader, SyncLoader } from "react-spinners";
import { toast } from "sonner";

export default function Loader() {
  useEffect(() => {
    toast("This action requires user to be Logged In...", {
      duration: 3000,
      position: "top-center",
      description: "Redirecting you to Sign In Page...",
      icon: <MoonLoader size={15} />,
    });
  }, []);
  return (
    <div className="backdrop-blur-md h-[80vh]  flex justify-center items-center">
      <SyncLoader color="#FF8100" />
    </div>
  );
}
