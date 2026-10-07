'use client';

import { useEffect } from 'react';

/**
 * Global body scroll lock for modals, lightboxes, drawers and mobile menus.
 *
 * Features:
 * - **Reference counted** — multiple overlays can be open at once; the lock is
 *   applied on the first and released only when the last one closes, so closing
 *   one overlay never unlocks the page while another is still open.
 * - **Scrollbar compensation** — pads the body (and, via `--scrollbar-gap`, any
 *   fixed chrome such as the header) by the width the scrollbar occupied, so the
 *   layout doesn't jump horizontally when it disappears. On overlay-scrollbar
 *   platforms (e.g. macOS) the width is 0 and nothing is padded.
 */

let lockCount = 0;
let scrollEl: HTMLElement | null = null;
let savedOverflow = '';
let savedPaddingRight = '';

function applyLock(): void {
  const body = document.body;
  // Lock the element that actually scrolls the viewport — this is <html>
  // (documentElement) in standards mode, NOT <body>. Setting overflow on the
  // wrong element is a no-op, which is the classic "modal open but page still
  // scrolls" bug.
  const root = (document.scrollingElement as HTMLElement | null) ?? document.documentElement;
  scrollEl = root;

  // How much horizontal space the scrollbar took up (0 with overlay scrollbars).
  const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

  savedOverflow = root.style.overflow;
  savedPaddingRight = body.style.paddingRight;

  root.style.overflow = 'hidden';

  if (scrollbarWidth > 0) {
    const current = parseFloat(window.getComputedStyle(body).paddingRight) || 0;
    body.style.paddingRight = `${current + scrollbarWidth}px`;
    // Fixed-position elements (e.g. the header) read this to match the shift.
    document.documentElement.style.setProperty('--scrollbar-gap', `${scrollbarWidth}px`);
  }
}

function releaseLock(): void {
  if (scrollEl) scrollEl.style.overflow = savedOverflow;
  document.body.style.paddingRight = savedPaddingRight;
  document.documentElement.style.removeProperty('--scrollbar-gap');
  scrollEl = null;
}

/** Lock body scroll while `locked` is true. */
export function useLockBodyScroll(locked: boolean): void {
  useEffect(() => {
    if (!locked) return;

    lockCount += 1;
    if (lockCount === 1) applyLock();

    return () => {
      lockCount -= 1;
      if (lockCount === 0) releaseLock();
    };
  }, [locked]);
}
