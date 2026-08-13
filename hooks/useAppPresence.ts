import usePresence from "@convex-dev/presence/react";
import { api } from "../convex/_generated/api";

// Requires a real, already-resolved user id -- callers must not invoke this
// with an id that might still be loading. Convex's heartbeat mutation
// validates userId as a required string, so an undefined id fails outright
// rather than just being ignored.
export function useAppPresence(userId: string) {
  const presenceState = usePresence(api.presence, "app-wide", userId);

  return {
    presenceState,
  };
}
