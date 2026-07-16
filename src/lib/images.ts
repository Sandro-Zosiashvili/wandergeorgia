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
 * Build a landscape-cropped Unsplash URL. Forcing a wide aspect ratio makes
 * Unsplash smart-crop the source to landscape, so tall/portrait photos still
 * fill a full-screen hero without showing only a thin slice.
 */
export function unsplashLandscape(path: string, width = 2200, ratio = 16 / 9): string {
  const height = Math.round(width / ratio);
  // Centre crop (no `crop=entropy`, which can lock onto a dark/busy region and
  // miss the composed subject).
  return `${BASE}/${path}?auto=format&fit=crop&w=${width}&h=${height}&q=80`;
}

/**
 * Portrait-cropped Unsplash URL for phones. A full-screen hero on a tall phone
 * would otherwise blow a landscape photo up to a thin central slice; asking
 * Unsplash for a portrait crop keeps the whole scene in view at a sane zoom.
 */
export function unsplashPortrait(path: string, width = 1200, ratio = 3 / 4): string {
  const height = Math.round(width / ratio);
  return `${BASE}/${path}?auto=format&fit=crop&w=${width}&h=${height}&q=80`;
}

/**
 * Central registry of the photos used across the site, so the same shot is
 * referenced by name rather than by an opaque id scattered through the data.
 */
export const photos = {
  // Hero slideshow — bright, full-screen landscape shots.
  kazbegiChurch: 'photo-1563284223-333497472e88',
  tbilisiAerial: 'photo-1603350576276-24747f7bbf40',
  kakhetiVineyard: 'photo-1694500788249-71b09a87db40',
  caucasusValley: 'photo-1564755123091-ac6bfcddf43b',
  batumiCoast: 'photo-1625566360146-918001e76064',

  // Multi-day package cards & heroes.
  kazbegiMisty: 'photo-1577701122197-c9607038bd90',
  wineGrapes: 'photo-1598897893004-df11da13128a',
} as const;
