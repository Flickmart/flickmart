"use client";

import { useAuth } from "@clerk/nextjs";
import usePresence from "@convex-dev/presence/react";
import { useEffect } from "react";
import { api } from "../convex/_generated/api";

interface AppPresenceProviderProps {
  children: React.ReactNode;
}

export function AppPresenceProvider({ children }: AppPresenceProviderProps) {
  const { isSignedIn, userId } = useAuth();


  // Use the Convex Presence Component for app-wide presence
  const presenceState = usePresence(
    api.presence,
    "app-wide", // Room ID for the entire app
    userId || "anonymous"
  );


  return <>{children}</>;
}
