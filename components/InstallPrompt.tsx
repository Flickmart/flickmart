import { getCookie, setCookie } from 'cookies-next';
// import dynamic from "next/dynamic";
import React, { useEffect, useState } from 'react';
import useUserAgent from '@/hooks/useUserAgent';
import AddToMobileChrome from './AddToMobileChrome';

// Dynamically Import
// const ModuleLoading = () => <p className=" text-white font-bold">Loading...</p>;

// const AddToMobileChrome = dynamic(() => import("./AddToMobileChrome"), {
//   loading: () => <ModuleLoading />,
// });

const COOKIE_NAME = 'addToHomeScreenPrompt';

export default function InstallPrompt() {
  const [displayPrompt, setDisplayPrompt] = useState('');
  const { isMobile, isStandalone, userAgent, isIOS } = useUserAgent();
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Close Prompt
  const closePrompt = () => {
    setDisplayPrompt('');
  };

  // Don't show again to prevent being intrusive
  const doNotShowAgain = () => {
    const date = new Date();
    date.setFullYear(date.getFullYear() + 1);
    setCookie(COOKIE_NAME, 'dontShow', { expires: date });
    setDisplayPrompt('');
  };

  async function handleInstallClick() {
    if (!deferredPrompt) {
      closePrompt();
      return;
    }
    deferredPrompt.prompt();
    closePrompt();

    const { outcome } = await (deferredPrompt as any).userChoice;
    console.log('User choice:', outcome);

    setDeferredPrompt(null);
    setIsVisible(false);
  }

  useEffect(() => {
    const handler = (e: Event) => {
      console.log('the event object', e);
      e.preventDefault();
      setDeferredPrompt(e);
      setIsVisible(true); // show button when prompt is available
    };
    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  useEffect(() => {
    const addToHomeScreenPromptCookie = getCookie(COOKIE_NAME);

    // Only show prompt if user is on mobile and app is not installed
    if (
      addToHomeScreenPromptCookie !== 'dontShow' &&
      !isStandalone &&
      userAgent
    ) {
      setDisplayPrompt(userAgent.toLowerCase());
    }
  }, [userAgent, isMobile, isStandalone, isIOS]);
  return (
    <>
      {displayPrompt !== '' && (
        <div
          className="fixed top-0 right-0 bottom-0 left-0 z-50 flex justify-center bg-black/70"
          onClick={closePrompt}
        >
          <AddToMobileChrome
            closePrompt={closePrompt}
            doNotShowAgain={doNotShowAgain}
            handleInstallClick={handleInstallClick}
          />
        </div>
      )}
    </>
  );
}
