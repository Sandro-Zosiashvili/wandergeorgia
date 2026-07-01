'use client';

import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { heroSlides } from '@/data/heroSlides';
import { useSlideshow } from '@/hooks/useSlideshow';
import Icon from '@/components/ui/Icon/Icon';
import styles from './HeroSlideshow.module.scss';

/**
 * Cross-fading, Ken-Burns hero backdrop. Each slide slowly pans/zooms while
 * fading into the next; dots let the visitor jump between destinations.
 */
export default function HeroSlideshow() {
  const { index, goTo } = useSlideshow({ count: heroSlides.length, interval: 6500 });
  const slide = heroSlides[index]!;

  return (
    <div className={styles.slideshow}>
      <AnimatePresence>
        <motion.div
          key={index}
          className={styles.slide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            className={styles.kenburns}
            initial={{ scale: 1.02 }}
            animate={{ scale: 1.16 }}
            transition={{ duration: 8, ease: 'linear' }}
          >
            <Image
              src={slide.image}
              alt={slide.alt}
              fill
              priority={index === 0}
              sizes="100vw"
              className={styles.image}
            />
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Cinematic overlays for legibility + depth. */}
      <div className={styles.scrim} aria-hidden="true" />
      <div className={styles.vignette} aria-hidden="true" />

      {/* Current place tag */}
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.place}
          className={styles.place}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.5 }}
        >
          <Icon name="map-pin" size={16} />
          <span>{slide.place}</span>
        </motion.div>
      </AnimatePresence>

      {/* Progress dots — the active one fills left→right over the slide's
          duration. Keying the fill on `index` remounts it each slide so the
          animation always restarts cleanly and runs fully to the end. */}
      <div className={styles.dots} role="tablist" aria-label="Hero slides">
        {heroSlides.map((s, i) => (
          <button
            key={s.place}
            className={[styles.dot, i === index ? styles.dotActive : ''].filter(Boolean).join(' ')}
            onClick={() => goTo(i)}
            role="tab"
            aria-selected={i === index}
            aria-label={`Show ${s.place}`}
          >
            {i === index ? <span key={index} className={styles.dotFill} /> : null}
          </button>
        ))}
      </div>
    </div>
  );
}
