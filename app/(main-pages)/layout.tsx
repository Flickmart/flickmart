"use client"
import { useEffect, useState, type ReactNode } from "react";
import CookieConsent from "@/components/CookieConsent";
import Navbar from "@/components/Navbar";
import InstallPrompt from "@/components/InstallPrompt";

const layout = ({ children }: { children: ReactNode }) => {
  const [deferredPrompt, setDeferredPrompt] = useState< Event | null>(null)
  useEffect(()=>{
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      console.log(e)
      setDeferredPrompt(e) 
    };
    window?.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => {
      window?.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  },[])
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
