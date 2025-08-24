import type React from 'react';

export default function Container({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`grid min-h-[50vh] place-items-center ${className}`}>
      {children}
    </div>
  );
}
