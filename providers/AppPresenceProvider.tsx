'use client';

import { useAuth } from '@clerk/nextjs';
import usePresence from '@convex-dev/presence/react';
import { api } from '../convex/_generated/api';
import { useEffect } from 'react';

interface AppPresenceProviderProps {
  children: React.ReactNode;
}

export function AppPresenceProvider({ children }: AppPresenceProviderProps) {
  const { isSignedIn, userId } = useAuth();

  console.log('Clerk userId', userId);
  console.log('isSignedIn', isSignedIn);

  // Use the Convex Presence Component for app-wide presence
  const presenceState = usePresence(
    api.presence,
    'app-wide', // Room ID for the entire app
    userId || 'anonymous'
  );

  // Log presence state for debugging (remove in production)
  useEffect(() => {
    if (isSignedIn && userId) {
      console.log('App presence state:', presenceState);
    }
  }, [presenceState, isSignedIn, userId]);

  return <>{children}</>;
}
