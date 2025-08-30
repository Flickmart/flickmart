"use client";

import { useState } from "react";
import { Bell, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePushNotifications } from "@/providers/PushNotificationProvider";

export function PushNotificationPrompt() {
  const [isDismissed, setIsDismissed] = useState(false);
  const { isSupported, permission, promptForPermission, isLoading } =
    usePushNotifications();

  // Don't show if not supported, already granted, loading, or dismissed
  if (!isSupported || isLoading || permission !== "default" || isDismissed) {
    return null;
  }

  const handleEnable = async () => {
    try {
      await promptForPermission();
    } catch (error) {
      console.log("User declined notifications");
    }
    setIsDismissed(true);
  };

  const handleDismiss = () => {
    setIsDismissed(true);
  };

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <Bell className="h-5 w-5 text-blue-500" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
            Stay Updated
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Enable notifications to get alerts about messages, orders, and
            updates.
          </p>
          <div className="flex gap-2 mt-3">
            <Button size="sm" onClick={handleEnable} className="text-xs">
              Enable
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleDismiss}
              className="text-xs"
            >
              Maybe Later
            </Button>
          </div>
        </div>
        <button
          type="button"
          onClick={handleDismiss}
          className="flex-shrink-0 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
