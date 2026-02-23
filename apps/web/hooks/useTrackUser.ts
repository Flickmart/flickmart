import { useQuery } from "convex/react";
import { api } from "backend/convex/_generated/api";
import { analytics } from "@/utils/analytics";

export function useTrackUser() {
  // Get User
  const user = useQuery(api.users.current, {});

  function identify() {
    analytics.identify(user?._id, {
      name: user?.name,
      email: user?.email,
    });
  }
  return { identify, user };
}
