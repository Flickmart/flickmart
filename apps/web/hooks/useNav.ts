import { useEffect, useState } from 'react';

export default function useNav() {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  function handleScroll() {
    if (window.scrollY > lastScrollY) {
      setIsVisible(false); // Hide on scroll down
    } else {
      setIsVisible(true); // Show on scroll up
    }
    setLastScrollY(window.scrollY);
  }

  useEffect(() => {
    addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return isVisible;
}
