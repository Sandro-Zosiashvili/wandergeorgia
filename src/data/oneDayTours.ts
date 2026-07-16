import type { Tour, TourInclusion } from '@/types/tour';

/**
 * ────────────────────────────────────────────────────────────────────────────
 *  ONE-DAY TOURS  —  single source of truth
 * ────────────────────────────────────────────────────────────────────────────
 *  Everything about the day tours lives in this one file.
 *
 *  • To swap a photo:      edit the `image` line of that tour (one place).
 *  • To change price/text: edit the field right there in the object.
 *  • `included` / `notIncluded` are shared by every tour (see below) — change
 *    them once and every tour updates.
 *
 *  Prices are in GEL (₾) and are PLACEHOLDERS — set the real numbers.
 * ────────────────────────────────────────────────────────────────────────────
 */

/** Included in every day tour. */
const INCLUDED: TourInclusion[] = [
  { label: 'English-speaking driver-guide', icon: 'guide' },
  { label: 'Comfortable private vehicle', icon: 'car' },
  { label: 'Fuel', icon: 'check' },
  { label: 'Parking fees', icon: 'check' },
  { label: 'Bottled water', icon: 'check' },
  { label: 'Hotel pick-up & drop-off', icon: 'map-pin' },
  { label: 'Drone photography (weather permitting)', icon: 'star' },
];

/** Paid separately on every day tour. */
const NOT_INCLUDED: string[] = ['Entrance fees', 'Meals', 'Personal expenses'];

/**
 * The raw tours. Plain objects — add / remove / reorder freely.
 * `id` values are just stable references; keep them unique.
 */
const tours: Array<Omit<Tour, 'heroImage' | 'cardImage'> & { image: string }> = [
  {
    id: 1,
    slug: 'kazbegi-day-tour',
    type: 'one-day',
    title: 'Kazbegi Day Tour from Tbilisi',
    city: 'Kazbegi',
    duration: '10–12 hours',
    tourType: 'Private tour with an English-speaking driver',
    price: 420,
    image:
      'https://images.unsplash.com/photo-1563284223-333497472e88?q=80&w=2076&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    shortDescription:
      "The definitive Georgian mountain day — the Military Highway to the lone Gergeti Trinity Church beneath the glaciers of Mt. Kazbek.",
    overview:
      "Discover the breathtaking beauty of Georgia's Military Highway on this private full-day tour to Kazbegi. Visit ancient fortresses, mountain reservoirs, panoramic viewpoints, and the famous Gergeti Trinity Church surrounded by the majestic Caucasus Mountains.",
    highlights: [
      'Zhinvali Reservoir',
      'Ananuri Fortress',
      'Black & White Aragvi Rivers',
      'Gudauri Panorama',
      'Gergeti Trinity Church',
      'Scenic drive through the Caucasus Mountains',
    ],
    locations: [
      {
        name: 'Zhinvali Reservoir',
        description:
          "A stunning turquoise reservoir surrounded by mountains — one of Georgia's most beautiful viewpoints.",
      },
      {
        name: 'Ananuri Fortress',
        description:
          'A medieval fortress dating back to the 16th century, overlooking the Zhinvali Reservoir.',
      },
      {
        name: 'Black & White Aragvi Rivers',
        description:
          'A unique natural phenomenon where the two rivers flow together while keeping their different colors.',
      },
      {
        name: 'Gudauri Panorama',
        description:
          'The famous Friendship Monument offers spectacular panoramic views of the Caucasus Mountains.',
      },
      {
        name: 'Gergeti Trinity Church',
        description:
          "At 2,170 m above sea level beneath Mount Kazbek, this iconic church is one of Georgia's most famous landmarks. Return to Tbilisi in the evening.",
      },
    ],
    included: INCLUDED,
    notIncluded: NOT_INCLUDED,
  },
  {
    id: 2,
    slug: 'borjomi-day-tour',
    type: 'one-day',
    title: 'Borjomi Day Tour from Tbilisi',
    city: 'Borjomi',
    duration: '10–11 hours',
    tourType: 'Private tour with an English-speaking driver',
    price: 360,
    image:
      'https://images.unsplash.com/photo-1743516670221-b6a2ae85c370?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Qm9yam9taXxlbnwwfHwwfHx8MA%3D%3D',
    shortDescription:
      "History and nature in one day — Stalin's birthplace, the ancient cave city of Uplistsikhe, and the famous Borjomi mineral park.",
    overview:
      "Explore Georgia's history and nature by visiting Stalin's birthplace, the ancient cave city of Uplistsikhe, and the famous Borjomi National Park.",
    highlights: [
      'Stalin Museum',
      'Uplistsikhe Cave Town',
      'Borjomi Central Park',
      'Green Monastery',
    ],
    locations: [
      {
        name: 'Stalin Museum (Gori)',
        description: 'Learn about the life of Joseph Stalin in his hometown.',
      },
      {
        name: 'Uplistsikhe Cave Town',
        description: 'An ancient rock-hewn city dating back over 3,000 years.',
      },
      {
        name: 'Borjomi Central Park',
        description:
          'Taste the world-famous Borjomi mineral water directly from the natural spring.',
      },
      {
        name: 'Green Monastery',
        description:
          'A peaceful medieval monastery hidden within a lush forest. Return to Tbilisi.',
      },
    ],
    included: INCLUDED,
    notIncluded: NOT_INCLUDED,
  },
  {
    id: 3,
    slug: 'dashbashi-canyon-day-tour',
    type: 'one-day',
    title: 'Dashbashi Canyon Day Tour',
    city: 'Dashbashi',
    duration: '1 day',
    tourType: 'Private tour',
    price: 300,
    image:
      'https://images.unsplash.com/photo-1633112504604-4d9251f37fe1?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    shortDescription:
      "One of Georgia's newest natural attractions — a spectacular canyon crossed by a unique diamond glass bridge.",
    overview:
      "Visit one of Georgia's newest natural attractions, famous for its spectacular canyon and unique glass bridge.",
    highlights: [
      'Dashbashi Canyon',
      'Diamond Glass Bridge',
      'Waterfalls',
      'Scenic nature walks',
    ],
    locations: [
      {
        name: 'Dashbashi Canyon',
        description: 'A beautiful canyon with waterfalls and dramatic cliffs.',
      },
      {
        name: 'Diamond Glass Bridge',
        description:
          "Walk across one of Europe's most impressive glass bridges with breathtaking views below. Return to Tbilisi.",
      },
    ],
    included: INCLUDED,
    notIncluded: NOT_INCLUDED,
  },
  {
    id: 4,
    slug: 'martvili-prometheus-day-tour',
    type: 'one-day',
    title: 'Martvili Canyon & Prometheus Cave Day Tour',
    city: 'Martvili',
    duration: '1 day (long-distance tour)',
    tourType: 'Private tour',
    price: 380,
    image:
      'https://images.unsplash.com/photo-1631037988823-a29608bbeff6?auto=format&fit=crop&w=2400&q=80',
    shortDescription:
      "Western Georgia's most spectacular nature — emerald canyon waters and one of Europe's largest caves in a single day.",
    overview:
      "Perfect for nature lovers, this long-distance tour takes you to western Georgia's most spectacular natural attractions.",
    highlights: ['Martvili Canyon', 'Boat ride (optional)', 'Prometheus Cave'],
    locations: [
      {
        name: 'Martvili Canyon',
        description:
          'Enjoy emerald-green waters, waterfalls, and optional boat rides through the canyon.',
      },
      {
        name: 'Prometheus Cave',
        description:
          "Explore one of Europe's largest caves, filled with colorful stalactites, stalagmites, underground rivers, and impressive halls. Return to Tbilisi.",
      },
    ],
    included: INCLUDED,
    notIncluded: NOT_INCLUDED,
  },
  {
    id: 5,
    slug: 'kakheti-wine-day-tour',
    type: 'one-day',
    title: 'Kakheti Wine Day Tour',
    city: 'Kakheti',
    duration: '1 day',
    tourType: 'Private tour',
    price: 350,
    image:
      'https://images.unsplash.com/photo-1660038090901-9dc6d7768e47?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8a2FraGV0aXxlbnwwfHwwfHx8MA%3D%3D',
    shortDescription:
      "Georgia's famous wine region — 8,000 years of winemaking, local food, Bodbe Monastery and the hilltop City of Love.",
    overview:
      "Experience Georgia's famous wine region, rich history, delicious local food, and beautiful landscapes.",
    highlights: [
      'KTW Winery wine tasting',
      'Churchkhela & cheese tasting',
      'Bodbe Monastery',
      'Sighnaghi – City of Love',
    ],
    locations: [
      {
        name: 'KTW Winery',
        description:
          "Learn about Georgia's 8,000-year-old winemaking tradition while tasting local wines.",
      },
      {
        name: 'Churchkhela & Cheese Tasting',
        description:
          'Taste traditional Georgian cheese and the famous sweet snack called churchkhela.',
      },
      {
        name: 'Bodbe Monastery',
        description:
          'Visit the burial place of Saint Nino, who brought Christianity to Georgia.',
      },
      {
        name: 'Sighnaghi',
        description:
          'Known as the City of Love, Sighnaghi offers charming streets, city walls, and breathtaking views of the Alazani Valley. Return to Tbilisi.',
      },
    ],
    included: INCLUDED,
    notIncluded: NOT_INCLUDED,
  },
];

/**
 * Exported list. Card + hero images are derived from the single `image` field
 * so you never have to keep two URLs in sync — just edit `image` above.
 */
export const oneDayTours: Tour[] = tours.map((t) => ({
  ...t,
  heroImage: t.image,
  cardImage: t.image,
}));
