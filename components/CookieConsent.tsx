'use client';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';

export default function CookieConsent({
  identifyUser,
}: {
  identifyUser: () => void;
}) {
  const [visible, setVisible] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setVisible(true);
    }
  }, []);

  function handleCookieConsent(choice: 'accept' | 'reject') {
    localStorage.setItem('cookie-consent', choice);
    setVisible(false);

    if (choice === 'accept') {
      console.log('Cookie accepted');
      identifyUser();
    } else {
      console.log('Cookie Rejected');
      identifyUser();
    }
  }

  if (!visible) {
    return null;
  }

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex items-end bg-black/80',
        hidden && 'hidden'
      )}
      onClick={() => setHidden(true)}
    >
      <div
        className="flex min-h-52 w-full flex-col justify-center gap-5 bg-white p-5 py-7 text-justify lg:gap-3 lg:px-20"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="space-y-2 lg:space-y-3">
          <h2 className="font-semibold text-lg lg:text-xl">Cookie Consent</h2>
          <p className="font-medium text-sm leading-loose lg:text-base">
            We use cookies to personalize content, remember your preferences,
            and analyze traffic. Click Accept to agree to our use of cookies, or
            Manage to change your settings. See our Cookie Policy for details.
          </p>
        </div>
        <div className="flex justify-end gap-5">
          <Button
            className="h-10 bg-orange px-5"
            onClick={() => {
              handleCookieConsent('reject');
            }}
            variant="outline"
          >
            Reject
          </Button>
          <Button
            className="h-10 px-5"
            onClick={() => {
              handleCookieConsent('accept');
            }}
          >
            Accept
          </Button>
        </div>
      </div>
    </div>
  );
}
