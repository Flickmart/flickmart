// Service Worker for Push Notifications

self.addEventListener("install", (event) => {
  console.log("Service Worker installing");
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  console.log("Service Worker activating");
  event.waitUntil(self.clients.claim());
});

self.addEventListener("push", (event) => {
  console.log("Push event received:", event);

  if (!event.data) {
    console.log("Push event has no data");
    return;
  }

  try {
    const data = event.data.json();
    console.log("Push notification data:", data);

    const options = {
      body: data.body,
      icon: data.icon || "/icon-192x192.png",
      badge: data.badge || "/badge-72x72.png",
      data: data.data || {},
      actions: data.actions || [
        {
          action: "view",
          title: "View",
        },
        {
          action: "close",
          title: "Close",
        },
      ],
      requireInteraction: false,
      silent: false,
    };

    event.waitUntil(self.registration.showNotification(data.title, options));
  } catch (error) {
    console.error("Error processing push notification:", error);
  }
});

self.addEventListener("notificationclick", (event) => {
  console.log("Notification clicked:", event);

  const notification = event.notification;
  const action = event.action;
  const data = notification.data || {};

  notification.close();

  if (action === "close") {
    return;
  }

  // Determine the URL to open with security validation
  let urlToOpen = "/";

  if (data.url) {
    try {
      const parsedUrl = new URL(data.url, self.location.origin);
      // Only allow same-origin navigation
      if (parsedUrl.origin === self.location.origin) {
        urlToOpen = parsedUrl.pathname + parsedUrl.search + parsedUrl.hash;
      }
    } catch (error) {
      console.warn("Invalid URL in notification data:", data.url);
      urlToOpen = "/";
    }
  } else if (data.type === "new_message" && data.relatedId) {
    // Ensure relatedId exists and is truthy before using it
    urlToOpen = data.relatedId ? `/chats/${data.relatedId}` : "/chats";
  } else if (
    (data.type === "new_like" || data.type === "new_comment") &&
    data.relatedId
  ) {
    // Ensure relatedId exists and is truthy before using it
    urlToOpen = data.relatedId ? `/products/${data.relatedId}` : "/products";
  } else if (data.type === "escrow_funded" || data.type === "escrow_released") {
    urlToOpen = "/orders";
  }

  // Ensure the URL starts with '/' for proper navigation
  if (!urlToOpen.startsWith("/")) {
    urlToOpen = "/" + urlToOpen;
  }

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        // Check if there's already a window/tab open with the target URL
        for (const client of clientList) {
          if (client.url === urlToOpen && "focus" in client) {
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

self.addEventListener("notificationclose", (event) => {
  console.log("Notification closed:", event);
  // You can track notification close events here if needed
});
