'use client';
import type React from 'react';
import { Spinner } from '@/components/Spinner';
import { useAuthUser } from '@/hooks/useAuthUser';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, isLoading, isAuthenticated } = useAuthUser();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will be redirected by useAuthUser
  }
  return <>{children}</>;
}
