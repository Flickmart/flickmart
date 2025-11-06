'use client';

import { useEffect, useState } from 'react';
import { registerServiceWorker } from '@/lib/serviceWorker';

export function ServiceWorkerRegistration() {
  const [_isReady, setIsReady] = useState(false);

  useEffect(() => {
    const registerSW = async () => {
      try {
        const registration = await registerServiceWorker('/sw.js', {
          scope: '/',
          updateViaCache: 'none',
          onUpdate: (registration) => {
            console.log('🆕 New service worker available', registration);
          },
          onSuccess: (registration) => {
            console.log(
              '✅ Service Worker registered successfully:',
              registration
            );
            setIsReady(true);
          },
          onError: (error) => {
            console.error('❌ Service Worker registration failed:', error);
            setIsReady(false);
          },
        });

        if (registration) {
          setIsReady(true);
        }
      } catch (error) {
        console.error('Service Worker registration error:', error);
        setIsReady(false);
      }
    };

    registerSW();

    // Listen for messages from service worker
    const handleMessage = (event: MessageEvent) => {
      console.log('Message from service worker:', event.data);
    };

    const handleError = (event: Event) => {
      console.error('Service Worker error:', event);
    };

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', handleMessage);
      navigator.serviceWorker.addEventListener('error', handleError);
    }

    return () => {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.removeEventListener('message', handleMessage);
        navigator.serviceWorker.removeEventListener('error', handleError);
      }
    };
  }, []);

  return null; // This component doesn't render anything
}
