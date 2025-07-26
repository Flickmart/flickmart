"use client";

import { ComponentType } from "react";
import { useAuthUser } from "@/hooks/useAuthUser";
import Loader from "@/components/multipage/Loader";

interface WithAuthOptions {
  redirectTo?: string;
  loadingComponent?: ComponentType;
}

/**
 * Higher-order component that wraps pages requiring authentication
 * Provides consistent loading states and automatic redirects
 */
export function withAuth<P extends object>(
  WrappedComponent: ComponentType<P>,
  options?: WithAuthOptions
) {
  const { redirectTo = "/sign-in", loadingComponent: LoadingComponent } = options || {};

  return function AuthenticatedComponent(props: P) {
    const { user, isLoading, isAuthenticated } = useAuthUser({
      redirectOnUnauthenticated: true,
      redirectTo,
    });

    if (isLoading) {
      if (LoadingComponent) {
        return <LoadingComponent />;
      }
      return (
        <div className="h-screen grid place-items-center">
          <Loader />
        </div>
      );
    }

    if (!isAuthenticated) {
      return null; // Will be redirected by useAuthUser
    }

    // Pass user as a prop to the wrapped component
    return <WrappedComponent {...props} user={user} />;
  };
}

export default withAuth;