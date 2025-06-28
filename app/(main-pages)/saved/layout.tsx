"use client";
import Loader from "@/components/multipage/Loader";
import SilentErrorBoundary from "@/components/multipage/SilentErrorBoundary";
import useCheckUser from "@/hooks/useCheckUser";

export default function Layout({ children }: { children: React.ReactNode }) {
  const loading = useCheckUser();
  if (loading) return <Loader />;
  return <SilentErrorBoundary>{children}</SilentErrorBoundary>;
}
