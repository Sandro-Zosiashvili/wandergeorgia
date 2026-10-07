/**
 * Traveler Memories / Moments — mock dataset.
 *
 * Frontend-first placeholder content for the Home "Moments" section and the
 * dedicated /memories gallery. These will be replaced by real, admin-uploaded
 * media (stored on Neon Object Storage) in a later step — the shape here mirrors
 * what that upload payload will eventually provide.
 *
 * Images/thumbnails use picsum.photos (deterministic per seed) and video clips
 * use Google's public sample bucket — both are just stand-ins.
 */

export type MemoryType = 'image' | 'video';

export interface Memory {
  id: string;
  type: MemoryType;
  /** Full-resolution photo, or the video file to play in the lightbox. */
  mediaUrl: string;
  /** Preview image shown in the grid (also the video poster). */
  thumbnailUrl: string;
  /** Tour this moment is from, shown as a location tag. */
  tourTitle: string;
  /** Short traveler quote / caption (1–2 lines). */
  caption: string;
  travelerName: string;
  /** Traveler's home country — rendered as a tag with a flag. */
  country: string;
  /** ISO date (YYYY-MM-DD) the moment was shared. */
  date: string;
}

const img = (seed: string, w = 1200, h = 1500) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}`;

const VIDEO = (name: string) =>
  `https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/${name}`;

export const memories: Memory[] = [
  {
    id: 'm-01',
    type: 'image',
    mediaUrl: img('wk-kazbegi-sunrise', 1600, 2000),
    thumbnailUrl: img('wk-kazbegi-sunrise'),
    tourTitle: 'Kazbegi & Gergeti Trinity',
    caption: 'Watched the sun hit Gergeti before anyone else arrived. Pure silence.',
    travelerName: 'Emily R.',
    country: 'United Kingdom',
    date: '2026-09-18',
  },
  {
    id: 'm-02',
    type: 'video',
    mediaUrl: VIDEO('ForBiggerJoyrides.mp4'),
    thumbnailUrl: img('wk-military-road'),
    tourTitle: 'Georgian Military Road',
    caption: 'The drive through the mountains felt like a film the whole way.',
    travelerName: 'Daniel & Sofia',
    country: 'Germany',
    date: '2026-09-11',
  },
  {
    id: 'm-03',
    type: 'image',
    mediaUrl: img('wk-kakheti-wine', 1600, 2000),
    thumbnailUrl: img('wk-kakheti-wine'),
    tourTitle: 'Kakheti Wine Country',
    caption: 'A family cellar, an 8,000-year-old method, and the best lunch of the trip.',
    travelerName: 'Marcus T.',
    country: 'United States',
    date: '2026-09-05',
  },
  {
    id: 'm-04',
    type: 'image',
    mediaUrl: img('wk-tbilisi-oldtown', 1600, 2000),
    thumbnailUrl: img('wk-tbilisi-oldtown'),
    tourTitle: 'Tbilisi Old Town & Baths',
    caption: 'Balconies, backstreets and sulphur baths — the city completely won us over.',
    travelerName: 'Nina P.',
    country: 'Poland',
    date: '2026-08-29',
  },
  {
    id: 'm-05',
    type: 'video',
    mediaUrl: VIDEO('ForBiggerEscapes.mp4'),
    thumbnailUrl: img('wk-svaneti-towers'),
    tourTitle: 'Svaneti Highlands',
    caption: 'Medieval towers against the snow line. Nowhere else looks like this.',
    travelerName: 'Lucas M.',
    country: 'France',
    date: '2026-08-22',
  },
  {
    id: 'm-06',
    type: 'image',
    mediaUrl: img('wk-gudauri-ridge', 1600, 2000),
    thumbnailUrl: img('wk-gudauri-ridge'),
    tourTitle: 'Gudauri & Panorama',
    caption: 'Stopped at every viewpoint. Our guide knew exactly where the light was best.',
    travelerName: 'Aisha K.',
    country: 'United Arab Emirates',
    date: '2026-08-14',
  },
  {
    id: 'm-07',
    type: 'image',
    mediaUrl: img('wk-ananuri-fortress', 1600, 2000),
    thumbnailUrl: img('wk-ananuri-fortress'),
    tourTitle: 'Ananuri Fortress',
    caption: 'The reservoir was impossibly turquoise. Photos barely do it justice.',
    travelerName: 'Sven H.',
    country: 'Sweden',
    date: '2026-08-07',
  },
  {
    id: 'm-08',
    type: 'video',
    mediaUrl: VIDEO('ForBiggerFun.mp4'),
    thumbnailUrl: img('wk-mtskheta'),
    tourTitle: 'Mtskheta Day Trip',
    caption: 'Ancient capital, warm people, and a lunch table that never ended.',
    travelerName: 'Carla M.',
    country: 'Italy',
    date: '2026-07-30',
  },
  {
    id: 'm-09',
    type: 'image',
    mediaUrl: img('wk-vardzia-caves', 1600, 2000),
    thumbnailUrl: img('wk-vardzia-caves'),
    tourTitle: 'Vardzia Cave City',
    caption: 'Climbing through a monastery carved into a cliff — unforgettable.',
    travelerName: 'Hiroshi T.',
    country: 'Japan',
    date: '2026-07-21',
  },
  {
    id: 'm-10',
    type: 'image',
    mediaUrl: img('wk-batumi-coast', 1600, 2000),
    thumbnailUrl: img('wk-batumi-coast'),
    tourTitle: 'Batumi & Black Sea',
    caption: 'Golden hour on the boulevard, then dinner by the water. Perfect close.',
    travelerName: 'Olivia & Jack',
    country: 'Australia',
    date: '2026-07-12',
  },
  {
    id: 'm-11',
    type: 'video',
    mediaUrl: VIDEO('ForBiggerBlazes.mp4'),
    thumbnailUrl: img('wk-truso-valley'),
    tourTitle: 'Truso Valley Hike',
    caption: 'Mineral springs, wild horses and not another tourist in sight.',
    travelerName: 'Pedro A.',
    country: 'Spain',
    date: '2026-07-03',
  },
  {
    id: 'm-12',
    type: 'image',
    mediaUrl: img('wk-sighnaghi', 1600, 2000),
    thumbnailUrl: img('wk-sighnaghi'),
    tourTitle: 'Sighnaghi — City of Love',
    caption: 'Red rooftops, vineyards below, and the Caucasus on the horizon.',
    travelerName: 'Mei L.',
    country: 'Singapore',
    date: '2026-06-25',
  },
];

/**
 * Minimal country → flag emoji map for the traveler tag. Falls back to a small
 * globe when a country isn't listed, so new mock entries never render blank.
 */
const FLAGS: Record<string, string> = {
  'United Kingdom': '🇬🇧',
  Germany: '🇩🇪',
  'United States': '🇺🇸',
  Poland: '🇵🇱',
  France: '🇫🇷',
  'United Arab Emirates': '🇦🇪',
  Sweden: '🇸🇪',
  Italy: '🇮🇹',
  Japan: '🇯🇵',
  Australia: '🇦🇺',
  Spain: '🇪🇸',
  Singapore: '🇸🇬',
};

export function flagFor(country: string): string {
  return FLAGS[country] ?? '🌍';
}
