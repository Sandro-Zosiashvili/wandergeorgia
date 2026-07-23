'use client';

import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Icon from '@/components/ui/Icon/Icon';
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll';
import styles from './TourPhotoGallery.module.scss';

const DESKTOP_QUERY = '(min-width: 768px)';
const DISMISS_THRESHOLD = 110;

/**
 * Resolved synchronously (not via the shared useMediaQuery, which defaults to
 * false until mount) so the very first animation frame already targets the
 * right variant — this component only ever mounts after a client click, so
 * there's no SSR mismatch to guard against.
 */
function readIsDesktop() {
  return typeof window !== 'undefined' && window.matchMedia(DESKTOP_QUERY).matches;
}

export interface GalleryPhoto {
  image: string;
  label: string;
}

interface TourPhotoGalleryProps {
  open: boolean;
  photos: GalleryPhoto[];
  index: number;
  onIndexChange: (i: number) => void;
  onClose: () => void;
}

/**
 * Fullscreen gallery for browsing every tour photo uncropped. On phones it's
 * a bottom sheet — slides up leaving a small peek of the page above it, drag
 * the handle down (or swipe past the threshold) to dismiss. On desktop it's a
 * centred lightbox instead, closed via the backdrop, the close button, or Esc.
 *
 * The mount/unmount slide-or-fade is framer's AnimatePresence; the drag-to-
 * dismiss offset is plain pointer-event state on an inner layer instead of
 * framer's `drag` prop — `drag` and `animate`/`exit` fighting over the same
 * `y` value is what caused the sheet to freeze mid-transition.
 */
export default function TourPhotoGallery({
  open,
  photos,
  index,
  onIndexChange,
  onClose,
}: TourPhotoGalleryProps) {
  useLockBodyScroll(open);
  const [isDesktop, setIsDesktop] = useState(readIsDesktop);
  const [dragY, setDragY] = useState(0);
  const [dragging, setDragging] = useState(false);
  const count = photos.length;
  const draggingRef = useRef(false);
  const startYRef = useRef(0);

  useEffect(() => {
    const mql = window.matchMedia(DESKTOP_QUERY);
    const onChange = () => setIsDesktop(mql.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    if (open) return;
    setDragY(0);
    setDragging(false);
  }, [open]);

  const go = useCallback(
    (i: number) => onIndexChange(((i % count) + count) % count),
    [count, onIndexChange],
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') go(index + 1);
      if (e.key === 'ArrowLeft') go(index - 1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose, go, index]);

  const onDragPointerDown = (e: React.PointerEvent) => {
    draggingRef.current = true;
    startYRef.current = e.clientY;
    setDragging(true);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onDragPointerMove = (e: React.PointerEvent) => {
    if (!draggingRef.current) return;
    setDragY(Math.max(0, e.clientY - startYRef.current));
  };

  const endDrag = () => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    setDragging(false);
    if (dragY > DISMISS_THRESHOLD) {
      onClose();
    } else {
      setDragY(0);
    }
  };

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {open ? (
        <motion.div
          className={styles.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
        >
          <motion.div
            className={styles.enterLayer}
            initial={isDesktop ? { opacity: 0, scale: 0.96 } : { y: '100%' }}
            animate={isDesktop ? { opacity: 1, scale: 1 } : { y: 0 }}
            exit={isDesktop ? { opacity: 0, scale: 0.96 } : { y: '100%' }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className={styles.sheet}
              role="dialog"
              aria-modal="true"
              aria-label="All tour photos"
              style={{
                transform: dragY ? `translateY(${dragY}px)` : undefined,
                transition: dragging ? 'none' : undefined,
              }}
            >
              <div
                className={styles.dragZone}
                onPointerDown={onDragPointerDown}
                onPointerMove={onDragPointerMove}
                onPointerUp={endDrag}
                onPointerCancel={endDrag}
              >
                <span className={styles.handle} aria-hidden="true" />
              </div>

              <div className={styles.header}>
                <span className={styles.counter}>
                  {index + 1} / {count}
                </span>
                <button
                  type="button"
                  className={styles.close}
                  onClick={onClose}
                  aria-label="Close gallery"
                >
                  <Icon name="close" size={22} />
                </button>
              </div>

              <div className={styles.viewer}>
                {photos.map((p, i) => (
                  <div
                    key={p.label}
                    className={styles.frame}
                    style={{ opacity: i === index ? 1 : 0 }}
                    aria-hidden={i !== index}
                  >
                    <Image
                      src={p.image}
                      alt={p.label}
                      fill
                      sizes="(min-width: 768px) 1100px, 100vw"
                      className={styles.photo}
                      priority={i === index}
                    />
                  </div>
                ))}

                {count > 1 ? (
                  <>
                    <button
                      type="button"
                      className={`${styles.navBtn} ${styles.navPrev}`}
                      onClick={() => go(index - 1)}
                      aria-label="Previous photo"
                    >
                      <Icon name="chevron-right" size={26} stroke={2.2} />
                    </button>
                    <button
                      type="button"
                      className={`${styles.navBtn} ${styles.navNext}`}
                      onClick={() => go(index + 1)}
                      aria-label="Next photo"
                    >
                      <Icon name="chevron-right" size={26} stroke={2.2} />
                    </button>
                  </>
                ) : null}
              </div>

              <p className={styles.caption}>{photos[index]?.label}</p>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
