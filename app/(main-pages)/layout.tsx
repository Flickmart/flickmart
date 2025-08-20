import CookieConsent from "@/components/CookieConsent";
import Navbar from "@/components/Navbar";
import { ReactNode } from "react";

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <CookieConsent />
      <Navbar />
      {children}
    </>
  );
};
export default layout;
