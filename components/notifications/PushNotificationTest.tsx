'use client';

import { useUser } from '@clerk/nextjs';
import { useMutation, useQuery } from 'convex/react';
import { TestTube } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { api } from '@/convex/_generated/api';

export function PushNotificationTest() {
  const { user: clerkUser } = useUser();
  const convexUser = useQuery(api.users.current);
  const sendTestNotification = useMutation(
    api.notifications.createTestNotificationWithPush
  );

  const handleTestNotification = async () => {
    if (!(clerkUser && convexUser)) {
      toast.error('Please sign in to test notifications');
      return;
    }

    try {
      await sendTestNotification({
        type: 'advertisement',
        title: 'Test Notification 🚀',
        content: 'This is a test push notification from FlickMart!',
        link: '/notifications',
        sendPush: true,
      });

      toast.success('Test notification sent! Check your notifications.');
    } catch (error) {
      console.error('Failed to send test notification:', error);
      toast.error('Failed to send test notification');
    }
  };

  const handleDirectNotification = async () => {
    console.log('🔔 Testing direct browser notification...');
    console.log('Current permission:', Notification.permission);
    console.log('Notification support:', 'Notification' in window);

    try {
      // Check if notifications are supported
      if (!('Notification' in window)) {
        throw new Error('This browser does not support notifications');
      }

      // Request permission if not already granted
      if (Notification.permission === 'default') {
        console.log('📝 Requesting notification permission...');
        const permission = await Notification.requestPermission();
        console.log('Permission result:', permission);

        if (permission !== 'granted') {
          toast.error(`Permission ${permission}. Please allow notifications.`);
          return;
        }
      } else if (Notification.permission === 'denied') {
        toast.error(
          'Notifications are blocked. Please enable them in browser settings.'
        );
        console.log('❌ Notifications are denied');
        return;
      }

      console.log('✅ Permission granted, creating notification...');

      // Test direct browser notification
      const notification = new Notification('Direct Test Notification 🧪', {
        body: 'This is a direct browser notification test - it should appear now!',
        icon: '/icon-192x192.png',
        badge: '/badge-72x72.png',
        tag: 'direct-test',
        requireInteraction: false,
        silent: false,
      });

      // Add event listeners for debugging
      notification.onshow = () => {
        console.log('✅ Notification shown successfully!');
      };

      notification.onclick = () => {
        console.log('✅ Notification clicked!');
        notification.close();
      };

      notification.onerror = (error) => {
        console.error('❌ Notification error:', error);
      };

      notification.onclose = () => {
        console.log('🔒 Notification closed');
      };

      // Auto close after 5 seconds
      setTimeout(() => {
        notification.close();
      }, 5000);

      console.log('✅ Direct notification created successfully');
      toast.success('Direct notification created! Check if it appeared.');
    } catch (error: any) {
      console.error('❌ Direct notification failed:', error);
      toast.error(`Direct notification failed: ${error.message}`);
    }
  };

  const handleServiceWorkerCheck = async () => {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.getRegistration();
        const subscription = await registration?.pushManager.getSubscription();

        console.log('🔧 Service Worker Registration:', registration);
        console.log('📱 Push Subscription:', subscription);
        console.log(
          '🔑 VAPID Public Key:',
          process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
        );
        console.log('🔔 Notification Permission:', Notification.permission);
        console.log('🌐 Push Manager Support:', 'PushManager' in window);

        if (registration) {
          console.log('✅ Service Worker State:', registration.active?.state);
          console.log('📍 Service Worker Scope:', registration.scope);
        }

        toast.success('Check console for detailed service worker info');
      } catch (error) {
        console.error('❌ Service worker check failed:', error);
        toast.error('Service worker check failed');
      }
    } else {
      toast.error('Service workers not supported');
    }
  };

  const handleManualSubscribe = async () => {
    try {
      console.log('🚀 Starting manual subscription process...');

      // Check VAPID key
      if (!process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY) {
        throw new Error('VAPID public key is missing');
      }

      // Request permission
      const permission = await Notification.requestPermission();
      console.log('🔔 Permission result:', permission);

      if (permission !== 'granted') {
        throw new Error('Notification permission denied');
      }

      // Get service worker registration
      let registration = await navigator.serviceWorker.getRegistration();
      if (!registration) {
        console.log('📝 Registering service worker...');
        registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/',
          updateViaCache: 'none',
        });
      }

      // Wait for service worker to be ready
      await navigator.serviceWorker.ready;
      console.log('✅ Service worker ready');

      // Convert VAPID key
      const vapidKey = urlBase64ToUint8Array(
        process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
      );
      console.log('🔑 VAPID key converted:', vapidKey);

      // Subscribe to push notifications
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: vapidKey,
      });

      console.log('✅ Push subscription created:', subscription);
      toast.success('Manual subscription successful! Check console.');
    } catch (error: any) {
      console.error('❌ Manual subscription failed:', error);
      toast.error(`Manual subscription failed: ${error.message}`);
    }
  };

  const handlePermissionCheck = async () => {
    console.log('🔍 Checking notification permissions and support...');

    const info = {
      notificationSupport: 'Notification' in window,
      currentPermission: Notification.permission,
      serviceWorkerSupport: 'serviceWorker' in navigator,
      pushManagerSupport: 'PushManager' in window,
      isSecureContext: window.isSecureContext,
      protocol: window.location.protocol,
      userAgent: navigator.userAgent.substring(0, 100) + '...',
    };

    console.table(info);

    if (Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      console.log('🔔 New permission:', permission);
      toast.success(`Permission: ${permission}. Check console for details.`);
    } else {
      toast.success(
        `Current permission: ${Notification.permission}. Check console for details.`
      );
    }
  };

  // Helper function to convert VAPID key
  const urlBase64ToUint8Array = (base64String: string): Uint8Array => {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  };

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <Card className="border-orange-200 border-dashed bg-orange-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-orange-700">
          <TestTube className="h-5 w-5" />
          Push Notification Test
        </CardTitle>
        <CardDescription className="text-orange-600">
          Development tool to test push notifications
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Button
            className="w-full border-red-300 text-red-700 hover:bg-red-100"
            onClick={handlePermissionCheck}
            variant="outline"
          >
            🔍 Check Permissions & Support
          </Button>
          <Button
            className="w-full border-blue-300 text-blue-700 hover:bg-blue-100"
            onClick={handleDirectNotification}
            variant="outline"
          >
            🧪 Test Direct Browser Notification
          </Button>
          <Button
            className="w-full border-green-300 text-green-700 hover:bg-green-100"
            onClick={handleServiceWorkerCheck}
            variant="outline"
          >
            🔧 Check Service Worker Status
          </Button>
          <Button
            className="w-full border-purple-300 text-purple-700 hover:bg-purple-100"
            onClick={handleManualSubscribe}
            variant="outline"
          >
            📱 Manual Push Subscribe (Debug)
          </Button>
          <Button
            className="w-full border-orange-300 text-orange-700 hover:bg-orange-100"
            onClick={handleTestNotification}
            variant="outline"
          >
            🚀 Send Test Notification (via Server)
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
