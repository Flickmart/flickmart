"use client";
import { Spinner } from "@/components/Spinner";
import { useAuthUser } from "@/hooks/useAuthUser";
import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, isLoading, isAuthenticated } = useAuthUser();
  
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will be redirected by useAuthUser
  }
  return <>{children}</>;
}
