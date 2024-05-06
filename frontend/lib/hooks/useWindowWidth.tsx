import { useState, useEffect } from 'react';

export function useWindowWidth(debounceTime: number = 200) {
  const [windowWidth, setWindowWidth] = useState<number | undefined>(undefined);
  let timeoutId: NodeJS.Timeout | undefined;

  useEffect(() => {
    function handleResize() {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setWindowWidth(window.innerWidth);
      }, debounceTime);
    }

    window.addEventListener('resize', handleResize);
    handleResize();
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', handleResize);
    };
  }, [debounceTime]);

  return [windowWidth];
}
