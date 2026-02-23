'use client';

import { type ReactNode, useEffect, useState } from 'react';

const layout = ({ children }: { children: ReactNode }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  if (typeof window !== 'undefined') {
    return <>{children}</>;
  }
};
export default layout;
