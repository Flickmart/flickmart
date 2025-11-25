'use client';
import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';


export default function CookieConsent({identifyUser}: {identifyUser : ()=> void}) {
  const [visible, setVisible] = useState(false);
  const [hidden, setHidden] = useState(false)

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
      identifyUser()
    } else {
      console.log('Cookie Rejected');
      identifyUser()
    }
  }

  if (!visible) {
    return null;
  }

  return (
      <div 
        className={cn("flex items-end fixed inset-0 z-50 bg-black/80", hidden && "hidden" )}
        onClick={()=> setHidden(true) }
      >
        <div onClick={(e)=> e.stopPropagation()} className='bg-white lg:gap-3 gap-5 w-full min-h-52 lg:px-20 p-5 text-justify flex py-7 flex-col justify-center'>
          <div className='lg:space-y-3 space-y-2'>
            <h2 className='lg:text-xl text-lg  font-semibold'>Cookie Consent</h2>
            <p className='font-medium text-sm lg:text-base leading-loose'>
         We use cookies to personalize content, remember your preferences, and analyze traffic. Click Accept to agree to our use of cookies, or Manage to change your settings. See our Cookie Policy for details.
            </p>
          </div>
            <div className="flex  justify-end gap-5">
              <Button
              className='h-10 px-5 bg-orange'
                onClick={() => {
                  handleCookieConsent('reject')}
                }
                variant="outline"
                >
                Reject
              </Button>
              <Button className='h-10 px-5' onClick={() => {
                handleCookieConsent('accept')
              }}>Accept</Button>
            </div>
        </div>
      </div>
  );
}
