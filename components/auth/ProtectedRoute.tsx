'use client';

import type { ReactNode } from 'react';
import Loader from '@/components/multipage/Loader';
import { useAuthUser } from '@/hooks/useAuthUser';

interface ProtectedRouteProps {
  children: ReactNode;
  redirectTo?: string;
  fallback?: ReactNode;
  requireAuth?: boolean;
}

/**
 * Component that protects routes requiring authentication
 * More flexible than HOC approach, can be used inline
 */
export function ProtectedRoute({
  children,
  redirectTo = '/sign-in',
  fallback,
  requireAuth = true,
}: ProtectedRouteProps) {
  const { user, isLoading, isAuthenticated } = useAuthUser({
    redirectOnUnauthenticated: requireAuth,
    redirectTo,
  });

  if (isLoading) {
    if (fallback) {
      return <>{fallback}</>;
    }
    return (
      <div className="grid h-screen place-items-center">
        <Loader />
      </div>
    );
  }

  if (requireAuth && !isAuthenticated) {
    return null; // Will be redirected by useAuthUser
  }

  return <>{children}</>;
}

export default ProtectedRoute;
