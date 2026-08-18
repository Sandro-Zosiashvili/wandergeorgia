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

/** Reusable day photos for the itinerary hero slideshows — swap freely. */
const PHOTO = {
  tbilisi: 'https://images.unsplash.com/photo-1505294399615-2479253a4990?auto=format&w=2000&q=80',
  mtskheta: 'https://images.unsplash.com/photo-1558352532-d30aee197dea?auto=format&w=2000&q=80',
  kazbegi: 'https://images.unsplash.com/photo-1563284223-333497472e88?auto=format&w=2000&q=80',
  caucasus: 'https://images.unsplash.com/photo-1564755123091-ac6bfcddf43b?auto=format&w=2000&q=80',
  kakheti: 'https://images.unsplash.com/photo-1694500788249-71b09a87db40?auto=format&w=2000&q=80',
  canyon: 'https://images.unsplash.com/photo-1631037988823-a29608bbeff6?auto=format&w=2000&q=80',
  batumi: 'https://images.unsplash.com/photo-1625566360146-918001e76064?auto=format&w=2000&q=80',
} as const;

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
    itinerary: [
      {
        day: 'Day 1',
        title: 'Tbilisi',
        highlights: ['Old town', 'Sulphur baths', 'Narikala Fortress'],
        description:
          'Old town, sulphur baths, Narikala Fortress by cable car and a welcome dinner with live polyphony.',
        image: PHOTO.tbilisi,
      },
      {
        day: 'Day 2',
        title: 'Mtskheta & Gudauri',
        highlights: ['Jvari & Svetitskhoveli', 'Ananuri Fortress', 'Gudauri viewpoint'],
        description:
          'UNESCO churches at the ancient capital, then the Military Highway to Ananuri and the Gudauri viewpoint.',
        image: PHOTO.mtskheta,
      },
      {
        day: 'Day 3',
        title: 'Kazbegi',
        highlights: ['Gergeti Trinity Church', 'Mt. Kazbek'],
        description:
          'The drive to Stepantsminda and up to Gergeti Trinity Church beneath Mt. Kazbek before returning.',
        image: PHOTO.kazbegi,
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
    itinerary: [
      {
        day: 'Day 1',
        title: 'Tbilisi',
        highlights: ['Old town walking tour', 'Georgian cuisine'],
        description: 'Arrival, old town walking tour and a first taste of Georgian cuisine.',
        image: PHOTO.tbilisi,
      },
      {
        day: 'Day 2',
        title: 'Kakheti',
        highlights: ['Sighnaghi', 'Bodbe Monastery', 'Qvevri wine tasting'],
        description:
          'Sighnaghi, Bodbe Monastery and tastings at family qvevri cellars in the Alazani Valley.',
        image: PHOTO.kakheti,
      },
      {
        day: 'Day 3',
        title: 'Tbilisi & Mtskheta',
        highlights: ['Svetitskhoveli', 'Jvari Monastery'],
        description: "The ancient capital's cathedrals and a relaxed afternoon back in the city.",
        image: PHOTO.mtskheta,
      },
      {
        day: 'Day 4',
        title: 'Kazbegi',
        highlights: ['Ananuri', 'Gudauri', 'Gergeti Trinity Church'],
        description: 'The Military Highway, Ananuri, Gudauri and Gergeti Trinity Church.',
        image: PHOTO.kazbegi,
      },
      {
        day: 'Day 5',
        title: 'Departure',
        highlights: ['Airport drop-off'],
        description: 'A final morning at leisure before your airport drop-off.',
        image: PHOTO.caucasus,
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
    itinerary: [
      {
        day: 'Day 1',
        title: 'Tbilisi',
        highlights: ['Airport welcome', 'Old town'],
        description: 'Airport welcome, old town and an evening in the capital.',
        image: PHOTO.tbilisi,
      },
      {
        day: 'Day 2',
        title: 'Kakheti',
        highlights: ['Sighnaghi', 'Bodbe', 'Qvevri wine tasting'],
        description: 'Sighnaghi, Bodbe and qvevri wine tastings across the Alazani Valley.',
        image: PHOTO.kakheti,
      },
      {
        day: 'Day 3',
        title: 'Kutaisi & Canyons',
        highlights: ['Martvili Canyon', 'Prometheus Cave'],
        description: 'Martvili Canyon by boat and the illuminated halls of Prometheus Cave.',
        image: PHOTO.canyon,
      },
      {
        day: 'Day 4–5',
        title: 'Batumi',
        highlights: ['Botanical garden', 'Batumi Boulevard', 'Black Sea coast'],
        description: 'The Black Sea riviera — botanical garden, boulevard and free time by the coast.',
        image: PHOTO.batumi,
      },
      {
        day: 'Day 6',
        title: 'Kazbegi',
        highlights: ['Military Highway', 'Gergeti Trinity Church'],
        description: 'The Military Highway to Gergeti Trinity Church beneath the glaciers.',
        image: PHOTO.kazbegi,
      },
      {
        day: 'Day 7',
        title: 'Departure',
        highlights: ['Mtskheta', 'Airport drop-off'],
        description: 'Mtskheta’s churches en route to your airport drop-off.',
        image: PHOTO.mtskheta,
      },
    ],
    included: [privateGuide, privateVehicle, accommodation, wineTasting, meals, ...airportTransfers],
  },
  {
    slug: 'best-of-georgia-13-day',
    type: 'multi-day',
    title: 'Ultimate Georgia Adventure — 13 Days',
    city: 'Tbilisi · Kakheti · Tusheti · Shatili · Kazbegi · Kutaisi · Borjomi',
    duration: '13 days / 12 nights',
    days: 13,
    price: 5950,
    // Fallbacks — the hero itself is a slideshow of the day photos below.
    heroImage: unsplash('photo-1720368450579-b182d14cb270'),
    cardImage: unsplash('photo-1720368450579-b182d14cb270', 1400),
    shortDescription:
      'From ancient cities to the wild Caucasus — UNESCO heritage sites, world-famous wine, remote mountain villages and the untouched beauty of the Greater Caucasus, all in one unforgettable private journey.',
    overview:
      "Discover the very best of Georgia on this unforgettable thirteen-day journey. Explore UNESCO World Heritage Sites, taste world-famous Georgian wine, wander through charming mountain villages, and experience the untouched beauty of the Greater Caucasus. From the vibrant streets of Tbilisi to the remote regions of Tusheti and Shatili, this tour offers the perfect combination of culture, history, nature and adventure. Best travelled June to September, when the high mountain passes are open.",
    highlights: [
      'Private transportation throughout',
      'English-speaking local driver-guide',
      'Tusheti — 2 nights',
      'Shatili — 1 night',
      'Kazbegi & Gergeti Trinity Church',
      'Kakheti wine region & wine tasting',
      'Tbilisi city tour',
      'Borjomi National Park',
      'Prometheus Cave & Martvili Canyon',
      'UNESCO World Heritage Sites',
    ],
    // Kept for older UI paths; the day-by-day plan lives in `itinerary`.
    locations: [],
    itinerary: [
      {
        day: 'Day 1',
        title: 'Welcome to Georgia',
        highlights: ['Airport pickup', 'Hotel check-in', 'Evening walk in Old Tbilisi'],
        description:
          'Arrive in Tbilisi, where your private guide meets you at the airport. After checking into your hotel, enjoy a relaxing evening exploring the charming streets of Old Tbilisi, filled with colorful balconies, cozy cafés and breathtaking city views.',
        image: PHOTO.tbilisi,
      },
      {
        day: 'Day 2',
        title: 'Discover Tbilisi',
        highlights: [
          'Chronicles of Georgia',
          'Holy Trinity Cathedral',
          'Metekhi Church',
          'Narikala Fortress',
          'Mother of Georgia',
          'Sulfur Baths District',
          'Leghvtakhevi Waterfall',
        ],
        description:
          "Explore Georgia's fascinating capital — the monumental Chronicles of Georgia, Holy Trinity Cathedral, Metekhi Church, Narikala Fortress and the iconic Mother of Georgia statue above the rooftops, then down into the Sulfur Baths district and the hidden Leghvtakhevi Waterfall.",
        image: unsplash(photos.tbilisiAerial, 2000),
      },
      {
        day: 'Day 3',
        title: 'Kakheti Wine Region',
        highlights: ['Bodbe Monastery', 'Sighnaghi', 'Traditional wine tasting'],
        description:
          "Head east into Kakheti, Georgia's wine heartland — the peaceful Bodbe Monastery, the hilltop town of Sighnaghi over the Alazani Valley, and a traditional qvevri wine tasting. Overnight in Telavi.",
        image: unsplash('photo-1704278189296-b9bc26f49ceb', 2000),
      },
      {
        day: 'Day 4',
        title: 'Into the Wild Tusheti',
        highlights: ['Scenic drive via Abano Pass', 'Omalo village', 'Medieval defensive towers'],
        description:
          'One of the most scenic drives in the Caucasus, crossing the breathtaking Abano Pass. Reach Omalo, the heart of Tusheti, surrounded by dramatic mountains and medieval defensive towers. Overnight in Omalo.',
        image: unsplash('photo-1616761304764-fea127be45d8', 2000),
      },
      {
        day: 'Day 5',
        title: 'Hidden Villages of Tusheti',
        highlights: ['Dartlo village', 'Kvavlo village', 'Parsma village', 'Traditional Tushetian architecture'],
        description:
          'Spend the day exploring the untouched villages of Dartlo, Kvavlo and Parsma. Discover ancient stone towers, traditional Tushetian architecture and some of the most spectacular mountain landscapes in Georgia. Overnight in Omalo.',
        image: unsplash('photo-1746472603844-b5282b3c9c45', 2000),
      },
      {
        day: 'Day 6',
        title: 'Return to Tbilisi',
        highlights: ['Scenic drive back from Tusheti', 'Free evening in Tbilisi'],
        description:
          'Leave the mountains behind and enjoy another spectacular drive back to Tbilisi. Spend the evening relaxing, exploring the city at your own pace, or enjoying traditional Georgian cuisine.',
        image: PHOTO.tbilisi,
      },
      {
        day: 'Day 7',
        title: 'Journey to Shatili',
        highlights: ['Datvisjvari Pass', 'Anatori Necropolis', 'Shatili Medieval Fortress'],
        description:
          "Travel deep into the Khevsureti region via the dramatic Datvisjvari Pass. Visit the mysterious Anatori Necropolis before arriving at the medieval fortress village of Shatili, one of Georgia's most unique mountain settlements. Overnight in Shatili.",
        image: unsplash('photo-1720368450579-b182d14cb270', 2000),
      },
      {
        day: 'Day 8',
        title: 'Scenic Drive to Kazbegi',
        highlights: ['Georgian Military Highway', 'Gudauri Panorama', 'Arrival in Stepantsminda'],
        description:
          'Drive along the legendary Georgian Military Highway. Stop at the spectacular Gudauri Panorama and enjoy magnificent mountain scenery before arriving in the picturesque town of Stepantsminda (Kazbegi).',
        image: PHOTO.kazbegi,
      },
      {
        day: 'Day 9',
        title: 'Explore Kazbegi',
        highlights: ['Gergeti Trinity Church', 'Gveleti Waterfall', 'Dariali Gorge'],
        description:
          'Visit the iconic Gergeti Trinity Church, standing proudly beneath Mount Kazbek. Continue to the beautiful Gveleti Waterfall and the dramatic Dariali Gorge near the Georgian–Russian border.',
        image: unsplash('photo-1594766722982-fb4cd139ee7c', 2000),
      },
      {
        day: 'Day 10',
        title: 'From Mountains to Western Georgia',
        highlights: ['Jinvali Reservoir', 'Ananuri Fortress', 'Drive to Kutaisi'],
        description:
          'Stop at the turquoise waters of the Jinvali Reservoir and explore the historic Ananuri Fortress before continuing west to Kutaisi, one of the oldest continuously inhabited cities in Europe.',
        image: unsplash('photo-1715170081310-4f4abb261117', 2000),
      },
      {
        day: 'Day 11',
        title: 'Natural Wonders',
        highlights: ['Prometheus Cave', 'Martvili Canyon'],
        description:
          "Discover two of western Georgia's greatest natural attractions: the magical Prometheus Cave, filled with colorful underground formations, and Martvili Canyon, where emerald waters flow through stunning limestone cliffs.",
        image: PHOTO.canyon,
      },
      {
        day: 'Day 12',
        title: 'Borjomi & Mtskheta',
        highlights: ['Borjomi National Park', 'Jvari Monastery', 'Svetitskhoveli Cathedral'],
        description:
          'Visit Borjomi, famous for its mineral springs and beautiful national park. On the way back to Tbilisi, explore the ancient capital of Mtskheta, including the UNESCO-listed Jvari Monastery and Svetitskhoveli Cathedral.',
        image: unsplash('photo-1585790638503-b783783bc94c', 2000),
      },
      {
        day: 'Day 13',
        title: 'Departure',
        highlights: ['Airport transfer'],
        description:
          'After an unforgettable journey across Georgia, enjoy your airport transfer and depart with incredible memories of the Caucasus.',
        image: unsplash(photos.tbilisiAerial, 2000),
      },
    ],
    included: HIGHLIGHTS_INCLUDED,
    notIncluded: HIGHLIGHTS_NOT_INCLUDED,
  },
];
