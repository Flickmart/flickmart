'use client';

import { useMutation, useQuery } from 'convex/react';
import { Monitor, Smartphone, Tablet, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { api } from '@/convex/_generated/api';
import { useAuthUser } from '@/hooks/useAuthUser';

export function DeviceSubscriptions() {
  const { user } = useAuthUser();
  const subscriptions = useQuery(
    api.notifications.getAllPushSubscriptions,
    user ? { userId: user._id } : 'skip'
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
        `Removed notifications for ${deviceInfo?.platform || 'Unknown'} device`
      );
    } catch (error) {
      toast.error('Failed to remove subscription');
      console.error('Error removing subscription:', error);
    }
  };

  const handleCleanupInactive = async () => {
    try {
      const result = await cleanupInactive({ olderThanDays: 30 });
      toast.success(`Cleaned up ${result.cleaned} inactive subscriptions`);
    } catch (error) {
      toast.error('Failed to cleanup subscriptions');
      console.error('Error cleaning up subscriptions:', error);
    }
  };

  const getDeviceIcon = (deviceType?: string) => {
    switch (deviceType?.toLowerCase()) {
      case 'mobile':
        return <Smartphone className="h-4 w-4" />;
      case 'tablet':
        return <Tablet className="h-4 w-4" />;
      default:
        return <Monitor className="h-4 w-4" />;
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
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
          <Button onClick={handleCleanupInactive} size="sm" variant="outline">
            Cleanup Old
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {subscriptions ? (
          subscriptions.length === 0 ? (
            <div className="py-4 text-center text-muted-foreground">
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
                    className="flex items-center justify-between rounded-lg border p-3"
                    key={subscription._id}
                  >
                    <div className="flex items-center gap-3">
                      {getDeviceIcon(subscription.deviceInfo?.deviceType)}
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            {subscription.deviceInfo?.platform ||
                              'Unknown Device'}
                          </span>
                          <Badge className="text-xs" variant="secondary">
                            {subscription.deviceInfo?.browser || 'Unknown'}
                          </Badge>
                          <Badge className="text-xs" variant="outline">
                            {subscription.deviceInfo?.deviceType || 'Desktop'}
                          </Badge>
                        </div>
                        <div className="text-muted-foreground text-sm">
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
                      className="text-destructive hover:text-destructive"
                      disabled={!subscription.endpoint}
                      onClick={() => {
                        if (subscription.endpoint) {
                          handleRemoveSubscription(
                            subscription.endpoint,
                            subscription.deviceInfo
                          );
                        } else {
                          toast.error(
                            'Cannot remove subscription: missing endpoint'
                          );
                        }
                      }}
                      size="sm"
                      variant="ghost"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
            </div>
          )
        ) : (
          <div className="py-4 text-center text-muted-foreground">
            Loading subscriptions...
          </div>
        )}
      </CardContent>
    </Card>
  );
}
