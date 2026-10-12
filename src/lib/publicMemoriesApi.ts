import type { Memory } from '@/data/memories';
import { memories as staticMemories } from '@/data/memories';
import type { Locale } from './locale';

const langQuery = (lang: Locale) => (lang === 'ru' ? '?lang=ru' : '');

/**
 * Server-side fetcher for the PUBLIC memories API, used by the home "Moments"
 * section and the /memories gallery. Runs on the server (RSC) and uses Next's
 * ISR cache, so admin edits appear live within the revalidation window. Falls
 * back to the static mock set if the backend is briefly unavailable, so the
 * public site never renders an empty gallery.
 */

const API_BASE = (process.env.NEXT_PUBLIC_API_URL ?? 'https://wandergeorgia-backend.vercel.app').replace(/\/$/, '');

/** Seconds before a cached memories response is considered stale (ISR). */
export const MEMORIES_REVALIDATE = 60;

interface ApiMemory {
  id: string;
  type: 'image' | 'video';
  mediaUrl: string;
  thumbnailUrl: string;
  tourTitle: string;
  caption: string;
  travelerName: string;
  country: string;
  date: string;
}

/** Map a DB memory to the front-end `Memory` shape (thumbnail falls back to the
 *  media URL for images that didn't set one). */
function toMemory(m: ApiMemory): Memory {
  return {
    id: m.id,
    type: m.type,
    mediaUrl: m.mediaUrl,
    thumbnailUrl: m.thumbnailUrl || m.mediaUrl,
    tourTitle: m.tourTitle,
    caption: m.caption,
    travelerName: m.travelerName,
    country: m.country,
    date: m.date,
  };
}

/** All active memories, mapped — static mock only when the backend is down. */
export async function loadMemories(lang: Locale = 'en'): Promise<Memory[]> {
  try {
    const res = await fetch(`${API_BASE}/api/public/memories${langQuery(lang)}`, {
      next: { revalidate: MEMORIES_REVALIDATE, tags: ['memories', `memories:${lang}`] },
    });
    if (!res.ok) return staticMemories;
    const data = (await res.json()) as ApiMemory[];
    return data.length ? data.map(toMemory) : staticMemories;
  } catch {
    return staticMemories;
  }
}
