"use client";

import { ReactNode } from "react";

const layout = ({ children }: { children: ReactNode }) => {
  if (typeof window === "undefined") {
    return null; // Return null on the server side
  }
  return <>{children}</>;
};
export default layout;
