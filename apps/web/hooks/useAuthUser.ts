import { useAuth } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { api } from "backend/convex/_generated/api";
import type { Doc } from "backend/convex/_generated/dataModel";

// Type for the user document from Convex
type ConvexUser = Doc<"users">;

type UseAuthUserReturn = {
  user: ConvexUser | null | undefined;
  isLoading: boolean;
  isAuthenticated: boolean;
  isError: boolean;
};

/**
 * Enhanced hook for user authentication with better loading states and error handling
 * This hook handles the user authentication state more reliably than useCheckUser
 * It prioritizes Clerk's loading state since Convex queries depend on Clerk being ready
 */
export function useAuthUser({
  redirectOnUnauthenticated = true,
  redirectTo = "/sign-in",
}: {
  redirectOnUnauthenticated?: boolean;
  redirectTo?: string;
} = {}): UseAuthUserReturn {
  const { isLoaded: clerkLoaded, isSignedIn } = useAuth();
  const user = useQuery(api.users.current, {});
  const router = useRouter();
  const hasRedirected = useRef(false);
  const toastShown = useRef(false);

  // Primary focus on Clerk loading state since Convex queries depend on it
  const isLoading =
    !clerkLoaded || (clerkLoaded && isSignedIn && user === undefined);
  const isAuthenticated =
    clerkLoaded && isSignedIn && user !== null && user !== undefined;
  const isError = clerkLoaded && (!isSignedIn || user === null);

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
        toast.info("Oops! You need to be logged in to continue.", {
          duration: 3000,
          position: "top-center",
          description: "Redirecting you to Sign In Page...",
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
  }, [
    isLoading,
    isError,
    isAuthenticated,
    redirectOnUnauthenticated,
    redirectTo,
    router,
  ]);

  return {
    user,
    isLoading,
    isAuthenticated,
    isError,
  };
}

export default useAuthUser;
