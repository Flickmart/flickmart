import  usePresence  from '@convex-dev/presence/react';
import { api } from '../convex/_generated/api';
import { useAuth } from '@clerk/nextjs';

export function useAppPresence() {
  const { isSignedIn, userId } = useAuth();
  
  const presenceState = usePresence(
    api.presence,
    'app-wide',
    userId || 'anonymous'
  );

  const onlineUsers = presenceState?.filter(p => p.userId !== userId) || [];
  const isOnline = presenceState?.some(p => p.userId === userId) || false;

  return {
    presenceState,
    onlineUsers,
    isOnline,
    totalOnlineUsers: presenceState?.length || 0,
  };
}
