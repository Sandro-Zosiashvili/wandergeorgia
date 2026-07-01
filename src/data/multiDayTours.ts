import type { Tour } from '@/types/tour';
import { photos, unsplash } from '@/lib/images';
import {
  airportTransfers,
  accommodation,
  privateGuide,
  privateVehicle,
  wineTasting,
  meals,
} from './inclusions';

/**
 * Multi-day packages. Prices are in GEL (Georgian Lari), per person,
 * placeholder values — edit freely.
 */
export const multiDayTours: Tour[] = [
  {
    slug: 'essential-georgia-3-day',
    type: 'multi-day',
    title: 'Essential Georgia — 3 Days',
    city: 'Tbilisi · Mtskheta · Kazbegi',
    duration: '3 days',
    days: 3,
    price: 1450,
    heroImage: unsplash(photos.kazbegiMisty),
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
    heroImage: unsplash(photos.wineGrapes),
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
    heroImage: unsplash(photos.caucasusValley),
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
