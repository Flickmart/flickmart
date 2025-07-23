"use client";
import { useSearchParams, useRouter } from "next/navigation";

import SecureKeypad from "@/components/chats/secure-keypad";
import useCheckUser from "@/hooks/useCheckUser";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import Loader from "@/components/multipage/Loader";

export default function TransferPage() {
  const params = useSearchParams();
  const router = useRouter();
  const vendorId = params.get("vendorId") as Id<"users"> | null;
  const user = useQuery(api.users.current);
  const loading = useCheckUser();
  if (user?._id === vendorId) {
    toast.info("You cannot transfer to yourself", {
      duration: 3000,
      position: "top-center",
      description: "Redirecting you to Chat Page...",
      icon: "🔃",
    });
    return router.push("/chats");
  }

  if (!vendorId) {
    toast.error("Vendor is required for transfer ", {
      duration: 3000,
      position: "top-center",
      description: "Redirecting you to Chat Page...",
      icon: "❗",
    });
    return router.push("/chats");
  }

  if (loading)
    return (
      <div className="h-screen grid place-items-center">
        <Loader />
      </div>
    );
  return (
    <div>
      <SecureKeypad sellerId={vendorId} />
    </div>
  );
}
