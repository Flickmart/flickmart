"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";

import SecureKeypad from "@/components/chats/secure-keypad";
import { useAuthUser } from "@/hooks/useAuthUser";
import { Id } from "@/convex/_generated/dataModel";
import { toast } from "sonner";
import Loader from "@/components/multipage/Loader";

export default function TransferPage() {
  const params = useSearchParams();
  const router = useRouter();
  const vendorId = params.get("vendorId") as Id<"users">;
  const { user, isLoading, isAuthenticated } = useAuthUser();

  useEffect(() => {
    // Only run validation after authentication is confirmed
    if (!isLoading && isAuthenticated) {
      if (user?._id === vendorId) {
        toast.info("You cannot transfer to yourself", {
          duration: 3000,
          position: "top-center",
          description: "Redirecting you to Chat Page...",
          icon: "🔃",
        });
        router.push("/chat");
        return;
      }

      if (!vendorId) {
        toast.error("Vendor is required for transfer ", {
          duration: 3000,
          position: "top-center",
          description: "Redirecting you to Chat Page...",
          icon: "❗",
        });
        router.push("/chat");
        return;
      }
    }
  }, [isLoading, isAuthenticated, user?._id, vendorId, router]);

  if (isLoading) {
    return (
      <div className="h-screen grid place-items-center">
        <Loader />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will be redirected by useAuthUser
  }

  return (
    <div>
      <SecureKeypad sellerId={vendorId} />
    </div>
  );
}
