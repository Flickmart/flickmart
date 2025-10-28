'use client';

import { useUser } from '@clerk/nextjs';
import { useMutation } from 'convex/react';
import { Button } from '@/components/ui/button';
import { api } from '@/convex/_generated/api';
import { usePushNotifications } from '@/providers/PushNotificationProvider';

export function TestPushNotification() {
  const { user } = useUser();
  const { isSubscribed, permission } = usePushNotifications();
  const sendTestNotification = useMutation(
    api.notifications.createTestNotificationWithPush
  );

  const handleTestNotification = async () => {
    if (!user?.id) {
      alert('Please log in to test notifications');
      return;
    }

    if (!isSubscribed) {
      alert('Please enable push notifications first');
      return;
    }

    try {
      await sendTestNotification({
        type: 'advertisement',
        title: 'Test Notification',
        content: 'This is a test notification from FlickMart! 🎉',
        link: '/',
        sendPush: true,
      });

      alert('Test notification sent successfully! Check your notifications.');
    } catch (error) {
      console.error('Error sending test notification:', error);
      alert('Error sending test notification');
    }
  };

  const getStatusText = () => {
    if (permission === 'granted' && isSubscribed) {
      return '✅ Subscribed and ready';
    }
    if (permission === 'granted' && !isSubscribed) {
      return '⚠️ Permission granted but not subscribed';
    }
    if (permission === 'denied') {
      return '❌ Permission denied';
    }
    return '⏳ Permission not requested';
  };

  return (
    <div className="rounded-lg border p-4">
      <h3 className="mb-2 font-semibold">Test Push Notifications</h3>
      <p className="mb-4 text-gray-600 text-sm">Status: {getStatusText()}</p>
      <Button
        disabled={!(isSubscribed && user)}
        onClick={handleTestNotification}
      >
        Send Test Notification
      </Button>
    </div>
  );
}
