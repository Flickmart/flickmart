"use client";
import Loader from "@/components/multipage/Loader";
import SilentErrorBoundary from "@/components/multipage/SilentErrorBoundary";
import { useAuthUser } from "@/hooks/useAuthUser";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, isLoading, isAuthenticated } = useAuthUser();
  
  if (isLoading) return <Loader />;
  if (!isAuthenticated) return null; // Will be redirected by useAuthUser
  return <SilentErrorBoundary>{children}</SilentErrorBoundary>;
}
