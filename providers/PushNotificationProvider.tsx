/** biome-ignore-all lint/performance/useTopLevelRegex: <its just a side regex it won't chnage> */
/** biome-ignore-all lint/style/noMagicNumbers: <small constants> */
'use client';

import { useUser } from '@clerk/nextjs';
import { useMutation } from 'convex/react';
import { createContext, useContext, useEffect, useState } from 'react';
import { api } from '@/convex/_generated/api';

interface PushNotificationContextType {
  isSupported: boolean;
  permission: NotificationPermission | null;
  isSubscribed: boolean;
  isLoading: boolean;
  promptForPermission: () => Promise<boolean>;
  subscribe: () => Promise<boolean>;
  unsubscribe: () => Promise<boolean>;
}

const PushNotificationContext =
  createContext<PushNotificationContextType | null>(null);

export function usePushNotifications() {
  const context = useContext(PushNotificationContext);
  if (!context) {
    throw new Error(
      'usePushNotifications must be used within PushNotificationProvider'
    );
  }
  return context;
}

interface PushNotificationProviderProps {
  children: React.ReactNode;
}

export function PushNotificationProvider({
  children,
}: PushNotificationProviderProps) {
  const { user } = useUser();
  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission | null>(
    null
  );
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const savePushSubscription = useMutation(
    api.notifications.savePushSubscription
  );
  const removePushSubscriptionByEndpoint = useMutation(
    api.notifications.removePushSubscriptionByEndpoint
  );

  // Check if push notifications are supported
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const supported = 'serviceWorker' in navigator && 'PushManager' in window;
      setIsSupported(supported);

      if (supported) {
        setPermission(Notification.permission);
        checkSubscriptionStatus();
      } else {
        setIsLoading(false);
      }
    }
  }, [user]); // Add user dependency to recheck when user changes

  // Prompt for permission immediately when user visits (if not already asked)
  useEffect(() => {
    const promptForNotifications = () => {
      if (!(isSupported && user) || isLoading) {
        return;
      }

      // Only prompt if permission hasn't been asked before and user is not subscribed on this device
      if (permission === 'default' && !isSubscribed) {
        // Small delay to ensure page is loaded
        setTimeout(async () => {
          try {
            await promptForPermission();
          } catch (error) {
            console.log('User declined notification permission:', error);
          }
        }, 2000); // 2 second delay
      }
    };

    promptForNotifications();
  }, [isSupported, user, permission, isLoading, isSubscribed]);

  const checkSubscriptionStatus = async () => {
    try {
      if (!('serviceWorker' in navigator && user)) {
        setIsLoading(false);
        return;
      }

      const registration = await navigator.serviceWorker.ready;

      // Check if registration is valid before proceeding
      if (!registration) {
        console.error('Service worker registration not available');
        setIsLoading(false);
        return;
      }

      const subscription = await registration.pushManager.getSubscription();

      if (subscription) {
        setIsSubscribed(true);
      } else {
        setIsSubscribed(false);
      }

      setIsLoading(false);
    } catch (error) {
      console.error('Error checking subscription status:', error);
      setIsLoading(false);
    }
  };

  const promptForPermission = async (): Promise<boolean> => {
    try {
      if (!isSupported) {
        throw new Error('Push notifications are not supported');
      }

      // biome-ignore lint/nursery/noShadow: <it dosent affect it>
      const permission = await Notification.requestPermission();
      setPermission(permission);

      if (permission === 'granted') {
        return await subscribe();
      }

      return false;
    } catch (error) {
      console.error('Error requesting permission:', error);
      throw error;
    }
  };

  const subscribe = async (): Promise<boolean> => {
    try {
      if (!(isSupported && user)) {
        throw new Error(
          'Cannot subscribe: not supported or user not logged in'
        );
      }

      if (permission !== 'granted') {
        const newPermission = await Notification.requestPermission();
        setPermission(newPermission);

        if (newPermission !== 'granted') {
          throw new Error('Permission denied');
        }
      }

      // Ensure service worker is registered
      const { getServiceWorkerRegistration } = await import(
        '@/lib/serviceWorker'
      );
      const registration = await getServiceWorkerRegistration();
      if (!registration) {
        throw new Error('Service worker not available');
      }

      // Check if registration is valid before proceeding
      if (!registration) {
        throw new Error('Service worker registration failed');
      }

      // Subscribe to push notifications
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          // biome-ignore lint/style/noNonNullAssertion: <It woukd always be available i can asssert>
          process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
        ),
      });

      // Detect device information
      const deviceInfo = {
        platform: navigator.platform || 'Unknown',
        browser: getBrowserInfo(),
        deviceType: getDeviceType(),
      };

      // Save subscription to database
      const result = await savePushSubscription({
        subscription: JSON.stringify(subscription),
        userAgent: navigator.userAgent,
        deviceInfo,
      });

      console.log(
        result.isNew
          ? '✅ New device subscription created'
          : '🔄 Existing device subscription updated'
      );

      setIsSubscribed(true);
      return true;
    } catch (error) {
      console.error('Error subscribing to push notifications:', error);
      throw error;
    }
  };

  const unsubscribe = async (): Promise<boolean> => {
    try {
      if (!('serviceWorker' in navigator)) {
        return false;
      }

      const registration = await navigator.serviceWorker.ready;

      // Check if registration is valid before proceeding
      if (!registration) {
        throw new Error('Service worker registration not available');
      }

      const subscription = await registration.pushManager.getSubscription();

      if (!subscription) {
        // No subscription exists, but still update state
        setIsSubscribed(false);
        return true;
      }

      // First unsubscribe from the browser
      const browserUnsubscribed = await subscription.unsubscribe();
      if (!browserUnsubscribed) {
        throw new Error('Failed to unsubscribe from browser');
      }

      // Then remove the subscription record from backend
      try {
        await removePushSubscriptionByEndpoint({
          endpoint: subscription.endpoint,
        });
      } catch (backendError) {
        console.error(
          'Error removing subscription from backend:',
          backendError
        );
        // Re-throw to let caller handle the error
        const errorMessage =
          backendError instanceof Error
            ? backendError.message
            : String(backendError);
        throw new Error(`Backend cleanup failed: ${errorMessage}`);
      }

      // Only update state after both browser and backend cleanup succeed
      setIsSubscribed(false);
      return true;
    } catch (error) {
      console.error('Error unsubscribing from push notifications:', error);
      throw error;
    }
  };

  const value: PushNotificationContextType = {
    isSupported,
    permission,
    isSubscribed,
    isLoading,
    promptForPermission,
    subscribe,
    unsubscribe,
  };

  return (
    <PushNotificationContext.Provider value={value}>
      {children}
    </PushNotificationContext.Provider>
  );
}

// Helper function to convert VAPID key
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

// Helper function to detect browser
function getBrowserInfo(): string {
  const userAgent = navigator.userAgent;

  if (userAgent.includes('Chrome') && !userAgent.includes('Edg')) {
    return 'Chrome';
  }
  if (userAgent.includes('Firefox')) {
    return 'Firefox';
  }
  if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
    return 'Safari';
  }
  if (userAgent.includes('Edg')) {
    return 'Edge';
  }
  if (userAgent.includes('Opera') || userAgent.includes('OPR')) {
    return 'Opera';
  }

  return 'Unknown';
}

// Helper function to detect device type
function getDeviceType(): string {
  const userAgent = navigator.userAgent;

  if (/tablet|ipad|playbook|silk/i.test(userAgent)) {
    return 'Tablet';
  }
  if (
    /mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/i.test(
      userAgent
    )
  ) {
    return 'Mobile';
  }

  return 'Desktop';
}
