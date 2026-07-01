import type { Tour } from '@/types/tour';
import { oneDayTours } from './oneDayTours';
import { multiDayTours } from './multiDayTours';

export { oneDayTours, multiDayTours };

/** All tours, one-day first. */
export const allTours: Tour[] = [...oneDayTours, ...multiDayTours];

/** Look up a single tour by its slug. */
export function getTourBySlug(slug: string): Tour | undefined {
  return allTours.find((tour) => tour.slug === slug);
}

/** Every slug — used by generateStaticParams for /tours/[slug]. */
export function getAllTourSlugs(): string[] {
  return allTours.map((tour) => tour.slug);
}

/** Distinct cities across the one-day tours, in first-seen order. */
export function getOneDayCities(): string[] {
  return Array.from(new Set(oneDayTours.map((tour) => tour.city)));
}
