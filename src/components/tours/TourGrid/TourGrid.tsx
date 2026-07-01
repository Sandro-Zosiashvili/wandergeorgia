'use client';

import { AnimatePresence, motion } from 'framer-motion';
import type { Tour } from '@/types/tour';
import TourCard from '../TourCard/TourCard';
import styles from './TourGrid.module.scss';

interface TourGridProps {
  tours: Tour[];
  /** Make the first card a wide feature card. */
  featureFirst?: boolean;
}

/** Responsive, animated grid of day-tour cards. */
export default function TourGrid({ tours, featureFirst = false }: TourGridProps) {
  return (
    <motion.div layout className={styles.grid}>
      <AnimatePresence mode="popLayout">
        {tours.map((tour, i) => (
          <motion.div
            key={tour.slug}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1], delay: i * 0.04 }}
            className={
              featureFirst && i === 0 ? styles.featuredCell : undefined
            }
          >
            <TourCard tour={tour} featured={featureFirst && i === 0} />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}
