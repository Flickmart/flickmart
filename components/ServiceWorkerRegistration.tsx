'use client';

import { useEffect } from 'react';

export function ServiceWorkerRegistration() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      // Unregister any existing service workers first to avoid conflicts
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        registrations.forEach((registration) => {
          if (
            registration.scope.includes('sw.js') &&
            registration.active?.scriptURL !== `${window.location.origin}/sw.js`
          ) {
            console.log(
              'Unregistering old service worker:',
              registration.scope
            );
            registration.unregister();
          }
        });
      });

      // Register service worker
      navigator.serviceWorker
        .register('/sw.js', {
          scope: '/',
          updateViaCache: 'none', // Always check for updates
        })
        .then((registration) => {
          console.log(' Service Worker registered successfully:', registration);

          // Force update check
          registration.update();

          // Check for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              console.log('🔄 New service worker installing...');
              newWorker.addEventListener('statechange', () => {
                if (
                  newWorker.state === 'installed' &&
                  navigator.serviceWorker.controller
                ) {
                  console.log('🆕 New service worker available');
                }
              });
            }
          });
        })
        .catch((error) => {
          console.error('❌ Service Worker registration failed:', error);
        });

      // Listen for messages from service worker
      navigator.serviceWorker.addEventListener('message', (event) => {
        console.log('Message from service worker:', event.data);
      });

      // Listen for service worker errors
      navigator.serviceWorker.addEventListener('error', (event) => {
        console.error(' Service Worker error:', event);
      });
    }
  }, []);

  return null; // This component doesn't render anything
}
