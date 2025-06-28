import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function useCheckUser() {
  const user = useQuery(api.users.current);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(
    function () {
      // User Still Fetching
      if (user === undefined) {
        setLoading(true);
        return;
      }

      // No User Found, redirect to signin
      if (user === null) {
        toast("Oops! You need to be logged in to continue.", {
          duration: 3000,
          position: "top-center",
          description: "Redirecting you to Sign In Page...",
          icon: "🔃",
        });
        return router.push("/sign-in");
      }

      setLoading(false);
    },
    [user]
  );

  return loading;
}
