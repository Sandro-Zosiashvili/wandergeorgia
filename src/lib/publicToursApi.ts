import type { ApiTour } from './toursApi';
import type { Tour } from '@/types/tour';
import { allTours, getTourBySlug } from '@/data/tours';
import { apiTourToTour } from './apiTourMapper';

/**
 * Server-side fetchers for the PUBLIC tour API, used by the tour pages. These
 * run on the server (RSC / generateStaticParams), so they hit the backend
 * directly with an absolute URL and use Next's ISR cache (`revalidate`), which
 * makes admin edits appear live within the revalidation window.
 */

const API_BASE = (process.env.NEXT_PUBLIC_API_URL ?? 'https://wandergeorgia-backend.vercel.app').replace(/\/$/, '');

/** Seconds before a cached tour response is considered stale (ISR). */
export const TOURS_REVALIDATE = 60;

/** All active tours, or null if the backend is unavailable. */
export async function fetchPublicTours(): Promise<ApiTour[] | null> {
  try {
    const res = await fetch(`${API_BASE}/api/public/tours`, {
      next: { revalidate: TOURS_REVALIDATE, tags: ['tours'] },
    });
    if (!res.ok) return null;
    return (await res.json()) as ApiTour[];
  } catch {
    return null;
  }
}

/** A single active tour by slug, or null if missing / backend unavailable. */
export async function fetchPublicTourBySlug(slug: string): Promise<ApiTour | null> {
  try {
    const res = await fetch(`${API_BASE}/api/public/tours/${encodeURIComponent(slug)}`, {
      next: { revalidate: TOURS_REVALIDATE, tags: ['tours', `tour:${slug}`] },
    });
    if (!res.ok) return null;
    return (await res.json()) as ApiTour;
  } catch {
    return null;
  }
}

// ── Mapped loaders (DB-first, with the static catalog as a resilient fallback
//    so the public site never breaks if the backend is briefly unavailable) ──

/** All active tours, mapped to the front-end `Tour` shape. */
export async function loadTours(): Promise<Tour[]> {
  const api = await fetchPublicTours();
  if (api && api.length) return api.map(apiTourToTour);
  return allTours;
}

/** One tour by slug (DB-first, static fallback), or undefined if unknown. */
export async function loadTourBySlug(slug: string): Promise<Tour | undefined> {
  const api = await fetchPublicTourBySlug(slug);
  if (api) return apiTourToTour(api);
  return getTourBySlug(slug);
}
