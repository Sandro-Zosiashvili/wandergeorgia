'use client';

import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import type { Memory } from '@/data/memories';
import { flagFor } from '@/data/memories';
import Icon from '@/components/ui/Icon/Icon';
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll';
import { useLocale } from '@/hooks/useLocale';
import { ui } from '@/lib/uiStrings';
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
  const m = ui(useLocale()).memories;
  const open = index !== null;
  useLockBodyScroll(open);

  const videoRef = useRef<HTMLVideoElement>(null);
  // Photo fullscreen is a self-contained high-z overlay (the Fullscreen API is
  // unreliable for an element with a cross-origin <img> on some browsers);
  // videos use the native fullscreen so the player chrome comes along.
  const [photoFull, setPhotoFull] = useState(false);
  // Tracks whether the current moment's high-res photo has finished loading, so
  // we can show a spinner (instead of a black stage) while it downloads.
  const [imgReady, setImgReady] = useState(false);

  const count = items.length;
  const go = useCallback(
    (i: number) => {
      if (count === 0) return;
      onIndexChange(((i % count) + count) % count);
    },
    [count, onIndexChange],
  );

  // Reset the photo-fullscreen overlay + the photo loading state whenever the
  // moment changes or the lightbox closes.
  useEffect(() => {
    setPhotoFull(false);
    setImgReady(false);
  }, [index]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (photoFull) {
        if (e.key === 'Escape') setPhotoFull(false);
        return; // the overlay owns the keyboard while it's up
      }
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') go((index ?? 0) + 1);
      if (e.key === 'ArrowLeft') go((index ?? 0) - 1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, index, go, onClose, photoFull]);

  const current = index !== null ? items[index] : null;

  const expand = useCallback(() => {
    if (!current) return;
    if (current.type !== 'video') {
      setPhotoFull(true);
      return;
    }
    const v = videoRef.current;
    if (!v) return;
    const vv = v as HTMLVideoElement & {
      webkitEnterFullscreen?: () => void;
      webkitRequestFullscreen?: () => void;
    };
    // CRITICAL: everything here must run synchronously inside the click gesture.
    // iOS blocks fullscreen requested from a later async callback (e.g. waiting
    // for loadedmetadata), which is why deferring used to fail on mobile.
    // Kick playback so the player has media to show; ignore the autoplay promise.
    try {
      const p = v.play();
      if (p && typeof p.catch === 'function') p.catch(() => {});
    } catch {
      /* ignore */
    }

    if (typeof vv.webkitEnterFullscreen === 'function') {
      // iOS Safari / iOS Chrome — native video fullscreen (no element FS API).
      vv.webkitEnterFullscreen();
    } else if (typeof v.requestFullscreen === 'function') {
      // Desktop + Android Chrome/Firefox.
      void v.requestFullscreen().catch(() => {});
    } else if (typeof vv.webkitRequestFullscreen === 'function') {
      // Older WebKit/Android fallback.
      vv.webkitRequestFullscreen();
    }
  }, [current]);

  if (typeof document === 'undefined') return null;

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
                  ref={videoRef}
                  className={styles.video}
                  src={current.mediaUrl}
                  poster={current.thumbnailUrl || undefined}
                  controls
                  autoPlay
                  muted
                  playsInline
                  preload="metadata"
                />
              ) : (
                <>
                  {!imgReady ? <span className={styles.loader} aria-label={m.loadingPhoto} /> : null}
                  <Image
                    key={current.id}
                    src={current.mediaUrl}
                    alt={current.caption}
                    fill
                    sizes="(min-width: 768px) 684px, 100vw"
                    className={[styles.photo, imgReady ? styles.photoReady : ''].filter(Boolean).join(' ')}
                    priority
                    onLoad={() => setImgReady(true)}
                  />
                </>
              )}

              <button
                type="button"
                className={styles.expand}
                onClick={expand}
                aria-label={current.type === 'video' ? m.playFullscreen : m.viewFullscreen}
                title="Fullscreen"
              >
                <Icon name="maximize" size={18} stroke={2} />
              </button>

              {count > 1 ? (
                <>
                  <button
                    type="button"
                    className={`${styles.nav} ${styles.prev}`}
                    onClick={() => go((index ?? 0) - 1)}
                    aria-label={m.prevMoment}
                  >
                    <Icon name="chevron-left" size={26} stroke={2.2} />
                  </button>
                  <button
                    type="button"
                    className={`${styles.nav} ${styles.next}`}
                    onClick={() => go((index ?? 0) + 1)}
                    aria-label={m.nextMoment}
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

          {/* Photo fullscreen — the whole image, uncropped, on black. */}
          <AnimatePresence>
            {photoFull && current.type === 'image' ? (
              <motion.div
                className={styles.fullscreen}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={(e) => {
                  e.stopPropagation();
                  setPhotoFull(false);
                }}
              >
                <button
                  type="button"
                  className={styles.close}
                  onClick={(e) => {
                    e.stopPropagation();
                    setPhotoFull(false);
                  }}
                  aria-label={m.exitFullscreen}
                >
                  <Icon name="close" size={22} />
                </button>
                <Image
                  src={current.mediaUrl}
                  alt={current.caption}
                  fill
                  sizes="100vw"
                  className={styles.fullImage}
                  priority
                />
              </motion.div>
            ) : null}
          </AnimatePresence>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
