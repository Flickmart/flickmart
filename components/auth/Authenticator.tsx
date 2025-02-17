"use client";
import { retrieveUserSession } from "@/app/(auth-pages)/auth";
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

  useEffect(function () {
    async function authenticate() {
      try {
        setLoadingStatus(true);
        const data = await retrieveUserSession();

        if (!data.session && data.user?.role !== "authenticated") {
          router.push("/sign-in");
        } else {
          setIsAuthenticated(true);
        }
      } finally {
        setLoadingStatus(false);
      }
    }

    authenticate();
  }, []);

  if (!isAuthenticated) {
    return null;
  } else {
    return <>{children}</>;
  }
}
