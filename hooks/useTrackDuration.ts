'use client';
import { useEffect } from 'react';
import { useTrack } from './useTrack';

export function useTrackDuration(
  productId: string,
  userId: string,
  recommId: string
) {
  useEffect(() => {
    // let start = Date.now();
    let visibleStart = Date.now();
    let visibleDuration = 0;
    const captureActivity = useTrack();

    const onVisibility = () => {
      if (document.hidden) {
        visibleDuration += Date.now() - visibleStart;
      } else {
        visibleStart = Date.now();
      }
    };

    const onBeforeUnload = () => {
      visibleDuration += Date.now() - visibleStart;
      const totalSeconds = Math.floor(visibleDuration / 1000);

      // send to backend
      captureActivity('Product Viewed', {
        userId,
        productId,
        recommId,
        duration: totalSeconds,
      });
    };

    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('beforeunload', onBeforeUnload);

    return () => {
      onBeforeUnload(); // also send on route change
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('beforeunload', onBeforeUnload);
    };
  }, [productId, userId]);
}
