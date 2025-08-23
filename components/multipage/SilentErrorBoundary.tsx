'use client';
import React, { type ReactNode } from 'react';
import { ErrorBoundary, type FallbackProps } from 'react-error-boundary';

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
