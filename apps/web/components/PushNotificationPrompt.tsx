'use client';

import { Bell, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { usePushNotifications } from '@/providers/PushNotificationProvider';

export function PushNotificationPrompt() {
  const [isDismissed, setIsDismissed] = useState(false);
  const { isSupported, permission, promptForPermission, isLoading } =
    usePushNotifications();

  // Don't show if not supported, already granted, loading, or dismissed
  if (!isSupported || isLoading || permission !== 'default' || isDismissed) {
    return null;
  }

  const handleEnable = async () => {
    try {
      await promptForPermission();
    } catch (_error) {
      console.log('User declined notifications');
    }
    setIsDismissed(true);
  };

  const handleDismiss = () => {
    setIsDismissed(true);
  };

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm rounded-lg border border-gray-200 bg-white p-4 shadow-lg dark:border-gray-700 dark:bg-gray-800">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <Bell className="h-5 w-5 text-blue-500" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-medium text-gray-900 text-sm dark:text-gray-100">
            Stay Updated
          </p>
          <p className="mt-1 text-gray-500 text-sm dark:text-gray-400">
            Enable notifications to get alerts about messages, orders, and
            updates.
          </p>
          <div className="mt-3 flex gap-2">
            <Button className="text-xs" onClick={handleEnable} size="sm">
              Enable
            </Button>
            <Button
              className="text-xs"
              onClick={handleDismiss}
              size="sm"
              variant="ghost"
            >
              Maybe Later
            </Button>
          </div>
        </div>
        <button
          className="flex-shrink-0 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
          onClick={handleDismiss}
          type="button"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
