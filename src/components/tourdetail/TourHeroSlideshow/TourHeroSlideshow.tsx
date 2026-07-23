'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { ImagePosition } from '@/types/tour';
import Icon from '@/components/ui/Icon/Icon';
import TourPhotoGallery from '../TourPhotoGallery/TourPhotoGallery';
import styles from './TourHeroSlideshow.module.scss';

export interface HeroSlide {
  image: string;
  /** Caption shown over the slide, e.g. 'Day 2 · Kakheti Wine Region'. */
  label: string;
  imagePosition?: ImagePosition;
}

interface TourHeroSlideshowProps {
  slides: HeroSlide[];
  /**
   * Notifies the parent hero when the visitor is actively flipping through
   * photos, so it can fade its overlaid title/facts out of the way and back.
   */
  onBrowsingChange?: (browsing: boolean) => void;
}

/**
 * Manual hero gallery for multi-day tours. All photos are preloaded and stacked,
 * so stepping through them is an instant CSS cross-fade — no lazy-load stutter,
 * no auto-advance. Dots give a quick at-a-glance flip through days; the
 * "Photos" pill is the one control that also opens the fullscreen gallery,
 * on phones and desktop alike.
 */
export default function TourHeroSlideshow({ slides, onBrowsingChange }: TourHeroSlideshowProps) {
  const count = slides.length;
  const [index, setIndex] = useState(0);
  const [browsing, setBrowsing] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const idleTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const setBrowsingBoth = useCallback(
    (b: boolean) => {
      setBrowsing(b);
      onBrowsingChange?.(b);
    },
    [onBrowsingChange],
  );

  const go = useCallback(
    (i: number) => {
      setIndex(((i % count) + count) % count);
      setBrowsingBoth(true);
      if (idleTimer.current) clearTimeout(idleTimer.current);
      idleTimer.current = setTimeout(() => setBrowsingBoth(false), 6000);
    },
    [count, setBrowsingBoth],
  );

  useEffect(() => () => {
    if (idleTimer.current) clearTimeout(idleTimer.current);
  }, []);

  return (
    <div className={styles.slideshow}>
      {slides.map((s, i) => (
        <div
          key={s.label}
          className={styles.slide}
          style={{ opacity: i === index ? 1 : 0 }}
          aria-hidden={i !== index}
        >
          <Image
            src={s.image}
            alt={i === index ? s.label : ''}
            fill
            priority={i === 0}
            sizes="100vw"
            className={styles.image}
            style={{ objectPosition: s.imagePosition ?? 'center' }}
          />
        </div>
      ))}

      {/* Scrim eases back while browsing so the photo reads clearly. */}
      <div
        className={[styles.scrim, browsing ? styles.scrimDim : ''].filter(Boolean).join(' ')}
        aria-hidden="true"
      />

      <div className={styles.dots} role="tablist" aria-label="Tour photos">
        {slides.map((s, i) => (
          <button
            key={s.label}
            type="button"
            className={[styles.dot, i === index ? styles.dotActive : ''].filter(Boolean).join(' ')}
            onClick={() => go(i)}
            role="tab"
            aria-selected={i === index}
            aria-label={`Show ${s.label}`}
          />
        ))}
      </div>

      {/* The one photo control, phones and desktop alike. TourHero reserves
          room in .facts so its text never wraps into this corner. */}
      <button
        type="button"
        className={styles.galleryTrigger}
        onClick={() => setGalleryOpen(true)}
      >
        <Icon name="images" size={15} />
        <span>Photos</span>
      </button>

      <TourPhotoGallery
        open={galleryOpen}
        photos={slides}
        index={index}
        onIndexChange={setIndex}
        onClose={() => setGalleryOpen(false)}
      />
    </div>
  );
}
