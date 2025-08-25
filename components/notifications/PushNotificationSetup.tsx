'use client';

import { AlertCircle, Bell, BellOff, Smartphone } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { usePushNotifications } from '@/hooks/usePushNotifications';

export function PushNotificationSetup() {
  const {
    isSupported,
    isSubscribed,
    permission,
    subscribeToPush,
    unsubscribeFromPush,
  } = usePushNotifications();

  if (!isSupported) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            Push Notifications
          </CardTitle>
          <CardDescription>
            Stay updated with real-time notifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Push notifications are not supported in this browser. Please use a
              modern browser like Chrome, Firefox, or Safari.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  const getStatusText = () => {
    if (permission === 'denied') {
      return 'Notifications are blocked. Please enable them in your browser settings.';
    }
    if (isSubscribed) {
      return 'You will receive push notifications for important updates.';
    }
    return 'Enable push notifications to stay updated with messages, orders, and more.';
  };

  const getStatusColor = () => {
    if (permission === 'denied') return 'text-red-600';
    if (isSubscribed) return 'text-green-600';
    return 'text-gray-600';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {isSubscribed ? (
            <Bell className="h-5 w-5 text-green-600" />
          ) : (
            <BellOff className="h-5 w-5 text-gray-400" />
          )}
          Push Notifications
        </CardTitle>
        <CardDescription>
          Stay updated with real-time notifications
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className={`text-sm ${getStatusColor()}`}>{getStatusText()}</p>

        {permission === 'denied' && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              To enable notifications, click the lock icon in your browser's
              address bar and allow notifications for FlickMart.
            </AlertDescription>
          </Alert>
        )}

        <div className="flex gap-2">
          {!isSubscribed && permission !== 'denied' && (
            <Button
              className="flex items-center gap-2"
              onClick={subscribeToPush}
            >
              <Bell className="h-4 w-4" />
              Enable Notifications
            </Button>
          )}

          {isSubscribed && (
            <Button
              className="flex items-center gap-2"
              onClick={unsubscribeFromPush}
              variant="outline"
            >
              <BellOff className="h-4 w-4" />
              Disable Notifications
            </Button>
          )}
        </div>

        {isSubscribed && (
          <div className="space-y-1 text-gray-500 text-xs">
            <p>✓ New messages and chat updates</p>
            <p>✓ Order status changes</p>
            <p>✓ Wallet transactions</p>
            <p>✓ Product interactions</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
