'use client';

import { useEffect, useRef, useState, type RefObject } from 'react';

interface UseInViewOptions {
  /** Stop watching after the first reveal. */
  once?: boolean;
  /**
   * How far into the viewport (from the bottom) the element's top must reach
   * before it counts as visible, as a fraction of viewport height. 0.15 means
   * "reveal once the top is within the bottom 85% of the screen".
   */
  amount?: number;
}

/**
 * Viewport-reveal hook based on a scroll-position check (rAF-throttled) rather
 * than IntersectionObserver — deliberately, so reveals are reliable in every
 * environment. Returns a ref to attach and a boolean that flips true when the
 * element scrolls into view.
 */
export function useInView<T extends HTMLElement>(
  { once = true, amount = 0.15 }: UseInViewOptions = {},
): [RefObject<T | null>, boolean] {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let frame = 0;
    let settleTimer = 0;
    let active = true;

    const check = () => {
      if (!active) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      const revealLine = vh * (1 - amount);
      const visible = rect.top < revealLine && rect.bottom > 0;

      if (visible) {
        setInView(true);
        if (once) teardown();
      } else if (!once) {
        setInView(false);
      }
    };

    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(check);
    };

    const teardown = () => {
      active = false;
      cancelAnimationFrame(frame);
      window.clearTimeout(settleTimer);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };

    // Check now, on the next frame, and once more after layout/fonts settle —
    // this reliably catches content already in view without a scroll event.
    check();
    frame = requestAnimationFrame(check);
    settleTimer = window.setTimeout(check, 150);

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    return teardown;
  }, [once, amount]);

  return [ref, inView];
}
