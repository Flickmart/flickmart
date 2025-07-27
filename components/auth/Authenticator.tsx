"use client";
import { useOthersStore } from "@/store/useOthersStore";
import React, { useEffect } from "react";

export default function Authenticator({
  children,
}: {
  children: React.ReactNode;
}) {
  const setLoadingStatus = useOthersStore((state) => state.setLoadingStatus);

  useEffect(() => {
    // Just set loading to false immediately
    setLoadingStatus(false);
  }, []);

  // Always render the children without authentication checks
  return <>{children}</>;
}
