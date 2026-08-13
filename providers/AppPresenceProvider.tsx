'use client';

import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useAppPresence } from '@/hooks/useAppPresence';

// Mounted once, site-wide, in the root layout (see providers/providers.tsx)
// so the current user's presence heartbeat stays alive on every route, not
// just whichever page happens to render it.
function PresenceHeartbeat({ userId }: { userId: string }) {
  useAppPresence(userId);
  return null;
}

export function AppPresenceProvider() {
  const user = useQuery(api.users.current, {});

  // Wait for a real user id before starting the heartbeat -- mounting
  // PresenceHeartbeat only once it's known avoids ever calling usePresence
  // with an id that's still loading.
  if (!user?._id) {
    return null;
  }

  return <PresenceHeartbeat userId={user._id} />;
}
