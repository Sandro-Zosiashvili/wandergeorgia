'use client';

import { useCallback, useEffect, useState } from 'react';

interface UseSlideshowOptions {
  count: number;
  /** Milliseconds each slide is shown. */
  interval?: number;
  autoPlay?: boolean;
}

interface UseSlideshowResult {
  index: number;
  goTo: (i: number) => void;
  next: () => void;
  prev: () => void;
}

/**
 * Auto-advancing index for the hero slideshow. Pauses when the tab is hidden
 * and respects prefers-reduced-motion by not auto-advancing.
 */
export function useSlideshow({
  count,
  interval = 6000,
  autoPlay = true,
}: UseSlideshowOptions): UseSlideshowResult {
  const [index, setIndex] = useState(0);

  const goTo = useCallback((i: number) => setIndex(((i % count) + count) % count), [count]);
  const next = useCallback(() => setIndex((i) => (i + 1) % count), [count]);
  const prev = useCallback(() => setIndex((i) => (i - 1 + count) % count), [count]);

  useEffect(() => {
    if (!autoPlay || count <= 1) return;

    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    let timer = window.setInterval(next, interval);

    const onVisibility = () => {
      window.clearInterval(timer);
      if (!document.hidden) timer = window.setInterval(next, interval);
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      window.clearInterval(timer);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [autoPlay, count, interval, next]);

  return { index, goTo, next, prev };
}
