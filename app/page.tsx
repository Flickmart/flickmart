"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function page() {
  const router = useRouter();
  useEffect(function () {
    router.push("/home");
  }, []);
  return null;
}
