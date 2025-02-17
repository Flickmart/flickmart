"use client";
import { retrieveUserSession } from "@/app/(auth-pages)/auth";
import { useOthersStore } from "@/store/useOthersStore";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

export default function Authenticator({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const setLoadingStatus = useOthersStore((state) => state.setLoadingStatus);

  useEffect(function () {
    async function authenticate() {
      try {
        setLoadingStatus(true);
        const data = await retrieveUserSession();
        console.log(data);

        if (!data.session && data.user?.role !== "authenticated") {
          router.push("/sign-in");
        }
      } finally {
        setLoadingStatus(false);
      }
    }

    authenticate();
  }, []);
  return <>{children}</>;
}
