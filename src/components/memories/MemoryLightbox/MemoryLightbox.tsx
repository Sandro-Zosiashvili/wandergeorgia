'use client';

import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect } from 'react';
import Image from 'next/image';
import type { Memory } from '@/data/memories';
import { flagFor } from '@/data/memories';
import Icon from '@/components/ui/Icon/Icon';
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll';
import styles from './MemoryLightbox.module.scss';

interface MemoryLightboxProps {
  /** The moments being browsed (already filtered by the caller). */
  items: Memory[];
  /** Index into `items` of the open moment, or null when closed. */
  index: number | null;
  onIndexChange: (index: number) => void;
  onClose: () => void;
}

const dateFmt = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});

/**
 * Centred lightbox for a single moment — shows the high-res photo or plays the
 * video clip, with its caption and traveler details. Navigate with the arrows
 * or ← / → keys, close with the button, the backdrop, or Esc.
 */
export default function MemoryLightbox({
  items,
  index,
  onIndexChange,
  onClose,
}: MemoryLightboxProps) {
  const open = index !== null;
  useLockBodyScroll(open);

  const count = items.length;
  const go = useCallback(
    (i: number) => {
      if (count === 0) return;
      onIndexChange(((i % count) + count) % count);
    },
    [count, onIndexChange],
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') go((index ?? 0) + 1);
      if (e.key === 'ArrowLeft') go((index ?? 0) - 1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, index, go, onClose]);

  if (typeof document === 'undefined') return null;

  const current = index !== null ? items[index] : null;

  return createPortal(
    <AnimatePresence>
      {open && current ? (
        <motion.div
          className={styles.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          onClick={onClose}
        >
          <button type="button" className={styles.close} onClick={onClose} aria-label="Close">
            <Icon name="close" size={22} />
          </button>

          <motion.div
            className={styles.dialog}
            role="dialog"
            aria-modal="true"
            aria-label={`${current.tourTitle} — ${current.travelerName}`}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.stage}>
              {current.type === 'video' ? (
                <video
                  key={current.id}
                  className={styles.video}
                  src={current.mediaUrl}
                  poster={current.thumbnailUrl}
                  controls
                  autoPlay
                  playsInline
                />
              ) : (
                <Image
                  key={current.id}
                  src={current.mediaUrl}
                  alt={current.caption}
                  fill
                  sizes="(min-width: 768px) 900px, 100vw"
                  className={styles.photo}
                  priority
                />
              )}

              {count > 1 ? (
                <>
                  <button
                    type="button"
                    className={`${styles.nav} ${styles.prev}`}
                    onClick={() => go((index ?? 0) - 1)}
                    aria-label="Previous moment"
                  >
                    <Icon name="chevron-left" size={26} stroke={2.2} />
                  </button>
                  <button
                    type="button"
                    className={`${styles.nav} ${styles.next}`}
                    onClick={() => go((index ?? 0) + 1)}
                    aria-label="Next moment"
                  >
                    <Icon name="chevron-right" size={26} stroke={2.2} />
                  </button>
                </>
              ) : null}
            </div>

            <div className={styles.info}>
              <span className={styles.locTag}>
                <Icon name="map-pin" size={14} />
                {current.tourTitle}
              </span>
              <p className={styles.caption}>“{current.caption}”</p>
              <div className={styles.meta}>
                <span className={styles.traveler}>
                  <span className={styles.flag} aria-hidden="true">
                    {flagFor(current.country)}
                  </span>
                  <span className={styles.name}>{current.travelerName}</span>
                  <span className={styles.country}>{current.country}</span>
                </span>
                <time className={styles.date} dateTime={current.date}>
                  {dateFmt.format(new Date(current.date))}
                </time>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
