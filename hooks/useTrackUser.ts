import { analytics } from "@/utils/analytics";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export function useTrackUser(){
      // Get User
    const user = useQuery(api.users.current, {});

    function identify (){
        analytics.identify(user?._id, {
            name: user?.name,
            email: user?.email
        });
    }
    return identify
}