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
  /** Numeric id — handy for keys / external references. */
  id?: number;
  /** URL-safe unique identifier used by /tours/[slug]. */
  slug: string;
  type: TourType;
  title: string;
  /** City / region the tour is based in — also used for filtering. */
  city: string;
  /** Human-readable duration, e.g. "8 hours" or "5 days". */
  duration: string;
  /** Free-text tour format, e.g. "Private tour with an English-speaking driver". */
  tourType?: string;
  /** Price in Georgian Lari (GEL). */
  price: number;
  /**
   * Single source-of-truth photo. In the one-day data this is the only image
   * you edit; card + hero images are derived from it automatically.
   */
  image?: string;
  heroImage: string;
  cardImage: string;
  /** One-line teaser shown on cards. */
  shortDescription: string;
  /** Longer intro paragraph shown on the detail page. */
  overview?: string;
  /** 3–5 highlighted places visited on the tour. */
  locations: TourLocation[];
  /** Everything bundled into the price. */
  included: TourInclusion[];
  /** Things the traveler pays for separately. */
  notIncluded?: string[];
  /** Only meaningful for multi-day tours; number of days. */
  days?: number;
  /** Optional short marketing highlights (bullet list). */
  highlights?: string[];
}
