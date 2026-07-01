import type { Tour } from '@/types/tour';
import { photos, unsplash, unsplashLandscape } from '@/lib/images';
import {
  airportTransfers,
  hotelPickup,
  privateGuide,
  privateVehicle,
  wineTasting,
  meals,
} from './inclusions';

/**
 * One-day tours. Prices are in GEL (Georgian Lari) and are per group,
 * placeholder values — edit freely.
 */
export const oneDayTours: Tour[] = [
  {
    slug: 'tbilisi-old-town',
    type: 'one-day',
    title: 'Tbilisi Old Town & Sulphur Baths',
    city: 'Tbilisi',
    duration: '8 hours',
    price: 320,
    heroImage: unsplashLandscape(photos.tbilisiDusk),
    cardImage: unsplash(photos.tbilisiDusk, 1200),
    shortDescription:
      'Wander the cobbled lanes of the capital — from the domed sulphur baths of Abanotubani up to Narikala Fortress, with wine cellars and balconied courtyards along the way.',
    locations: [
      {
        name: 'Abanotubani Sulphur Baths',
        description:
          'The steaming brick domes that gave Tbilisi its name — an unmissable soak in the old bath quarter.',
      },
      {
        name: 'Narikala Fortress',
        description:
          'A 4th-century citadel crowning the ridge, reached by cable car for sweeping views over the rooftops.',
      },
      {
        name: 'Bridge of Peace',
        description:
          'A sinuous glass-and-steel walkway over the Mtkvari, striking against the medieval skyline.',
      },
      {
        name: 'Shardeni Street',
        description:
          'The heart of the old town — carved balconies, courtyard wine bars and hidden art galleries.',
      },
    ],
    included: [privateGuide, privateVehicle, hotelPickup, ...airportTransfers],
  },
  {
    slug: 'mtskheta-jvari-day',
    type: 'one-day',
    title: 'Mtskheta, Jvari & the Ancient Capital',
    city: 'Mtskheta',
    duration: '6 hours',
    price: 260,
    heroImage: unsplashLandscape(photos.mtskhetaChurch),
    cardImage: unsplash(photos.mtskhetaChurch, 1200),
    shortDescription:
      'A half-day into the spiritual heart of Georgia — UNESCO churches, the meeting of two rivers, and 1,500 years of history just outside Tbilisi.',
    locations: [
      {
        name: 'Jvari Monastery',
        description:
          'A 6th-century church on a clifftop where the Aragvi and Mtkvari rivers merge below.',
      },
      {
        name: 'Svetitskhoveli Cathedral',
        description:
          'The soaring 11th-century cathedral said to hold the robe of Christ, and the coronation site of kings.',
      },
      {
        name: 'Samtavro Monastery',
        description:
          'A quiet working convent with frescoes and the tombs of Georgia’s first Christian rulers.',
      },
      {
        name: 'Old Mtskheta Streets',
        description:
          'Souvenir lanes and family churchkhela stalls in one of the world’s oldest continuously inhabited towns.',
      },
    ],
    included: [privateGuide, privateVehicle, hotelPickup, ...airportTransfers],
  },
  {
    slug: 'kazbegi-gergeti-day',
    type: 'one-day',
    title: 'Kazbegi & Gergeti Trinity Church',
    city: 'Kazbegi',
    duration: '11 hours',
    price: 420,
    heroImage: unsplashLandscape(photos.kazbegiValley),
    cardImage: unsplash(photos.kazbegiValley, 1200),
    shortDescription:
      'The definitive Georgian mountain day — the Georgian Military Highway to a lone church beneath the glaciers of Mt. Kazbek at 5,000 metres.',
    locations: [
      {
        name: 'Gergeti Trinity Church',
        description:
          'The iconic 14th-century church standing alone at 2,170m against the snow-capped Kazbek massif.',
      },
      {
        name: 'Ananuri Fortress',
        description:
          'A photogenic castle complex reflected in the turquoise Zhinvali Reservoir.',
      },
      {
        name: 'Gudauri Viewpoint',
        description:
          'The Russia–Georgia Friendship Monument, a mosaic arc perched over a dramatic gorge.',
      },
      {
        name: 'Jvari Pass',
        description:
          'The highest point of the Military Highway at 2,379m, ringed by alpine peaks.',
      },
    ],
    included: [privateGuide, privateVehicle, meals, hotelPickup, ...airportTransfers],
  },
  {
    slug: 'kakheti-wine-day',
    type: 'one-day',
    title: 'Kakheti Wine Country Day',
    city: 'Kakheti',
    duration: '10 hours',
    price: 380,
    heroImage: unsplashLandscape(photos.kakhetiVineyard),
    cardImage: unsplash(photos.kakhetiVineyard, 1200),
    shortDescription:
      'The birthplace of wine — 8,000 years of qvevri winemaking across hilltop towns, family cellars and the Alazani Valley beneath the Caucasus.',
    locations: [
      {
        name: 'Sighnaghi',
        description:
          'The walled “City of Love” with pastel houses and balconies overlooking the Alazani Valley.',
      },
      {
        name: 'Bodbe Monastery',
        description:
          'A serene convent and the resting place of St. Nino, set among cypress gardens.',
      },
      {
        name: 'Family Qvevri Cellar',
        description:
          'A tasting of amber wines aged in clay vessels buried underground — a UNESCO tradition.',
      },
      {
        name: 'Tsinandali Estate',
        description:
          'The 19th-century prince’s manor, historic gardens and one of Georgia’s oldest wine collections.',
      },
    ],
    included: [privateGuide, privateVehicle, wineTasting, meals, hotelPickup, ...airportTransfers],
  },
  {
    slug: 'martvili-prometheus-day',
    type: 'one-day',
    title: 'Martvili Canyon & Prometheus Cave',
    city: 'Kutaisi',
    duration: '9 hours',
    price: 350,
    heroImage: unsplashLandscape(photos.martviliCanyon),
    cardImage: unsplash(photos.martviliCanyon, 1200),
    shortDescription:
      'Emerald water and underground wonders in western Georgia — a boat glide through a jungle canyon and a walk through illuminated stalactite halls.',
    locations: [
      {
        name: 'Martvili Canyon',
        description:
          'A boat ride through vivid emerald water between mossy limestone walls and waterfalls.',
      },
      {
        name: 'Prometheus Cave',
        description:
          'Vast illuminated chambers of stalactites and underground rivers, once a royal bathing spot.',
      },
      {
        name: 'Okatse Canyon Walkway',
        description:
          'A cliff-hugging steel path suspended high above a forested gorge.',
      },
      {
        name: 'Kinchkha Waterfall',
        description:
          'A dramatic multi-tier fall tumbling into a natural pool deep in the countryside.',
      },
    ],
    included: [privateGuide, privateVehicle, meals, hotelPickup, ...airportTransfers],
  },
  {
    slug: 'batumi-coast-day',
    type: 'one-day',
    title: 'Batumi Seaside & Botanical Garden',
    city: 'Batumi',
    duration: '7 hours',
    price: 300,
    heroImage: unsplashLandscape(photos.batumiSeaside),
    cardImage: unsplash(photos.batumiSeaside, 1200),
    shortDescription:
      'The Black Sea riviera — a subtropical botanical garden on the cliffs, a modern skyline, and a sunset stroll along the boulevard.',
    locations: [
      {
        name: 'Batumi Botanical Garden',
        description:
          'One of the largest in the former USSR — subtropical flora spilling down to the sea.',
      },
      {
        name: 'Batumi Boulevard',
        description:
          'A palm-lined seafront promenade with fountains, sculptures and cafés.',
      },
      {
        name: '“Ali & Nino” Statue',
        description:
          'Kinetic steel figures that pass through one another — a moving monument to love.',
      },
      {
        name: 'Old Batumi Squares',
        description:
          'Belle-Époque façades, Piazza’s mosaics and lively pedestrian streets.',
      },
    ],
    included: [privateGuide, privateVehicle, hotelPickup, ...airportTransfers],
  },
];
