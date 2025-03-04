"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { retrieveUserSession } from "./(auth-pages)/auth";
import Loader from "@/components/Loader";

export default function page() {
  const router = useRouter();

  useEffect(function () {
    async function setUerAndSession() {
      // Retrieve User data and Session
      const data = await retrieveUserSession();

      if (data.user && data.session) {
        // Store  in local storage
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("session", JSON.stringify(data.session));

        // Redirect to home
        router.push("/home");
      } else {
        router.push("/sign-in");
      }
    }

    setUerAndSession();
  }, []);
  return <Loader open={true} />;
}
