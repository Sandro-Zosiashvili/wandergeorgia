/**
 * Shared domain types for WanderGeorgia tours.
 * English-only content.
 */

export type TourType = 'one-day' | 'multi-day';

/** A single point of interest featured within a tour. */
export interface TourLocation {
  name: string;
  description: string;
}

/** What a traveler gets — reused for the "Included" block on detail pages. */
export interface TourInclusion {
  label: string;
  /** Icon key resolved by the UI layer (see components/ui/Icon). */
  icon: string;
}

export interface Tour {
  /** URL-safe unique identifier used by /tours/[slug]. */
  slug: string;
  type: TourType;
  title: string;
  /** City / region the tour is based in — also used for filtering. */
  city: string;
  /** Human-readable duration, e.g. "8 hours" or "5 days". */
  duration: string;
  /** Price in Georgian Lari (GEL). */
  price: number;
  heroImage: string;
  cardImage: string;
  shortDescription: string;
  /** 3–5 highlighted places visited on the tour. */
  locations: TourLocation[];
  /** Everything bundled into the price. Always includes airport transfers. */
  included: TourInclusion[];
  /** Only meaningful for multi-day tours; number of days. */
  days?: number;
  /** Optional short marketing highlights shown on multi-day cards. */
  highlights?: string[];
}
