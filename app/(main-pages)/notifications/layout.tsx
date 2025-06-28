"use client";
import { Spinner } from "@/components/Spinner";
import useCheckUser from "@/hooks/useCheckUser";
import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const loading = useCheckUser();
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }
  return <>{children}</>;
}
