'use client';
import { getCookie, setCookie } from 'cookies-next';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import useUserAgent from '@/hooks/useUserAgent';
import AddToMobileChrome from './AddToMobileChrome';

const COOKIE_NAME = 'addToHomeScreenPrompt';

export default function InstallPrompt({
  promptEvent,
}: {
  promptEvent: Event | null;
}) {
  const { isMobile, isStandalone, userAgent, isIOS } = useUserAgent();
  const [isVisible, setIsVisible] = useState(false);
  const path = usePathname();

  // Close Prompt
  const closePrompt = () => {
    setIsVisible(false);
  };

  // Don't show again to prevent being intrusive
  const doNotShowAgain = () => {
    const date = new Date();
    date.setFullYear(date.getFullYear() + 1);
    setCookie(COOKIE_NAME, 'dontShow', { expires: date });
    setIsVisible(false);
  };

  async function handleInstallClick() {
    (promptEvent as any).prompt();
    closePrompt();

    const { outcome } = await (promptEvent as any).userChoice;
    console.log('User choice:', outcome);

    if (outcome === 'accepted') {
      doNotShowAgain();
    }
  }

  useEffect(() => {
    closePrompt();
    const addToHomeScreenPromptCookie = getCookie(COOKIE_NAME);
    if (
      promptEvent &&
      addToHomeScreenPromptCookie !== 'dontShow' &&
      !isStandalone
    ) {
      setIsVisible(true); // show button when prompt is available
    }
  }, [promptEvent, isStandalone]);

  if (!isVisible || path !== '/') {
    return null;
  }

  return (
    <div
      className="fixed top-0 right-0 bottom-0 left-0 z-50 flex justify-center bg-black/70"
      onClick={closePrompt}
    >
      <AddToMobileChrome handleInstallClick={handleInstallClick} />
    </div>
  );
}
