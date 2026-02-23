'use client';
import * as Sentry from '@sentry/nextjs';
import type Error from 'next/error';
import { useEffect } from 'react';
import { Error500Illustration } from '@/components/error-illustration';
import ErrorMessage from '@/components/error-message';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <div className="flex h-full items-center justify-center bg-white">
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2">
          <div className="order-2 lg:order-1">
            <ErrorMessage
              description="We're experiencing some technical difficulties. Our team has been notified and is working to fix the issue as soon as possible."
              errorCode="500-SYSTEM"
              onReset={reset}
              title="Something Went Wrong" // Pass the reset function
            />
          </div>
          <div className="order-1 flex justify-center lg:order-2">
            <Error500Illustration />
          </div>
        </div>
      </main>
    </div>
  );
}
