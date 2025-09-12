import { useQuery } from 'convex/react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { api } from '@/convex/_generated/api';

interface UseCheckUserReturn {
  user: any;
  loading: boolean;
  isAuthenticated: boolean;
}

export default function useCheckUser(): UseCheckUserReturn {
  const user =useQuery(api.users.current, {});
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const hasRedirected = useRef(false);
  const toastShown = useRef(false);

  useEffect(() => {
    // User data is still being fetched
    if (user === undefined) {
      setLoading(true);
      return;
    }

    // User is not authenticated and we haven't redirected yet
    if (user === null && !hasRedirected.current) {
      hasRedirected.current = true;

      // Only show toast once
      if (!toastShown.current) {
        toastShown.current = true;
        toast('Oops! You need to be logged in to continue.', {
          duration: 3000,
          position: 'top-center',
          description: 'Redirecting you to Sign In Page...',
          icon: '🔃',
        });
      }

      // Use replace instead of push to prevent back button issues
      router.replace('/sign-in');
      return;
    }

    // User is authenticated
    if (user !== null) {
      setLoading(false);
      hasRedirected.current = false;
      toastShown.current = false;
    }
  }, [user, router]);

  return {
    user,
    loading,
    isAuthenticated: user !== null && user !== undefined,
  };
}
