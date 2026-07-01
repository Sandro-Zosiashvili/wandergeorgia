'use client';

import { motion } from 'framer-motion';
import styles from './HeroScrollCue.module.scss';

/** Subtle animated "scroll" affordance at the base of the hero. */
export default function HeroScrollCue() {
  return (
    <motion.a
      href="#day-tours"
      className={styles.cue}
      aria-label="Scroll to tours"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.2, duration: 0.8 }}
    >
      <span className={styles.label}>Scroll</span>
      <span className={styles.track} aria-hidden="true">
        <motion.span
          className={styles.dot}
          animate={{ y: [0, 18, 0], opacity: [1, 0.2, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
      </span>
    </motion.a>
  );
}
