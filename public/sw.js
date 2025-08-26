// FlickMart Service Worker for Push Notifications

const CACHE_NAME = 'flickmart-v1';
const urlsToCache = ['/icon-192x192.png', '/badge-72x72.png'];

// Install event - cache only essential resources
self.addEventListener('install', async (event) => {
  console.log('Service Worker installing...');
  event.waitUntil(
    (async () => {
      try {
        const cache = await caches.open(CACHE_NAME);
        // Cache files individually to avoid failing if one file is missing
        const cachePromises = urlsToCache.map(async (url) => {
          try {
            await cache.add(url);
            console.log(`Cached: ${url}`);
          } catch (error) {
            console.warn(`Failed to cache ${url}:`, error);
          }
        });
        await Promise.allSettled(cachePromises);
      } catch (error) {
        console.error(' Cache setup failed:', error);
      }
    })()
  );
  // Skip waiting to activate immediately
  self.skipWaiting();
});

// Push event - handle incoming push notifications
self.addEventListener('push', (event) => {
  console.log('🔔 Push event received:', event);

  let notificationOptions = {
    body: 'You have a new notification',
    icon: '/icon-192x192.png',
    badge: '/badge-72x72.png',
    data: {
      timestamp: Date.now(),
      url: '/notifications',
    },
    actions: [
      {
        action: 'view',
        title: 'View',
      },
      {
        action: 'close',
        title: 'Close',
      },
    ],
    vibrate: [100, 50, 100],
    requireInteraction: false,
    silent: false,
    tag: 'general',
  };

  let title = 'FlickMart';

  if (event.data) {
    try {
      const payload = event.data.json();
      console.log('Push payload:', payload);

      // Separate title from notification options
      if (payload.title) {
        title = payload.title;
        delete payload.title;
      }

      // Merge payload with options, ensuring data is properly structured
      notificationOptions = {
        ...notificationOptions,
        ...payload,
        data: {
          ...notificationOptions.data,
          ...(payload.data || {}),
        },
      };
    } catch (error) {
      console.error(' Error parsing push data:', error);
      try {
        notificationOptions.body = event.data.text();
      } catch (textError) {
        console.error(' Error getting text from push data:', textError);
      }
    }
  }

  console.log('📱 Showing notification:', {
    title,
    options: notificationOptions,
  });

  event.waitUntil(
    self.registration
      .showNotification(title, notificationOptions)
      .then(() => {
        console.log(' Notification shown successfully');
      })
      .catch((error) => {
        console.error(' Failed to show notification:', error);
      })
  );
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event);

  event.notification.close();

  if (event.action === 'close') {
    return;
  }

  // Handle notification click
  const urlToOpen = event.notification.data?.url || '/notifications';

  event.waitUntil(
    clients
      .matchAll({
        type: 'window',
        includeUncontrolled: true,
      })
      .then((clientList) => {
        // Check if there's already a window/tab open with the target URL
        for (let i = 0; i < clientList.length; i++) {
          const client = clientList[i];
          // More precise URL matching - check if the pathname matches
          const clientUrl = new URL(client.url);
          const targetUrl = new URL(urlToOpen, self.location.origin);

          if (clientUrl.pathname === targetUrl.pathname && 'focus' in client) {
            return client.focus();
          }
        }

        // If no existing window/tab, open a new one
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
      .catch((error) => {
        console.error('❌ Error handling notification click:', error);
      })
  );
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // Handle background sync tasks
      Promise.resolve().then(() => {
        console.log('Background sync triggered');
        // Add actual background sync logic here
      })
    );
  }
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches
        .keys()
        .then((cacheNames) =>
          Promise.all(
            cacheNames
              .map((cacheName) => {
                if (cacheName !== CACHE_NAME) {
                  console.log('Deleting old cache:', cacheName);
                  return caches.delete(cacheName);
                }
              })
              .filter(Boolean) // Remove undefined values
          )
        ),
      // Take control of all clients immediately
      self.clients.claim(),
    ]).catch((error) => {
      console.error('❌ Error during activation:', error);
    })
  );
});

// Fetch event - only handle specific requests to avoid CORS issues
self.addEventListener('fetch', (event) => {
  // Only handle requests for our own domain and essential resources
  const url = new URL(event.request.url);

  // Skip external domains (like Clerk) to avoid CORS issues
  if (url.origin !== self.location.origin) {
    return;
  }

  // Only cache GET requests for static assets
  if (
    event.request.method === 'GET' &&
    (url.pathname.endsWith('.png') ||
      url.pathname.endsWith('.jpg') ||
      url.pathname.endsWith('.jpeg') ||
      url.pathname.endsWith('.ico') ||
      url.pathname.endsWith('.svg'))
  ) {
    event.respondWith(
      caches
        .match(event.request)
        .then((response) => {
          if (response) {
            return response;
          }

          // Fetch from network with error handling
          return fetch(event.request.clone())
            .then((networkResponse) => {
              // Only cache successful responses
              if (networkResponse.status === 200) {
                const responseClone = networkResponse.clone();
                caches.open(CACHE_NAME).then((cache) => {
                  cache.put(event.request, responseClone);
                });
              }
              return networkResponse;
            })
            .catch((error) => {
              console.warn('❌ Fetch failed for:', event.request.url, error);
              // Return a fallback if both cache and network fail
              return new Response('Resource not available', {
                status: 404,
                statusText: 'Not Found',
              });
            });
        })
        .catch((error) => {
          console.error('❌ Cache match failed:', error);
          return fetch(event.request);
        })
    );
  }
});
