/**
 * ────────────────────────────────────────────────────────────────────────────
 *  PER-TOUR SEO COPY  —  single place to audit titles / descriptions / keywords
 * ────────────────────────────────────────────────────────────────────────────
 *  Keyed by tour `slug`. Consumed by generateMetadata() in
 *  src/app/tours/[slug]/page.tsx.
 *
 *  Guidelines (kept within these so Google doesn't truncate):
 *   • title        ≤ 60 characters, keyword-first, includes the location.
 *     Rendered as an ABSOLUTE title (no " · WanderKartli" suffix) so the full
 *     length is under our control.
 *   • description  ~150–160 characters, a compelling call-to-action that names
 *     the private driver-guide, the vehicle (4x4 / minivan / car) and the pace.
 *   • keywords     targeted search terms, most specific first.
 *
 *  Any tour without an entry falls back to its on-page title + shortDescription.
 * ────────────────────────────────────────────────────────────────────────────
 */

export interface TourSeo {
  title: string;
  description: string;
  keywords: string[];
}

export const tourSeo: Record<string, TourSeo> = {
  // ── One-day tours ─────────────────────────────────────────────────────────
  'kazbegi-day-tour': {
    title: 'Kazbegi Day Tour from Tbilisi | Private 4x4 & Guide',
    description:
      'Private Kazbegi day tour from Tbilisi with an English-speaking driver-guide. Gergeti Trinity Church, Ananuri and Gudauri by comfortable 4x4 — book your trip.',
    keywords: [
      'Kazbegi tour',
      'Kazbegi day tour from Tbilisi',
      'Gergeti Trinity Church tour',
      'Kazbegi tour with driver',
      'private tours Georgia',
    ],
  },
  'borjomi-day-tour': {
    title: 'Borjomi Day Tour from Tbilisi | Gori & Uplistsikhe',
    description:
      'Private Borjomi day tour from Tbilisi with a local driver-guide. See Gori, the Uplistsikhe cave city and Borjomi mineral park by comfortable car — book online.',
    keywords: [
      'Borjomi tour',
      'Borjomi day tour from Tbilisi',
      'Uplistsikhe tour',
      'Gori day trip',
      'private tours Georgia',
    ],
  },
  'dashbashi-canyon-day-tour': {
    title: 'Dashbashi Canyon Day Tour | Diamond Glass Bridge',
    description:
      'Private Dashbashi Canyon day tour with a local driver-guide. Walk the Diamond glass bridge, chase waterfalls and canyon views — transfers included, book now.',
    keywords: [
      'Dashbashi Canyon tour',
      'Diamond Bridge Georgia',
      'Tsalka canyon day trip',
      'private day tour Georgia',
    ],
  },
  'martvili-prometheus-day-tour': {
    title: 'Martvili Canyon & Prometheus Cave Day Tour',
    description:
      'Private day tour to Martvili Canyon and Prometheus Cave with a driver-guide. Emerald boat rides and vast caves in west Georgia — comfortable transfer, book now.',
    keywords: [
      'Martvili Canyon tour',
      'Prometheus Cave tour',
      'west Georgia day trip',
      'private tour with driver Georgia',
    ],
  },
  'kakheti-wine-day-tour': {
    title: 'Kakheti Wine Day Tour | Sighnaghi & Wine Tasting',
    description:
      'Private Kakheti wine tour from Tbilisi with a local guide. Wine tasting, Bodbe Monastery and hilltop Sighnaghi, your own pace — comfortable car, book today.',
    keywords: [
      'Kakheti wine tour',
      'Kakheti day tour from Tbilisi',
      'Sighnaghi tour',
      'Georgia wine tasting tour',
    ],
  },
  'tbilisi-mtskheta-day-tour': {
    title: 'Tbilisi & Mtskheta Day Tour | Private City Tour',
    description:
      'Private Tbilisi city tour with Mtskheta and a local guide. Old Town, Sameba, Jvari and Svetitskhoveli in one relaxed day — hotel pick-up included, book now.',
    keywords: [
      'Tbilisi city tour',
      'Mtskheta day tour',
      'Tbilisi private tour',
      'things to do in Tbilisi',
    ],
  },
  'tbilisi-batumi-private-transfer': {
    title: 'Tbilisi to Batumi Private Transfer | Door-to-Door',
    description:
      'Private Tbilisi to Batumi transfer in a comfortable car with an English-speaking driver. Flexible departure and optional stops en route — reserve your transfer.',
    keywords: [
      'Tbilisi to Batumi transfer',
      'private transfer Georgia',
      'Tbilisi Batumi taxi',
      'Batumi transfer with driver',
    ],
  },

  // ── Multi-day packages ────────────────────────────────────────────────────
  'georgia-highlights-tour': {
    title: 'Georgia Highlights Tour | 8-Day Private Package',
    description:
      '8-day private Georgia tour with a driver-guide: Tbilisi, Kakheti wine, Kazbegi mountains and Batumi coast. Custom itinerary, 4x4 or minivan — plan your trip.',
    keywords: [
      'Georgia tour package',
      '8 day Georgia itinerary',
      'private Georgia tour',
      'multi-day Georgia tour',
    ],
  },
  'essential-georgia-3-day': {
    title: 'Essential Georgia 3-Day Private Tour from Tbilisi',
    description:
      '3-day private Georgia tour from Tbilisi with a driver-guide. Tbilisi, Kazbegi and Kakheti wine country, your own pace — comfortable transfers, book online.',
    keywords: [
      '3 day Georgia tour',
      'short Georgia itinerary',
      'Georgia tour from Tbilisi',
      'private multi-day tour Georgia',
    ],
  },
  'wine-mountains-5-day': {
    title: 'Wine & Mountains | 5-Day Private Georgia Tour',
    description:
      '5-day private Georgia tour pairing Kakheti wine country with the Kazbegi mountains. English-speaking driver-guide, custom pace and comfortable 4x4 — book now.',
    keywords: [
      '5 day Georgia tour',
      'Kakheti and Kazbegi tour',
      'Georgia wine and mountains tour',
      'private Georgia package',
    ],
  },
  'grand-georgia-7-day': {
    title: 'Grand Georgia 7-Day Private Tour with Driver-Guide',
    description:
      '7-day private Georgia tour with a driver-guide: Kakheti, Kutaisi canyons, the Batumi coast and Kazbegi peaks. Tailored itinerary and comfy transfers — plan now.',
    keywords: [
      '7 day Georgia tour',
      'Georgia week itinerary',
      'private Georgia tour package',
      'Georgia road trip tour',
    ],
  },
  'best-of-georgia-13-day': {
    title: 'Ultimate Georgia 13-Day Adventure | Private 4x4',
    description:
      '13-day private Georgia adventure by 4x4 with a driver-guide: Tusheti, Shatili, Kazbegi, western canyons and Borjomi. The full country, your pace — enquire now.',
    keywords: [
      '13 day Georgia tour',
      'Tusheti tour',
      'ultimate Georgia itinerary',
      'private 4x4 Georgia tour',
    ],
  },
};

/** SEO copy for a tour slug, or undefined to fall back to on-page content. */
export function getTourSeo(slug: string): TourSeo | undefined {
  return tourSeo[slug];
}
