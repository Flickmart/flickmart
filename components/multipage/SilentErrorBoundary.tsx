"use client";
import { ErrorBoundary, FallbackProps } from "react-error-boundary";
import React, { ReactNode } from "react";

export default function SilentErrorBoundary({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <ErrorBoundary
      fallbackRender={(props: FallbackProps) => {
        return <p>please login</p>;
      }}
    >
      {children}
    </ErrorBoundary>
  );
}
