'use client';

import { useEffect } from 'react';
import { registerServiceWorker } from '@/lib/serviceWorker';

export function ServiceWorkerRegistration() {
  useEffect(() => {
    registerServiceWorker('/sw.js', {
      scope: '/',
      updateViaCache: 'none',
      onUpdate: (registration) => {
        console.log('🆕 New service worker available', registration);
      },
      onSuccess: (registration) => {
        console.log(' Service Worker registered successfully:', registration);
      },
      onError: (error) => {
        console.error(' Service Worker registration failed:', error);
      },
    });

    // Listen for messages from service worker
    navigator.serviceWorker.addEventListener('message', (event) => {
      console.log('Message from service worker:', event.data);
    });

    // Listen for service worker errors
    navigator.serviceWorker.addEventListener('error', (event) => {
      console.error(' Service Worker error:', event);
    });
  }, []);

  return null; // This component doesn't render anything
}
