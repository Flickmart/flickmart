"use client";

import Loader from "@/components/multipage/Loader";
import useCheckUser from "@/hooks/useCheckUser";
import { ReactNode } from "react";
import { useEffect, useState } from "react";

const layout = ({ children }: { children: ReactNode }) => {
  const [mounted, setMounted] = useState(false);
  const loading = useCheckUser();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }
  if (loading) {
    return <Loader />;
  }
  if (typeof window !== "undefined") {
    return <>{children}</>;
  }
};
export default layout;
