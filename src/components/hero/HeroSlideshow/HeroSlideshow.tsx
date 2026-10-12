'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import type { HeroSlide } from '@/lib/publicHeroApi';
import { useSlideshow } from '@/hooks/useSlideshow';
import Icon from '@/components/ui/Icon/Icon';
import styles from './HeroSlideshow.module.scss';

interface HeroSlideshowProps {
  /** Slides fetched server-side from the DB. */
  slides: HeroSlide[];
}

/** Each slide is shown for exactly this long before advancing. */
const SLIDE_MS = 5000;

/**
 * Cross-fading, Ken-Burns hero backdrop. Every slide is rendered at once
 * (stacked, only the active one visible) so all images are loaded up front —
 * transitions never stall waiting for a lazy image. The index advances on a
 * strict fixed timer and wraps seamlessly, so the loop is smooth and the timing
 * is identical for every slide.
 */
export default function HeroSlideshow({ slides }: HeroSlideshowProps) {
  const { index } = useSlideshow({ count: slides.length, interval: SLIDE_MS });

  if (!slides.length) return null;
  const current = slides[index] ?? slides[0]!;

  return (
    <div className={styles.slideshow}>
      {slides.map((slide, i) => {
        const isActive = i === index;
        return (
          <div
            key={slide.id}
            className={styles.slide}
            style={{ opacity: isActive ? 1 : 0 }}
            aria-hidden={!isActive}
          >
            <motion.div
              className={styles.kenburns}
              initial={{ scale: 1.04 }}
              animate={{ scale: isActive ? 1.16 : 1.04 }}
              transition={
                isActive
                  ? { duration: 7, ease: 'linear' }
                  : { duration: 1.4, ease: [0.22, 1, 0.36, 1] }
              }
            >
              <Image
                src={slide.imageUrl}
                alt={slide.alt}
                fill
                // First slide is the LCP element (preload); the rest load
                // eagerly so they're ready before their turn — no mid-loop freeze.
                priority={i === 0}
                loading={i === 0 ? undefined : 'eager'}
                sizes="100vw"
                className={styles.image}
              />
            </motion.div>
          </div>
        );
      })}

      {/* Cinematic overlays for legibility + depth. */}
      <div className={styles.scrim} aria-hidden="true" />
      <div className={styles.vignette} aria-hidden="true" />

      {/* Current place tag — fades in on each change. */}
      {current.place ? (
        <motion.div
          key={current.id}
          className={styles.place}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Icon name="map-pin" size={16} />
          <span>{current.place}</span>
        </motion.div>
      ) : null}
    </div>
  );
}
