'use client';

import React, { ReactNode, useCallback, useEffect, useState } from 'react';

interface ScrollValue {
  scrollY: number;
  scrollHeight: number;
  innerHeight: number;
}

export const ScrollContext = React.createContext<ScrollValue>({
  scrollY: 0,
  scrollHeight: 0,
  innerHeight: 0,
});

export function ScrollObserver({ children }: { children: ReactNode }) {
  const [scrollY, setScrollY] = useState<number>(0);
  const [scrollHeight, setScrollHeight] = useState<number>(0);
  const [innerHeight, setInnerHeight] = useState<number>(0);

  const handleScroll = useCallback(() => {
    setScrollY(window.scrollY);
  }, []);

  useEffect(() => {
    setScrollHeight(document.documentElement.scrollHeight);
    setInnerHeight(window.innerHeight);
    document.addEventListener('scroll', handleScroll, { passive: true });
    return () => document.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return (
    <ScrollContext.Provider value={{ scrollHeight, scrollY, innerHeight }}>
      {children}
    </ScrollContext.Provider>
  );
}
