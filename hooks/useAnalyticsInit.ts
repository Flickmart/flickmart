import { analytics } from '@/utils/analytics';

export function useAnalyticsInit() {
  analytics.load({ writeKey: process.env.NEXT_PUBLIC_SEGMENT_WRITE_KEY || '' });
}
