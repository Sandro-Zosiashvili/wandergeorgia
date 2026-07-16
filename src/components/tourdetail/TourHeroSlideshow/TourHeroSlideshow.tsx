'use client';

import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import type { ImagePosition } from '@/types/tour';
import { useSlideshow } from '@/hooks/useSlideshow';
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
}

/**
 * Cross-fading hero backdrop for multi-day tours: it cycles through the photos
 * of each day so a visitor can preview the whole journey, and offers arrows +
 * dots to step through them manually.
 */
export default function TourHeroSlideshow({ slides }: TourHeroSlideshowProps) {
  const { index, goTo, next, prev } = useSlideshow({ count: slides.length, interval: 5000 });
  const slide = slides[index]!;

  return (
    <div className={styles.slideshow}>
      <AnimatePresence>
        <motion.div
          key={index}
          className={styles.slide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          <Image
            src={slide.image}
            alt={slide.label}
            fill
            priority={index === 0}
            sizes="100vw"
            className={styles.image}
            style={{ objectPosition: slide.imagePosition ?? 'center' }}
          />
        </motion.div>
      </AnimatePresence>

      <div className={styles.scrim} aria-hidden="true" />

      {/* Current-day caption */}
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.label}
          className={styles.caption}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.4 }}
        >
          <Icon name="map-pin" size={15} />
          <span>{slide.label}</span>
        </motion.div>
      </AnimatePresence>

      {/* Manual navigation */}
      <button
        type="button"
        className={`${styles.arrow} ${styles.prev}`}
        onClick={prev}
        aria-label="Previous photo"
      >
        <Icon name="chevron-right" size={22} />
      </button>
      <button
        type="button"
        className={`${styles.arrow} ${styles.next}`}
        onClick={next}
        aria-label="Next photo"
      >
        <Icon name="chevron-right" size={22} />
      </button>

      <div className={styles.dots} role="tablist" aria-label="Tour photos">
        {slides.map((s, i) => (
          <button
            key={s.label}
            type="button"
            className={[styles.dot, i === index ? styles.dotActive : ''].filter(Boolean).join(' ')}
            onClick={() => goTo(i)}
            role="tab"
            aria-selected={i === index}
            aria-label={`Show ${s.label}`}
          />
        ))}
      </div>
    </div>
  );
}
