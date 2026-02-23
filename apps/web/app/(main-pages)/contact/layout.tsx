'use client';

import type React from 'react';
import Footer from '@/components/Footer';

const ContactLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="overflow-hidden">
      {children}
      <Footer />
    </div>
  );
};

export default ContactLayout;
