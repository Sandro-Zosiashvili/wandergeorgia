import type { Tour, TourInclusion } from '@/types/tour';
import { photos, unsplash, unsplashLandscape, unsplashSized } from '@/lib/images';
import {
  airportTransfers,
  accommodation,
  privateGuide,
  privateVehicle,
  wineTasting,
  meals,
} from './inclusions';

/** Included / not included on the driver-guide highlights tour. */
const HIGHLIGHTS_INCLUDED: TourInclusion[] = [
  { label: 'English-speaking driver-guide', icon: 'guide' },
  { label: 'Private comfortable vehicle', icon: 'car' },
  { label: 'Hotel pick-up & drop-off', icon: 'map-pin' },
  { label: 'Bottled water', icon: 'check' },
  { label: 'Fuel', icon: 'check' },
  { label: 'Parking fees', icon: 'check' },
];

const HIGHLIGHTS_NOT_INCLUDED: string[] = [
  'Accommodation',
  'Entrance fees',
  'Lunch & dinner',
  'Personal expenses',
  'Optional activities (zip line, ATV, boat ride, cable car)',
];

/**
 * Multi-day packages. Prices are in GEL (Georgian Lari), per person,
 * placeholder values — edit freely.
 */
export const multiDayTours: Tour[] = [
  {
    slug: 'georgia-highlights-tour',
    type: 'multi-day',
    title: 'Georgia Highlights Tour',
    city: 'Tbilisi · Kakheti · Kazbegi · Batumi',
    duration: '8 days / 7 nights',
    days: 8,
    price: 3200,
    // Fallbacks — the hero itself is a slideshow of the day photos below.
    heroImage: unsplashSized('https://images.unsplash.com/photo-1563284223-333497472e88'),
    cardImage: unsplashSized('https://images.unsplash.com/photo-1563284223-333497472e88', 1400),
    shortDescription:
      "The full sweep of Georgia with a private driver-guide — the capital, wine country, the high Caucasus, the Black Sea coast and the canyons of the west.",
    overview:
      "An eight-day private journey across Georgia with an English-speaking driver-guide: Tbilisi and ancient Mtskheta, the wine region of Kakheti, the Caucasus mountains around Kazbegi, seaside Batumi and Adjara, and the emerald canyons of the west.",
    highlights: [
      'Tbilisi & Mtskheta',
      'Kakheti wine region',
      'Kazbegi & Gergeti',
      'Batumi & the Black Sea',
      'Adjara adventure',
      'Martvili & Prometheus',
    ],
    // Kept for older UI paths; the day-by-day plan lives in `itinerary`.
    locations: [],
    itinerary: [
      {
        day: 'Day 1',
        title: 'Discover Tbilisi',
        highlights: [
          'Chronicle of Georgia',
          'Holy Trinity Cathedral (Sameba)',
          'Mother of Georgia',
          'Bridge of Peace',
          'Clock Tower',
          'Old Tbilisi',
        ],
        description:
          "Start your adventure by exploring Georgia's vibrant capital — impressive monuments, centuries-old churches, and charming cobblestone streets where ancient history meets modern life.",
        image: 'https://images.unsplash.com/photo-1505294399615-2479253a4990?auto=format&w=2000&q=80',
      },
      {
        day: 'Day 2',
        title: 'Kakheti Wine Region',
        highlights: [
          'KTW Winery',
          'Wine tasting',
          'Churchkhela & cheese tasting',
          'Bodbe Monastery',
          'Sighnaghi – City of Love',
        ],
        description:
          "Travel to Georgia's famous wine region and discover its 8,000-year-old winemaking tradition. Taste local wines, cheese and churchkhela, visit the peaceful Bodbe Monastery, and finish in the hilltop town of Sighnaghi over the Alazani Valley. Return to Tbilisi.",
        image: 'https://images.unsplash.com/photo-1694500788249-71b09a87db40?auto=format&w=2000&q=80',
      },
      {
        day: 'Day 3',
        title: 'Journey to Kazbegi',
        highlights: [
          'Zhinvali Reservoir',
          'Ananuri Fortress',
          'Black & White Aragvi Rivers',
          'Gudauri Panorama',
          'Arrival in Kazbegi',
        ],
        description:
          'Drive the spectacular Georgian Military Highway, stopping at iconic viewpoints and historical landmarks before arriving in the mountain town of Stepantsminda. Overnight in Kazbegi.',
        image: 'https://images.unsplash.com/photo-1564755123091-ac6bfcddf43b?auto=format&w=2000&q=80',
      },
      {
        day: 'Day 4',
        title: 'Explore Kazbegi',
        highlights: ['Gergeti Trinity Church', 'Gveleti Waterfall', 'Dariali Gorge', 'Mount Elia'],
        description:
          'Spend the day in the Greater Caucasus — the iconic Gergeti Trinity Church, a hike to Gveleti Waterfall, the dramatic Dariali Gorge near the Russian border, and views from Mount Elia. Overnight in Kazbegi.',
        image: 'https://images.unsplash.com/photo-1563284223-333497472e88?auto=format&w=2000&q=80',
      },
      {
        day: 'Day 5',
        title: 'Kazbegi to Batumi',
        highlights: ['Svetitskhoveli Cathedral', 'Jvari Monastery', 'Scenic drive to Batumi'],
        description:
          "Depart Kazbegi toward the Black Sea. Stop in ancient Mtskheta to visit the UNESCO Svetitskhoveli Cathedral and Jvari Monastery, overlooking the confluence of the Mtkvari and Aragvi rivers, then continue the scenic drive to Batumi. Overnight in Batumi.",
        image: 'https://images.unsplash.com/photo-1558352532-d30aee197dea?auto=format&w=2000&q=80',
      },
      {
        day: 'Day 6',
        title: 'Batumi City Tour',
        highlights: ['Piazza Square', 'Europe Square', 'Alphabet Tower', 'Batumi Boulevard', 'Argo Cable Car'],
        description:
          'Discover seaside Batumi — elegant Piazza Square, Europe Square, the iconic Alphabet Tower, a stroll along the palm-lined boulevard, and a ride on the Argo Cable Car for panoramic views of the city, sea and mountains. Overnight in Batumi.',
        image: 'https://images.unsplash.com/photo-1625566360146-918001e76064?auto=format&w=2000&q=80',
      },
      {
        day: 'Day 7',
        title: 'Adjara Adventure',
        highlights: ['Makhuntseti Waterfall', 'Zip line adventure', 'ATV tour', 'Sarpi – Georgia–Turkey border'],
        description:
          'Explore the nature of Adjara — the spectacular Makhuntseti Waterfall, a thrilling zip line and ATV ride through mountain scenery, and free time by the sea at Sarpi on the Georgia–Turkey border before returning to Batumi.',
        image: 'https://images.unsplash.com/photo-1631037988823-a29608bbeff6?auto=format&w=2000&q=80',
      },
      {
        day: 'Day 8',
        title: 'Batumi to Tbilisi',
        highlights: ['Martvili Canyon', 'Prometheus Cave', 'Hotel drop-off in Tbilisi'],
        description:
          "Travel through western Georgia to two of its most spectacular natural attractions — the emerald waters of Martvili Canyon and the illuminated chambers of Prometheus Cave — before a comfortable hotel drop-off in Tbilisi.",
        image: 'https://images.unsplash.com/photo-1619368053674-100925cddad5?auto=format&w=2000&q=80',
      },
    ],
    included: HIGHLIGHTS_INCLUDED,
    notIncluded: HIGHLIGHTS_NOT_INCLUDED,
  },
  {
    slug: 'essential-georgia-3-day',
    type: 'multi-day',
    title: 'Essential Georgia — 3 Days',
    city: 'Tbilisi · Mtskheta · Kazbegi',
    duration: '3 days',
    days: 3,
    price: 1450,
    heroImage: unsplashLandscape(photos.kazbegiMisty),
    cardImage: unsplash(photos.kazbegiMisty, 1200),
    shortDescription:
      'A perfect long weekend — the capital’s old town, the ancient churches of Mtskheta, and a day in the high Caucasus at Kazbegi.',
    highlights: ['Tbilisi old town', 'Jvari & Svetitskhoveli', 'Gergeti Trinity Church', 'Ananuri Fortress'],
    locations: [
      {
        name: 'Day 1 — Tbilisi',
        description:
          'Old town, sulphur baths, Narikala Fortress by cable car and a welcome dinner with live polyphony.',
      },
      {
        name: 'Day 2 — Mtskheta & Gudauri',
        description:
          'UNESCO churches at the ancient capital, then the Military Highway to Ananuri and the Gudauri viewpoint.',
      },
      {
        name: 'Day 3 — Kazbegi',
        description:
          'The drive to Stepantsminda and up to Gergeti Trinity Church beneath Mt. Kazbek before returning.',
      },
    ],
    included: [privateGuide, privateVehicle, accommodation, meals, ...airportTransfers],
  },
  {
    slug: 'wine-mountains-5-day',
    type: 'multi-day',
    title: 'Wine & Mountains — 5 Days',
    city: 'Tbilisi · Kakheti · Kazbegi',
    duration: '5 days',
    days: 5,
    price: 2380,
    heroImage: unsplashLandscape(photos.wineGrapes),
    cardImage: unsplash(photos.wineGrapes, 1200),
    shortDescription:
      'The two faces of Georgia — the amber wine cellars of Kakheti and the glaciers of the Greater Caucasus, with the capital in between.',
    highlights: ['Qvevri wine tasting', 'Sighnaghi & Bodbe', 'Kazbegi & Gergeti', 'Tbilisi & Mtskheta'],
    locations: [
      {
        name: 'Day 1 — Tbilisi',
        description: 'Arrival, old town walking tour and a first taste of Georgian cuisine.',
      },
      {
        name: 'Day 2 — Kakheti',
        description: 'Sighnaghi, Bodbe Monastery and tastings at family qvevri cellars in the Alazani Valley.',
      },
      {
        name: 'Day 3 — Tbilisi & Mtskheta',
        description: 'The ancient capital’s cathedrals and a relaxed afternoon back in the city.',
      },
      {
        name: 'Day 4 — Kazbegi',
        description: 'The Military Highway, Ananuri, Gudauri and Gergeti Trinity Church.',
      },
      {
        name: 'Day 5 — Departure',
        description: 'A final morning at leisure before your airport drop-off.',
      },
    ],
    included: [privateGuide, privateVehicle, accommodation, wineTasting, meals, ...airportTransfers],
  },
  {
    slug: 'grand-georgia-7-day',
    type: 'multi-day',
    title: 'Grand Georgia — 7 Days',
    city: 'Tbilisi · Kakheti · Kutaisi · Batumi · Kazbegi',
    duration: '7 days',
    days: 7,
    price: 3450,
    heroImage: unsplashLandscape(photos.caucasusValley),
    cardImage: unsplash(photos.caucasusValley, 1200),
    shortDescription:
      'The complete journey coast to mountains — wine country, western canyons, the Black Sea in Batumi and the high Caucasus, all privately guided.',
    highlights: ['Kakheti wine', 'Martvili & Prometheus', 'Batumi coast', 'Kazbegi peaks', 'Tbilisi & Mtskheta'],
    locations: [
      {
        name: 'Day 1 — Tbilisi',
        description: 'Airport welcome, old town and an evening in the capital.',
      },
      {
        name: 'Day 2 — Kakheti',
        description: 'Sighnaghi, Bodbe and qvevri wine tastings across the Alazani Valley.',
      },
      {
        name: 'Day 3 — Kutaisi & Canyons',
        description: 'Martvili Canyon by boat and the illuminated halls of Prometheus Cave.',
      },
      {
        name: 'Day 4–5 — Batumi',
        description: 'The Black Sea riviera — botanical garden, boulevard and free time by the coast.',
      },
      {
        name: 'Day 6 — Kazbegi',
        description: 'The Military Highway to Gergeti Trinity Church beneath the glaciers.',
      },
      {
        name: 'Day 7 — Departure',
        description: 'Mtskheta’s churches en route to your airport drop-off.',
      },
    ],
    included: [privateGuide, privateVehicle, accommodation, wineTasting, meals, ...airportTransfers],
  },
];
