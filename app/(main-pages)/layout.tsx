import type { ReactNode } from 'react';
import CookieConsent from '@/components/CookieConsent';
import Navbar from '@/components/Navbar';

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <CookieConsent />
      <Navbar />
      {children}
    </>
  );
};
export default layout;
