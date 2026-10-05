import type { IconName } from '@/components/ui/Icon/Icon';
import type { Tour, TourDay, TourInclusion, TourLocation } from '@/types/tour';
import type { ApiTour } from './toursApi';

/**
 * Maps a database tour (admin shape) onto the rich front-end `Tour` type the
 * tour-page components expect — reconciling the schema differences:
 *  • images  — coverImage → heroImage, gallery → card / per-day slideshow images
 *  • icons   — included[] strings → {label, icon} (keyword-matched)
 *  • pricing — basePrice → fromPrice (honoured by fromPriceUSD)
 *  • days    — DB "Day 1 · Title" split back into label + title; one-day tours'
 *              itinerary becomes `locations` so the page renders "What you'll see"
 */

// Guess a sensible icon for an included-item label.
const ICON_RULES: [RegExp, IconName][] = [
  [/airport/i, 'plane-arrival'],
  [/driver|guide/i, 'guide'],
  [/vehicle|car|transfer|transport/i, 'car'],
  [/pick-?up|drop-?off|hotel/i, 'map-pin'],
  [/water|fuel|parking/i, 'check'],
  [/photo|drone/i, 'star'],
  [/meal|lunch|dinner|wine|food|tasting/i, 'meal'],
  [/night|accommodation|stay/i, 'bed'],
];

function iconFor(label: string): IconName {
  for (const [re, icon] of ICON_RULES) if (re.test(label)) return icon;
  return 'check';
}

function toInclusions(items: string[]): TourInclusion[] {
  return items.map((label) => ({ label, icon: iconFor(label) }));
}

function shortFrom(overview: string): string {
  const trimmed = overview.trim();
  if (trimmed.length <= 160) return trimmed;
  const cut = trimmed.slice(0, 160);
  const lastStop = Math.max(cut.lastIndexOf('. '), cut.lastIndexOf(' '));
  return `${cut.slice(0, lastStop > 80 ? lastStop : 160).trim()}…`;
}

/** Split a stored day title ("Day 1 · Discover Tbilisi") into label + title. */
function splitDayTitle(raw: string, index: number): { day: string; title: string } {
  const parts = raw.split(' · ');
  const first = parts[0]?.trim() ?? '';
  if (parts.length > 1 && /^day\b/i.test(first)) {
    return { day: first, title: parts.slice(1).join(' · ').trim() };
  }
  return { day: `Day ${index + 1}`, title: raw.trim() };
}

function dayCount(a: ApiTour): number | undefined {
  if (a.type !== 'multi-day') return undefined;
  const fromDuration = a.duration.match(/\d+/);
  if (fromDuration) return Number(fromDuration[0]);
  return a.itinerary.length || undefined;
}

export function apiTourToTour(a: ApiTour): Tour {
  const cover = a.coverImage || a.gallery[0] || '';
  const card = a.gallery[0] || a.coverImage || '';

  let itinerary: TourDay[] | undefined;
  let locations: TourLocation[] = [];

  if (a.type === 'multi-day') {
    itinerary = a.itinerary.map((d, i) => {
      const { day, title } = splitDayTitle(d.title, i);
      return {
        day,
        title,
        description: d.description,
        highlights: d.highlights ?? [],
        image: a.gallery[i] ?? cover,
      };
    });
  } else {
    // One-day tours render "What you'll see" from `locations` (no day labels).
    locations = a.itinerary.map((d) => {
      const { title } = splitDayTitle(d.title, 0);
      return { name: title, description: d.description };
    });
  }

  return {
    slug: a.slug,
    type: a.type,
    title: a.title,
    city: a.location,
    duration: a.duration,
    price: a.basePrice,
    fromPrice: a.basePrice,
    image: cover,
    heroImage: cover,
    cardImage: card,
    shortDescription: shortFrom(a.overview),
    overview: a.overview,
    highlights: a.highlights,
    locations,
    itinerary,
    included: toInclusions(a.included),
    notIncluded: a.excluded,
    days: dayCount(a),
  };
}
