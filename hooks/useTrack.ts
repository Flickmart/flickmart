import type { EventProperties } from '@segment/analytics-next';
import { useEffect } from 'react';
import { analytics } from '@/utils/analytics';

export function useTrack() {
  function sendViewData(eventName: string, properties: EventProperties) {
    analytics.track(eventName, properties);
  }
  return sendViewData;
}
