"use client";

import { usePushNotifications } from "@/providers/PushNotificationProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Bell, BellOff, Smartphone, AlertCircle } from "lucide-react";
import { DeviceSubscriptions } from "./DeviceSubscriptions";
import { PushNotificationTest } from "./PushNotificationTest";
import { toast } from "sonner";

export function NotificationSettings() {
  const {
    isSupported,
    permission,
    isSubscribed,
    isLoading,
    promptForPermission,
    subscribe,
    unsubscribe,
  } = usePushNotifications();

  const handleToggleNotifications = async () => {
    try {
      if (isSubscribed) {
        await unsubscribe();
        toast.success("Push notifications disabled for this device");
      } else {
        const success = await subscribe();
        if (success) {
          toast.success("Push notifications enabled for this device");
        }
      }
    } catch (error) {
      toast.error("Failed to update notification settings");
      console.error("Error toggling notifications:", error);
    }
  };

  const getPermissionBadge = () => {
    switch (permission) {
      case "granted":
        return <Badge className="bg-green-100 text-green-800">Allowed</Badge>;
      case "denied":
        return <Badge variant="destructive">Blocked</Badge>;
      case "default":
        return <Badge variant="secondary">Not Asked</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  if (!isSupported) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BellOff className="h-5 w-5" />
            Push Notifications Not Supported
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-muted-foreground">
            <AlertCircle className="h-4 w-4" />
            Your browser doesn't support push notifications.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Current Device Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            This Device
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="push-notifications">Push Notifications</Label>
              <div className="text-sm text-muted-foreground">
                Receive notifications on this device
              </div>
            </div>
            <div className="flex items-center gap-2">
              {getPermissionBadge()}
              <Switch
                id="push-notifications"
                checked={isSubscribed}
                onCheckedChange={handleToggleNotifications}
                disabled={isLoading || permission === "denied"}
              />
            </div>
          </div>

          {permission === "denied" && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <div className="flex items-center gap-2 text-destructive text-sm">
                <AlertCircle className="h-4 w-4" />
                Notifications are blocked. Please enable them in your browser
                settings.
              </div>
            </div>
          )}

          {permission === "default" && !isSubscribed && (
            <Button
              onClick={promptForPermission}
              disabled={isLoading}
              className="w-full"
            >
              <Bell className="h-4 w-4 mr-2" />
              Enable Notifications
            </Button>
          )}

          <div className="text-xs text-muted-foreground">
            Browser: {navigator.userAgent.split(" ")[0]} • Platform:{" "}
            {navigator.platform}
          </div>
        </CardContent>
      </Card>

      {/* All Devices */}
      <DeviceSubscriptions />

      {/* Test Notifications */}
      <PushNotificationTest />
    </div>
  );
}
