"use client";

import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { PostHogProvider } from "./PostHogProvider";
import { AppPresenceProvider } from "./AppPresenceProvider";
import { PushNotificationProvider } from "./PushNotificationProvider";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PostHogProvider>
      <ClerkProvider
        publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!}
      >
        <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
          <PushNotificationProvider>
            <AppPresenceProvider>{children}</AppPresenceProvider>
          </PushNotificationProvider>
        </ConvexProviderWithClerk>
      </ClerkProvider>
    </PostHogProvider>
  );
}
