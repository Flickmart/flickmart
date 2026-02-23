/** biome-ignore-all lint/style/noNonNullAssertion:The envs are constantn and would be made available always by vercel */
'use client';

import { ClerkProvider, useAuth } from '@clerk/nextjs';
import { ConvexReactClient } from 'convex/react';
import { ConvexProviderWithClerk } from 'convex/react-clerk';
import { AppPresenceProvider } from './AppPresenceProvider';
import { PostHogProvider } from './PostHogProvider';
import { PushNotificationProvider } from './PushNotificationProvider';

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PostHogProvider>
      <ClerkProvider
        publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!}
      >
        <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
          <PushNotificationProvider>
            <AppPresenceProvider />
            {children}
          </PushNotificationProvider>
        </ConvexProviderWithClerk>
      </ClerkProvider>
    </PostHogProvider>
  );
}
