"use client"
import { useEffect, useState, type ReactNode } from "react";
import CookieConsent from "@/components/CookieConsent";
import Navbar from "@/components/Navbar";
import InstallPrompt from "@/components/InstallPrompt";
import { useTrackUser } from "@/hooks/useTrackUser";
import { analytics } from "@/utils/analytics";
import { useAnalyticsInit } from "@/hooks/useAnalyticsInit";

const layout = ({ children }: { children: ReactNode }) => {
  const [deferredPrompt, setDeferredPrompt] = useState< Event | null>(null)
  // Initialize Analytics.js
  useAnalyticsInit()
  // Returns Track function which is executed when user accepts cookies
  const identify = useTrackUser()


  useEffect(()=>{    
    const handleBeforeInstallPrompt = (e: Event) => {
    analytics.load({ writeKey: process.env.NEXT_PUBLIC_SEGMENT_WRITE_KEY || '' })

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
      <CookieConsent identifyUser={identify} />
      <Navbar />
      {children}
    </>
  );
};
export default layout;
