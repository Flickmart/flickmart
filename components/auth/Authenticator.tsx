'use client';
import type React from 'react';
import { useEffect } from 'react';
import { useOthersStore } from '@/store/useOthersStore';

export default function Authenticator({
  children,
}: {
  children: React.ReactNode;
}) {
  const setLoadingStatus = useOthersStore((state) => state.setLoadingStatus);

  useEffect(() => {
    // Just set loading to false immediately
    setLoadingStatus(false);
  }, []);

  // Always render the children without authentication checks
  return <>{children}</>;
}
