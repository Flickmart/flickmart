import { useEffect } from "react";

import { analytics } from "@/utils/analytics";
import { EventProperties } from "@segment/analytics-next";

export function useTrack() {
  function sendViewData(eventName: string, properties: EventProperties) {
    analytics.track(eventName, properties);
  }
  return sendViewData;
}
