import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

interface UseAuthUserReturn {
  user: any;
  isLoading: boolean;
  isAuthenticated: boolean;
  isError: boolean;
}

/**
 * Enhanced hook for user authentication with better loading states and error handling
 * This hook handles the user authentication state more reliably than useCheckUser
 */
export function useAuthUser(options?: { 
  redirectOnUnauthenticated?: boolean;
  redirectTo?: string;
}): UseAuthUserReturn {
  const { 
    redirectOnUnauthenticated = true, 
    redirectTo = "/sign-in" 
  } = options || {};
  
  const user = useQuery(api.users.current);
  const router = useRouter();
  const hasRedirected = useRef(false);
  const toastShown = useRef(false);

  const isLoading = user === undefined;
  const isAuthenticated = user !== null && user !== undefined;
  const isError = user === null;

  useEffect(() => {
    // Don't redirect if we're still loading or if redirect is disabled
    if (isLoading || !redirectOnUnauthenticated) {
      return;
    }

    // User is not authenticated and we haven't redirected yet
    if (isError && !hasRedirected.current) {
      hasRedirected.current = true;
      
      // Only show toast once
      if (!toastShown.current) {
        toastShown.current = true;
        toast("Oops! You need to be logged in to continue.", {
          duration: 3000,
          position: "top-center",
          description: "Redirecting you to Sign In Page...",
          icon: "🔃",
        });
      }
      
      // Use replace instead of push to prevent back button issues
      router.replace(redirectTo);
      return;
    }

    // Reset redirect flags when user becomes authenticated
    if (isAuthenticated) {
      hasRedirected.current = false;
      toastShown.current = false;
    }
  }, [isLoading, isError, isAuthenticated, redirectOnUnauthenticated, redirectTo, router]);

  return {
    user,
    isLoading,
    isAuthenticated,
    isError
  };
}

export default useAuthUser;