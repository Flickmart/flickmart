'use client';

import { useAppPresence } from '@/hooks/useAppPresence';

export function AppPresenceProvider() {
  useAppPresence();

  return null;
}
