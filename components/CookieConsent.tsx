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
        <div onClick={(e)=> e.stopPropagation()} className='bg-white gap-3 w-full h-52 px-20 flex flex-col justify-center'>
          <div className='space-y-3'>
            <h2 className='text-xl  font-semibold'>Cookie Consent</h2>
            <p className='font-medium'>
              We use cookies to improve your experience. By using our site, you
              agree to our cookie policy.
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
