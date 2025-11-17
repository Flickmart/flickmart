import { useState, useEffect } from "react";

function useResponsive(mediaQuery: string) {
  let media: MediaQueryList;
  const [matchesBreakpoint, setMatchesBreakpoint] = useState(false);

  const handleResize = () => {
    setMatchesBreakpoint(media.matches);
  };

  useEffect(() => {
    media = matchMedia(`(${mediaQuery})`);
    setMatchesBreakpoint(media.matches);
    media.addEventListener("change", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return matchesBreakpoint;
}

export default useResponsive;
