self.addEventListener('push', (event) => {
  console.log('🔔 Push event received:', event);

  if (event.data) {
    try {
      const data = event.data.json();
      console.log('📱 Push data:', data);

      const options = {
        body: data.body,
        icon: data.icon || '/icon512_rounded.png',
        badge: data.badge || '/icon512_rounded.png',
        data: data.data,
        actions: data.actions || [
          {
            action: 'view',
            title: 'View',
          },
          {
            action: 'close',
            title: 'Close',
          },
        ],
        requireInteraction: true,
        tag: 'flickmart-notification',
        // biome-ignore lint/style/noMagicNumbers: I do not need to extrapolate the values here
        vibrate: [200, 100, 200],
        timestamp: Date.now(),
      };

      event.waitUntil(self.registration.showNotification(data.title, options));
    } catch (error) {
      console.error('❌ Error parsing push data:', error);

      // Fallback notification
      event.waitUntil(
        self.registration.showNotification('New Notification', {
          body: 'You have a new notification from Flickmart',
          icon: '/icon512_maskable.png',
          badge: '/icon512_maskable.png',
          tag: 'flickmart-fallback',
        })
      );
    }
  }
});

self.addEventListener('notificationclick', (event) => {
  console.log('🖱️ Notification clicked:', event);

  event.notification.close();

  const action = event.action;
  const data = event.notification.data;

  if (action === 'close') {
    return;
  }

  // Determine URL to open
  let urlToOpen = '/';

  if (data?.url) {
    urlToOpen = data.url;
  } else if (action === 'view' && data) {
    // Handle different notification types
    switch (data.type) {
      case 'new_message':
        urlToOpen = data.relatedId
          ? `/chat?conversation=${data.relatedId}`
          : '/chat';
        break;
      case 'new_like':
      case 'new_comment':
        urlToOpen = data.relatedId ? `/product/${data.relatedId}` : '/';
        break;
      case 'new_sale':
        urlToOpen = '/orders';
        break;
      default:
        urlToOpen = '/notifications';
    }
  }

  event.waitUntil(
    clients
      .matchAll({
        type: 'window',
        includeUncontrolled: true,
      })
      .then((clientList) => {
        // Check if app is already open
        for (const client of clientList) {
          if (
            client.url.includes(
              new URL(urlToOpen, self.location.origin).pathname
            ) &&
            'focus' in client
          ) {
            console.log('📱 Focusing existing window');
            return client.focus();
          }
        }

        // Open new window
        if (clients.openWindow) {
          console.log('🆕 Opening new window:', urlToOpen);
          return clients.openWindow(urlToOpen);
        }
      })
  );
});

self.addEventListener('notificationclose', (event) => {
  console.log('❌ Notification closed:', event.notification.tag);
});

// Handle background sync for offline notifications
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync-notifications') {
    console.log('🔄 Background sync for notifications');
    // Handle any pending notifications when back online
  }
});

console.log('✅ Custom push notification service worker loaded');
