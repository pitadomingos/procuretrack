
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(false); // Default to false (desktop-first)
  const [hasMounted, setHasMounted] = React.useState(false);

  React.useEffect(() => {
    setHasMounted(true);
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(mql.matches);
    };
    
    // Set initial value after mount
    setIsMobile(mql.matches);
    
    mql.addEventListener("change", onChange);
    
    return () => mql.removeEventListener("change", onChange);
  }, []);

  // Before mount, or on server, return the default (false). After mount, return actual state.
  // This helps prevent hydration mismatches for components that render differently based on mobile status.
  return hasMounted ? isMobile : false;
}
