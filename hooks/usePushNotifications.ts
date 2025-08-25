'use client';

import { useUser } from '@clerk/nextjs';
import { useMutation } from 'convex/react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { api } from '@/convex/_generated/api';

export function usePushNotifications() {
  const { user } = useUser();
  const [isSupported, setIsSupported] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [permission, setPermission] =
    useState<NotificationPermission>('default');

  const saveSubscription = useMutation(api.notifications.savePushSubscription);

  useEffect(() => {
    // Check if push notifications are supported
    const supported = 'serviceWorker' in navigator && 'PushManager' in window;
    setIsSupported(supported);

    if (supported) {
      setPermission(Notification.permission);
      checkSubscriptionStatus();
    }
  }, []);

  const checkSubscriptionStatus = async () => {
    try {
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.getRegistration();
        if (registration) {
          const subscription = await registration.pushManager.getSubscription();
          setIsSubscribed(!!subscription);
        }
      }
    } catch (error) {
      console.error('Error checking subscription status:', error);
    }
  };

  const registerServiceWorker = async () => {
    if ('serviceWorker' in navigator) {
      try {
        // Check if already registered
        let registration = await navigator.serviceWorker.getRegistration('/');

        if (registration) {
          console.log('✅ Service worker already registered');
          // Force update check
          registration.update();
        } else {
          console.log('📝 Registering new service worker...');
          registration = await navigator.serviceWorker.register('/sw.js', {
            scope: '/',
            updateViaCache: 'none',
          });
        }

        console.log('Service Worker registration:', registration);
        return registration;
      } catch (error) {
        console.error('Service Worker registration failed:', error);
        throw error;
      }
    }
    throw new Error('Service Worker not supported');
  };

  const subscribeToPush = async () => {
    try {
      console.log('🚀 Starting push notification subscription...');

      if (!isSupported) {
        throw new Error('Push notifications are not supported in this browser');
      }

      if (!user) {
        throw new Error('User not authenticated');
      }

      if (!process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY) {
        throw new Error('VAPID public key is not configured');
      }

      console.log('🔔 Requesting notification permission...');
      // Request permission
      const permission = await Notification.requestPermission();
      setPermission(permission);

      if (permission !== 'granted') {
        throw new Error('Notification permission denied');
      }

      console.log('📝 Registering service worker...');
      // Register service worker
      const registration = await registerServiceWorker();

      // Wait for service worker to be ready
      console.log('⏳ Waiting for service worker to be ready...');
      await navigator.serviceWorker.ready;

      console.log('🔑 Converting VAPID key...');
      const vapidKey = urlBase64ToUint8Array(
        process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
      );

      console.log('📱 Subscribing to push notifications...');
      // Subscribe to push notifications
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: vapidKey,
      });

      console.log('✅ Push subscription created:', subscription);

      console.log('💾 Saving subscription to database...');
      // Save subscription to Convex
      await saveSubscription({
        subscription: JSON.stringify(subscription),
        userAgent: navigator.userAgent,
      });

      setIsSubscribed(true);
      toast.success('Push notifications enabled successfully!');

      return subscription;
    } catch (error: any) {
      console.error('❌ Failed to subscribe to push notifications:', error);
      toast.error(error.message || 'Failed to enable push notifications');
      throw error;
    }
  };

  const unsubscribeFromPush = async () => {
    try {
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.getRegistration();
        if (registration) {
          const subscription = await registration.pushManager.getSubscription();
          if (subscription) {
            await subscription.unsubscribe();
            setIsSubscribed(false);
            toast.success('Push notifications disabled');
          }
        }
      }
    } catch (error) {
      console.error('Failed to unsubscribe from push notifications:', error);
      toast.error('Failed to disable push notifications');
    }
  };

  return {
    isSupported,
    isSubscribed,
    permission,
    subscribeToPush,
    unsubscribeFromPush,
    checkSubscriptionStatus,
  };
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
