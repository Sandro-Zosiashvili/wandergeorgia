/**
 * Helpers for building Unsplash image URLs.
 *
 * Every photo is a real, editorially-curated shot of Georgia. Swap the base
 * path (the `photo-…` segment) to change an image; next/image re-optimises the
 * result, so the width here is just the source ceiling.
 */

const BASE = 'https://images.unsplash.com';

/** Build an Unsplash source URL from a photo base path. */
export function unsplash(path: string, width = 1920): string {
  return `${BASE}/${path}?auto=format&fit=crop&w=${width}&q=80`;
}

/**
 * Central registry of the photos used across the site, so the same shot is
 * referenced by name rather than by an opaque id scattered through the data.
 */
export const photos = {
  kazbegiChurch: 'photo-1563284223-333497472e88',
  tbilisiAerial: 'photo-1603350576276-24747f7bbf40',
  tbilisiDusk: 'photo-1505294399615-2479253a4990',
  tbilisiSunset: 'photo-1601645249594-28ff89372a50',
  svanetiTowers: 'photo-1738599683897-d449c2dbb76f',
  martviliCanyon: 'photo-1543076499-a6133cb932fd',
  batumiCoast: 'photo-1625566360146-918001e76064',
  batumiSeaside: 'photo-1619368052220-1aace213b043',
  mtskhetaChurch: 'photo-1558352532-d30aee197dea',
  kazbegiValley: 'photo-1568632102228-b7d3e77459c3',
  kazbegiMisty: 'photo-1577701122197-c9607038bd90',
  kakhetiVineyard: 'photo-1694500788249-71b09a87db40',
  wineGrapes: 'photo-1598897893004-df11da13128a',
  caucasusValley: 'photo-1564755123091-ac6bfcddf43b',
} as const;
