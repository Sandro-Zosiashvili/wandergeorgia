'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { isLocale } from '@/lib/locale';

/** Home-page section ids that the hash nav links point at, top → bottom. */
const SECTION_IDS = ['day-tours', 'packages', 'why-us', 'contact'] as const;

/** Strip the locale prefix from a pathname, e.g. '/ru/memories' → '/memories',
 *  '/en' → '/'. */
function unprefixed(pathname: string): string {
  const parts = pathname.split('/'); // ['', 'ru', 'memories']
  const rest = isLocale(parts[1]) ? '/' + parts.slice(2).join('/') : pathname;
  return rest === '' ? '/' : rest;
}

/**
 * Returns the href of the nav item that matches where the visitor currently is,
 * locale-independent (so '/ru/memories' highlights the '/memories' item). On
 * the home page it scroll-spies the current section.
 */
export function useActiveNav(): string {
  const pathname = usePathname();
  const path = unprefixed(pathname ?? '/');
  const [hash, setHash] = useState('');

  useEffect(() => {
    if (path !== '/') {
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
  }, [path]);

  if (path !== '/') return path;
  return hash ? `/${hash}` : '/';
}
