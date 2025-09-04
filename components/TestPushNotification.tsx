"use client";

import { useMutation } from "convex/react";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { usePushNotifications } from "@/providers/PushNotificationProvider";

export function TestPushNotification() {
  const { user } = useUser();
  const { isSubscribed, permission } = usePushNotifications();
  const sendTestNotification = useMutation(
    api.notifications.createTestNotificationWithPush
  );

  const handleTestNotification = async () => {
    if (!user?.id) {
      alert("Please log in to test notifications");
      return;
    }

    if (!isSubscribed) {
      alert("Please enable push notifications first");
      return;
    }

    try {
      await sendTestNotification({
        type: "advertisement",
        title: "Test Notification",
        content: "This is a test notification from FlickMart! 🎉",
        link: "/",
        sendPush: true,
      });

      alert("Test notification sent successfully! Check your notifications.");
    } catch (error) {
      console.error("Error sending test notification:", error);
      alert("Error sending test notification");
    }
  };

  const getStatusText = () => {
    if (permission === "granted" && isSubscribed) {
      return "✅ Subscribed and ready";
    } else if (permission === "granted" && !isSubscribed) {
      return "⚠️ Permission granted but not subscribed";
    } else if (permission === "denied") {
      return "❌ Permission denied";
    } else {
      return "⏳ Permission not requested";
    }
  };

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="font-semibold mb-2">Test Push Notifications</h3>
      <p className="text-sm text-gray-600 mb-4">Status: {getStatusText()}</p>
      <Button
        onClick={handleTestNotification}
        disabled={!isSubscribed || !user}
      >
        Send Test Notification
      </Button>
    </div>
  );
}
