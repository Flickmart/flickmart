# Multi-Device Push Notifications

This document explains the multi-device push notification system implemented in Flickmart.

## Overview

The system allows users to receive push notifications on multiple devices. When a user logs in on a new device, they will be prompted to enable notifications for that device, and the subscription will be saved alongside their existing device subscriptions.

## Key Features

- **Multi-Device Support**: Users can have push notifications enabled on multiple devices
- **Device Detection**: Automatically detects device type (Mobile, Tablet, Desktop) and browser
- **Automatic Prompting**: Prompts for notification permission on new devices
- **Subscription Management**: Users can view and manage all their device subscriptions
- **Graceful Degradation**: Handles invalid/expired subscriptions automatically
- **Testing Tools**: Built-in tools for testing push notifications

## Architecture

### Database Schema

The `pushSubscriptions` table supports multiple subscriptions per user:

```typescript
pushSubscriptions: {
  userId: Id<"users">,
  subscription: string, // JSON stringified subscription object
  endpoint: string, // Unique endpoint for this subscription
  userAgent?: string,
  deviceInfo?: {
    platform?: string,
    browser?: string,
    deviceType?: string,
  },
  createdAt: number,
  lastUsed?: number,
  isActive?: boolean, // Track if subscription is still valid
}
```

### Key Components

1. **PushNotificationProvider** (`providers/PushNotificationProvider.tsx`)
   - Manages push notification state and permissions
   - Handles device detection and subscription creation
   - Automatically prompts for permissions on new devices

2. **NotificationSettings** (`components/notifications/NotificationSettings.tsx`)
   - Main settings interface for push notifications
   - Shows current device status and controls

3. **DeviceSubscriptions** (`components/notifications/DeviceSubscriptions.tsx`)
   - Lists all user's device subscriptions
   - Allows removing individual device subscriptions
   - Shows device information and last used timestamps

4. **PushNotificationTest** (`components/notifications/PushNotificationTest.tsx`)
   - Testing interface for sending test notifications
   - Useful for development and user verification

### Convex Functions

#### Mutations

- `savePushSubscription`: Creates or updates a device subscription
- `removePushSubscriptionByEndpoint`: Removes a specific device subscription
- `cleanupInactiveSubscriptions`: Removes old inactive subscriptions
- `migratePushSubscriptions`: One-time migration for existing data

#### Queries

- `getAllPushSubscriptions`: Gets all active subscriptions for a user
- `getCurrentDeviceSubscription`: Gets subscription for current device
- `getPushSubscription`: Gets first active subscription (legacy compatibility)

#### Actions

- `sendPushNotification`: Sends push notifications to all user devices

## User Flow

1. **First Visit**: User visits the app and is prompted for notification permission after 2 seconds
2. **Permission Granted**: Subscription is created with device information
3. **New Device**: User logs in on a new device and is prompted again
4. **Multiple Devices**: User can manage all their device subscriptions in settings
5. **Notifications**: When a notification is sent, it goes to all active devices

## Device Detection

The system automatically detects:

- **Platform**: `navigator.platform` (Windows, macOS, Linux, etc.)
- **Browser**: Chrome, Firefox, Safari, Edge, Opera
- **Device Type**: Mobile, Tablet, Desktop (based on user agent)

## Error Handling

- **Invalid Subscriptions**: Automatically marked as inactive when push fails
- **Expired Subscriptions**: Handled gracefully with cleanup
- **Permission Denied**: Clear messaging and guidance for users
- **Unsupported Browsers**: Graceful degradation with appropriate messaging

## Testing

### Manual Testing

1. Go to `/settings/notifications`
2. Use the "Test Push Notifications" section
3. Send test notifications to verify delivery

### Development Testing

```typescript
// Send a test notification
await createTestNotificationWithPush({
  type: "new_message",
  title: "Test Notification",
  content: "This is a test!",
  sendPush: true,
});
```

## Migration

For existing installations, run the migration to update old subscriptions:

```typescript
// In Convex dashboard or admin interface
await migratePushSubscriptions({});
```

## Environment Variables

Required environment variables:

- `NEXT_PUBLIC_VAPID_PUBLIC_KEY`: VAPID public key for push notifications
- `VAPID_PRIVATE_KEY`: VAPID private key (server-side only)

## Best Practices

1. **Permission Timing**: Don't prompt immediately on page load - wait for user engagement
2. **Clear Messaging**: Explain the value of notifications before requesting permission
3. **Graceful Degradation**: Handle unsupported browsers and denied permissions
4. **Cleanup**: Regularly clean up inactive subscriptions
5. **Testing**: Always test on multiple devices and browsers

## Troubleshooting

### Common Issues

1. **Notifications not received**
   - Check browser notification permissions
   - Verify VAPID keys are correct
   - Check if subscription is active in database

2. **Permission denied**
   - User must manually enable in browser settings
   - Clear browser data and try again

3. **Multiple subscriptions for same device**
   - System handles this by updating existing subscription
   - Use endpoint as unique identifier

### Debug Tools

1. Check subscription status in browser DevTools:

   ```javascript
   navigator.serviceWorker.ready.then((reg) =>
     reg.pushManager.getSubscription().then(console.log)
   );
   ```

2. View all user subscriptions in Convex dashboard
3. Use the built-in test notification feature

## Security Considerations

- VAPID keys should be kept secure
- Subscriptions are tied to authenticated users only
- Endpoints are unique and can't be guessed
- Inactive subscriptions are automatically cleaned up

## Future Enhancements

- Notification preferences per device
- Scheduled notifications
- Rich notifications with images and actions
- Push notification analytics
- Batch notification sending optimization
