'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { ImagePosition } from '@/types/tour';
import Icon from '@/components/ui/Icon/Icon';
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
 * no auto-advance. While browsing, the heavy overlay dims so the photo is
 * unobstructed; only the small "Day N · Place" caption stays.
 */
export default function TourHeroSlideshow({ slides, onBrowsingChange }: TourHeroSlideshowProps) {
  const count = slides.length;
  const [index, setIndex] = useState(0);
  const [browsing, setBrowsing] = useState(false);
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

      <div className={styles.caption}>
        <Icon name="map-pin" size={15} />
        <span>{slides[index]!.label}</span>
      </div>

      <div className={styles.controls}>
        <button
          type="button"
          className={`${styles.arrow} ${styles.prev}`}
          onClick={() => go(index - 1)}
          aria-label="Previous photo"
        >
          <Icon name="chevron-right" size={26} stroke={2.4} />
        </button>
        <button
          type="button"
          className={`${styles.arrow} ${styles.next}`}
          onClick={() => go(index + 1)}
          aria-label="Next photo"
        >
          <Icon name="chevron-right" size={26} stroke={2.4} />
        </button>
      </div>

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
    </div>
  );
}
