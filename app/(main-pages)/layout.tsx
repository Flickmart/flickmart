"use client"
import { useState, type ReactNode } from "react";
import CookieConsent from "@/components/CookieConsent";
import Navbar from "@/components/Navbar";
import InstallPrompt from "@/components/InstallPrompt";

const layout = ({ children }: { children: ReactNode }) => {
  const [deferredPrompt, setDeferredPrompt] = useState< Event | null>(null)

window?.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  console.log(e)
  setDeferredPrompt(e) 
});
  return (
    <>
      <InstallPrompt promptEvent={deferredPrompt} />
      <CookieConsent />
      <Navbar />
      {children}
    </>
  );
};
export default layout;
