"use client";
import { useOthersStore } from "@/store/useOthersStore";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function Authenticator({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const setLoadingStatus = useOthersStore((state) => state.setLoadingStatus);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(
    function () {
      try {
        setLoadingStatus(true);

        // Retrieve from local storage
        const session = JSON.parse(localStorage.getItem("session")!);
        const user = JSON.parse(localStorage.getItem("user")!);

        if (!session && user?.role !== "authenticated") {
          router.push("/sign-in");
        } else {
          setIsAuthenticated(true);
        }
      } finally {
        setLoadingStatus(false);
      }
    },

    []
  );

  if (!isAuthenticated) {
    return null;
  } else {
    return <>{children}</>;
  }
}
