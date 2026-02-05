import usePresence from "@convex-dev/presence/react";
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";

export function useAppPresence() {
  const user = useQuery(api.users.current, {});

  const presenceState = usePresence(
    api.presence,
    "app-wide",
    "j9703rx0rcbwqb1pzbp27n1scx7db2x5"
  );

  return {
    presenceState,
  };
}
