'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

/** Home-page section ids that the hash nav links point at, top → bottom. */
const SECTION_IDS = ['day-tours', 'packages', 'why-us', 'contact'] as const;

/**
 * Returns the href of the nav item that matches where the visitor currently is:
 * on the home page it scroll-spies the section whose top has passed under the
 * header; elsewhere it's just the current path. Used to highlight the active
 * link in the header and mobile menu.
 */
export function useActiveNav(): string {
  const pathname = usePathname();
  const [hash, setHash] = useState('');

  useEffect(() => {
    if (pathname !== '/') {
      setHash('');
      return;
    }

    const update = () => {
      const line = 140; // just below the fixed header
      let current = '';
      for (const id of SECTION_IDS) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= line) current = `#${id}`;
      }
      setHash(current);
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [pathname]);

  if (pathname !== '/') return pathname;
  return hash ? `/${hash}` : '/';
}
