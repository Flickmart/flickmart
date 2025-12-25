'use client';

import { usePathname } from 'next/navigation';
import ChristmasSnowfall from './ChristmasSnowfall';

const ChristmasWrapper = () => {
  const pathname = usePathname();

  if (pathname === '/') {
    return <ChristmasSnowfall />;
  }

  return null;
};

export default ChristmasWrapper;
