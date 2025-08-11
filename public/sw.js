// FlickMart Service Worker for Push Notifications

const CACHE_NAME = 'flickmart-v1';
const urlsToCache = [
  '/icon-192x192.png',
  '/badge-72x72.png'
];

// Install event - cache only essential resources
self.addEventListener('install', function(event) {
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        return cache.addAll(urlsToCache).catch(function(error) {
          console.log('Cache addAll failed:', error);
          // Don't fail installation if caching fails
          return Promise.resolve();
        });
      })
  );
  // Skip waiting to activate immediately
  self.skipWaiting();
});

// Push event - handle incoming push notifications
self.addEventListener('push', function(event) {
  console.log('🔔 Push event received:', event);
  
  let notificationData = {
    title: 'FlickMart',
    body: 'You have a new notification',
    icon: '/icon-192x192.png',
    badge: '/badge-72x72.png',
    data: {
      timestamp: Date.now(),
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
  };

  if (event.data) {
    try {
      const payload = event.data.json();
      console.log('📦 Push payload:', payload);
      notificationData = {
        ...notificationData,
        ...payload,
      };
    } catch (error) {
      console.error('❌ Error parsing push data:', error);
      notificationData.body = event.data.text();
    }
  }

  console.log('📱 Showing notification:', notificationData);

  event.waitUntil(
    self.registration.showNotification(notificationData.title, {
      body: notificationData.body,
      icon: notificationData.icon,
      badge: notificationData.badge,
      data: notificationData.data,
      actions: notificationData.actions,
      vibrate: notificationData.vibrate,
      requireInteraction: notificationData.requireInteraction,
      silent: notificationData.silent,
      tag: notificationData.data?.type || 'general',
    }).then(() => {
      console.log('✅ Notification shown successfully');
    }).catch((error) => {
      console.error('❌ Failed to show notification:', error);
    })
  );
});

// Notification click event
self.addEventListener('notificationclick', function(event) {
  console.log('Notification clicked:', event);
  
  event.notification.close();

  if (event.action === 'close') {
    return;
  }

  // Handle notification click
  const urlToOpen = event.notification.data?.url || '/notifications';
  
  event.waitUntil(
    clients.matchAll({
      type: 'window',
      includeUncontrolled: true
    }).then(function(clientList) {
      // Check if there's already a window/tab open with the target URL
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        if (client.url.includes(urlToOpen) && 'focus' in client) {
          return client.focus();
        }
      }
      
      // If no existing window/tab, open a new one
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});

// Background sync for offline actions
self.addEventListener('sync', function(event) {
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // Handle background sync tasks
      console.log('Background sync triggered')
    );
  }
});

// Activate event - clean up old caches
self.addEventListener('activate', function(event) {
  console.log('Service Worker activating...');
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // Take control of all clients immediately
  return self.clients.claim();
});

// Fetch event - only handle specific requests to avoid CORS issues
self.addEventListener('fetch', function(event) {
  // Only handle requests for our own domain and essential resources
  const url = new URL(event.request.url);
  
  // Skip external domains (like Clerk) to avoid CORS issues
  if (url.origin !== self.location.origin) {
    return;
  }
  
  // Only cache GET requests for static assets
  if (event.request.method === 'GET' && 
      (url.pathname.endsWith('.png') || 
       url.pathname.endsWith('.jpg') || 
       url.pathname.endsWith('.ico'))) {
    
    event.respondWith(
      caches.match(event.request)
        .then(function(response) {
          return response || fetch(event.request).catch(function() {
            // Return a fallback if both cache and network fail
            return new Response('Resource not available', { status: 404 });
          });
        })
    );
  }
});