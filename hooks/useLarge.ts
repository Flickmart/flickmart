import * as React from "react";

const LARGE_BREAKPOINT = 1024;

export function useIsLarge() {
  const [isLarge, setIsLarge] = React.useState<boolean | undefined>(undefined);

  React.useEffect(() => {
    const mql = window.matchMedia(`(min-width: ${LARGE_BREAKPOINT}px)`);
    const onChange = () => {
      setIsLarge(mql.matches);
    };
    mql.addEventListener("change", onChange);
    setIsLarge(mql.matches);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return !!isLarge;
}
