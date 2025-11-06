'use client';
import { type ReactNode, useEffect, useState } from 'react';
import CookieConsent from '@/components/CookieConsent';
import InstallPrompt from '@/components/InstallPrompt';
import Navbar from '@/components/Navbar';

const layout = ({ children }: { children: ReactNode }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<Event | null>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
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
      <CookieConsent />
      <Navbar />
      {children}
    </>
  );
};
export default layout;
