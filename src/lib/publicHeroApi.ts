/**
 * Server-side fetcher for the PUBLIC hero slideshow, used by the homepage.
 * Runs on the server (RSC/SSR) with Next's ISR cache, so the hero images are
 * baked into the HTML — no client fetch, skeleton or flash. A small static set
 * of Unsplash shots is the fallback only if the backend is briefly unavailable,
 * so the hero is never blank.
 */

export interface HeroSlide {
  id: string;
  imageUrl: string;
  alt: string;
  place: string;
}

const API_BASE = (process.env.NEXT_PUBLIC_API_URL ?? 'https://wandergeorgia-backend.vercel.app').replace(/\/$/, '');

export const HERO_REVALIDATE = 60;

const u = (path: string) =>
  `https://images.unsplash.com/${path}?auto=format&fit=crop&w=2200&h=1238&q=80`;

/** Resilient fallback (only used when the DB is unreachable at build/request). */
const FALLBACK: HeroSlide[] = [
  { id: 'f1', imageUrl: u('photo-1563284223-333497472e88'), alt: 'Gergeti Trinity Church beneath Mount Kazbek', place: 'Kazbegi' },
  { id: 'f2', imageUrl: u('photo-1603350576276-24747f7bbf40'), alt: 'The old town of Tbilisi at dusk', place: 'Tbilisi' },
  { id: 'f3', imageUrl: u('photo-1694500788249-71b09a87db40'), alt: 'Vineyards of the Kakheti wine region', place: 'Kakheti' },
  { id: 'f4', imageUrl: u('photo-1564755123091-ac6bfcddf43b'), alt: 'A green valley in the Caucasus mountains', place: 'Caucasus' },
  { id: 'f5', imageUrl: u('photo-1625566360146-918001e76064'), alt: 'The Black Sea coast of Batumi at dawn', place: 'Batumi' },
];

interface ApiHero {
  id: string;
  imageUrl: string;
  alt: string;
  place: string;
}

/** Active hero slides, in order — from the DB, with a static fallback. */
export async function loadHeroSlides(): Promise<HeroSlide[]> {
  try {
    const res = await fetch(`${API_BASE}/api/public/hero`, {
      next: { revalidate: HERO_REVALIDATE, tags: ['hero'] },
    });
    if (!res.ok) return FALLBACK;
    const data = (await res.json()) as ApiHero[];
    if (!data.length) return FALLBACK;
    return data.map((h) => ({ id: h.id, imageUrl: h.imageUrl, alt: h.alt, place: h.place }));
  } catch {
    return FALLBACK;
  }
}
