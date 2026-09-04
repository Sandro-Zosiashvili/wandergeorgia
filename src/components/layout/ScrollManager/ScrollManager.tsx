'use client';

import { useEffect } from 'react';

/**
 * Guarantees a fresh page load lands at the very top.
 *
 * Browsers restore the previous scroll position on reload (scrollRestoration
 * 'auto'), which on the landing page dropped the visitor a little below the top
 * on refresh. We switch restoration to manual so the browser never does this,
 * then snap to the top on the first mount — unless the URL carries a hash, in
 * which case the in-page anchor target wins.
 *
 * Runs once per hard load (the root layout doesn't remount on client-side
 * navigation), so it never fights Next's own back/forward scroll handling.
 */
export default function ScrollManager() {
  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    if (!window.location.hash) {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
    }
  }, []);

  return null;
}
