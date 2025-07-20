"use client";
import Loader from "@/components/multipage/Loader";
import useCheckUser from "@/hooks/useCheckUser";

export default function Layout({ children }: { children: React.ReactNode }) {
  const loading = useCheckUser();
  if (loading) return <Loader />;
  return <>{children}</>;
}
