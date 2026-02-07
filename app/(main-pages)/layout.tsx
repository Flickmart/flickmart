'use client';
import { type ReactNode, useEffect, useState } from 'react';
import CookieConsent from '@/components/CookieConsent';
import InstallPrompt from '@/components/InstallPrompt';
import Navbar from '@/components/Navbar';
import { useAnalyticsInit } from '@/hooks/useAnalyticsInit';
import { useTrackUser } from '@/hooks/useTrackUser';
import { analytics } from '@/utils/analytics';
import { scenarios } from '@/utils/constants';
``
const layout = ({ children }: { children: ReactNode }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<Event | null>(null);
  // Initialize Analytics.js
  useAnalyticsInit();
  // Returns Track function which is executed when user accepts cookies
  const {identify, user} = useTrackUser();

  useEffect(() => {
    // If User is not defined create an Anon user and store in local storage
    let anonId = localStorage.getItem('anonId');
    if (!anonId && !user) {
      anonId = crypto.randomUUID();
      localStorage.setItem('anonId', anonId);
    }

    // Once user logins and user object is defined, alias the anonId with user id and remove all local storage recommendations
    if(anonId && user){
      analytics.alias(user._id, anonId)
      scenarios.map(scenario => localStorage.removeItem(scenario))
    }
  },[user])

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      analytics.load({
        writeKey: process.env.NEXT_PUBLIC_SEGMENT_WRITE_KEY || '',
      });

      e.preventDefault();
      console.log(e);
      setDeferredPrompt(e);
    };
    window?.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => {
      window?.removeEventListener(
        'beforeinstallprompt',
        handleBeforeInstallPrompt
      );
    };
  }, []);

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
