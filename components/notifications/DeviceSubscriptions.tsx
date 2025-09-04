"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuthUser } from "@/hooks/useAuthUser";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trash2, Smartphone, Monitor, Tablet } from "lucide-react";
import { toast } from "sonner";

export function DeviceSubscriptions() {
  const { user } = useAuthUser();
  const subscriptions = useQuery(
    api.notifications.getAllPushSubscriptions,
    user ? { userId: user._id } : "skip"
  );
  const removeSubscription = useMutation(
    api.notifications.removePushSubscriptionByEndpoint
  );
  const cleanupInactive = useMutation(
    api.notifications.cleanupInactiveSubscriptions
  );

  const handleRemoveSubscription = async (
    endpoint: string,
    deviceInfo?: any
  ) => {
    try {
      await removeSubscription({ endpoint });
      toast.success(
        `Removed notifications for ${deviceInfo?.platform || "Unknown"} device`
      );
    } catch (error) {
      toast.error("Failed to remove subscription");
      console.error("Error removing subscription:", error);
    }
  };

  const handleCleanupInactive = async () => {
    try {
      const result = await cleanupInactive({ olderThanDays: 30 });
      toast.success(`Cleaned up ${result.cleaned} inactive subscriptions`);
    } catch (error) {
      toast.error("Failed to cleanup subscriptions");
      console.error("Error cleaning up subscriptions:", error);
    }
  };

  const getDeviceIcon = (deviceType?: string) => {
    switch (deviceType?.toLowerCase()) {
      case "mobile":
        return <Smartphone className="h-4 w-4" />;
      case "tablet":
        return <Tablet className="h-4 w-4" />;
      default:
        return <Monitor className="h-4 w-4" />;
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!user) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Device Notifications</CardTitle>
        {subscriptions && subscriptions.length > 1 && (
          <Button variant="outline" size="sm" onClick={handleCleanupInactive}>
            Cleanup Old
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {!subscriptions ? (
          <div className="text-center py-4 text-muted-foreground">
            Loading subscriptions...
          </div>
        ) : subscriptions.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground">
            No devices are set up for notifications.
            <br />
            <span className="text-sm">
              Allow notifications on this device to get started.
            </span>
          </div>
        ) : (
          <div className="space-y-3">
            {subscriptions
              .filter((subscription) => subscription.endpoint) // Only show subscriptions with endpoints
              .map((subscription) => (
                <div
                  key={subscription._id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    {getDeviceIcon(subscription.deviceInfo?.deviceType)}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          {subscription.deviceInfo?.platform ||
                            "Unknown Device"}
                        </span>
                        <Badge variant="secondary" className="text-xs">
                          {subscription.deviceInfo?.browser || "Unknown"}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {subscription.deviceInfo?.deviceType || "Desktop"}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Added: {formatDate(subscription.createdAt)}
                        {subscription.lastUsed && (
                          <span className="ml-2">
                            • Last used: {formatDate(subscription.lastUsed)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      if (subscription.endpoint) {
                        handleRemoveSubscription(
                          subscription.endpoint,
                          subscription.deviceInfo
                        );
                      } else {
                        toast.error(
                          "Cannot remove subscription: missing endpoint"
                        );
                      }
                    }}
                    disabled={!subscription.endpoint}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
