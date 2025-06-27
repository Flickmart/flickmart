"use client";
// import * as Sentry from "@sentry/nextjs";
// import Error from "next/error";
// import { useEffect } from "react";
import { Error500Illustration } from "@/components/error-illustration";
import ErrorMessage from "@/components/error-message";

export default function GlobalError({
  // error,
  reset,
}: {
  // error: Error & { digest?: string };
  reset: () => void;
}) {
  // useEffect(() => {
  //   Sentry.captureException(error);
  // }, [error]);
  return (
    <html>
      <body className="bg-white h-full flex items-center justify-center">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="order-2 lg:order-1">
              <ErrorMessage
                title="Something Went Wrong"
                description="We're experiencing some technical difficulties. Our team has been notified and is working to fix the issue as soon as possible."
                errorCode="500-SYSTEM"
                onReset={reset} // Pass the reset function
              />
            </div>
            <div className="order-1 lg:order-2 flex justify-center">
              <Error500Illustration />
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
