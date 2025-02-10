import React from "react";

export default function Container({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: String;
}) {
  return (
    <div className={` min-h-[50vh] grid place-items-center ${className}`}>
      {children}
    </div>
  );
}
