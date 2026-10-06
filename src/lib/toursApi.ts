/**
 * Admin Tours API client. Same-origin relative paths (`/api/tours`) that
 * next.config.ts rewrites to the NestJS backend, so the HttpOnly admin cookie
 * rides along. Every call sends `credentials: 'include'`.
 */

export interface ApiItineraryDay {
  title: string;
  description: string;
  highlights: string[];
}

export interface ApiTour {
  id: string;
  title: string;
  slug: string;
  type: 'one-day' | 'multi-day';
  location: string;
  duration: string;
  basePrice: number;
  overview: string;
  highlights: string[];
  included: string[];
  excluded: string[];
  itinerary: ApiItineraryDay[];
  coverImage: string;
  gallery: string[];
  isActive: boolean;
  orderIndex: number;
  createdAt: string;
  updatedAt: string;
}

/** Fields accepted by POST / PATCH. */
export interface TourInput {
  title: string;
  slug: string;
  type: 'one-day' | 'multi-day';
  location?: string;
  duration?: string;
  basePrice: number;
  overview?: string;
  highlights?: string[];
  included?: string[];
  excluded?: string[];
  itinerary?: ApiItineraryDay[];
  coverImage?: string;
  gallery?: string[];
  isActive?: boolean;
}

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

const BASE = '/api/tours';

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const body = (await res.json()) as { message?: string | string[] };
      if (body?.message) {
        message = Array.isArray(body.message) ? body.message.join(', ') : body.message;
      }
    } catch {
      /* non-JSON error body — keep the default message */
    }
    throw new ApiError(message, res.status);
  }
  // DELETE may return an empty body.
  const text = await res.text();
  return (text ? JSON.parse(text) : undefined) as T;
}

const JSON_HEADERS = { 'Content-Type': 'application/json' };

export async function listTours(): Promise<ApiTour[]> {
  return handle<ApiTour[]>(await fetch(BASE, { credentials: 'include' }));
}

export async function getTour(id: string): Promise<ApiTour> {
  return handle<ApiTour>(await fetch(`${BASE}/${id}`, { credentials: 'include' }));
}

export async function createTour(input: TourInput): Promise<ApiTour> {
  return handle<ApiTour>(
    await fetch(BASE, {
      method: 'POST',
      headers: JSON_HEADERS,
      credentials: 'include',
      body: JSON.stringify(input),
    }),
  );
}

export async function updateTour(id: string, input: Partial<TourInput>): Promise<ApiTour> {
  return handle<ApiTour>(
    await fetch(`${BASE}/${id}`, {
      method: 'PATCH',
      headers: JSON_HEADERS,
      credentials: 'include',
      body: JSON.stringify(input),
    }),
  );
}

export async function deleteTour(id: string): Promise<void> {
  await handle<{ ok: true }>(
    await fetch(`${BASE}/${id}`, { method: 'DELETE', credentials: 'include' }),
  );
}

/** Persist a new order for a category: `ids` in their new order. */
export async function reorderTours(ids: string[]): Promise<void> {
  await handle<{ ok: true }>(
    await fetch(`${BASE}/reorder`, {
      method: 'PATCH',
      headers: JSON_HEADERS,
      credentials: 'include',
      body: JSON.stringify({ ids }),
    }),
  );
}

/**
 * Purge the public tour caches on demand (home listing, detail pages, sitemap,
 * footer) so admin changes appear for visitors immediately. Best-effort — a
 * failure here never blocks the admin action.
 */
export async function revalidateTours(): Promise<void> {
  try {
    await fetch('/revalidate-tours', { method: 'POST', credentials: 'include' });
  } catch {
    /* ignore — the ISR timer still catches up within ~60s */
  }
}
