/**
 * Admin Hero-slideshow API client. Same-origin relative paths (`/api/hero`)
 * rewritten to the NestJS backend; the HttpOnly admin cookie rides along.
 */

export interface ApiHeroImage {
  id: string;
  imageUrl: string;
  alt: string;
  place: string;
  orderIndex: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface HeroInput {
  imageUrl: string;
  alt?: string;
  place?: string;
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

const BASE = '/api/hero';
const JSON_HEADERS = { 'Content-Type': 'application/json' };

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const body = (await res.json()) as { message?: string | string[] };
      if (body?.message) {
        message = Array.isArray(body.message) ? body.message.join(', ') : body.message;
      }
    } catch {
      /* keep default */
    }
    throw new ApiError(message, res.status);
  }
  const text = await res.text();
  return (text ? JSON.parse(text) : undefined) as T;
}

export async function listHero(): Promise<ApiHeroImage[]> {
  return handle<ApiHeroImage[]>(await fetch(BASE, { credentials: 'include' }));
}

export async function createHero(input: HeroInput): Promise<ApiHeroImage> {
  return handle<ApiHeroImage>(
    await fetch(BASE, { method: 'POST', headers: JSON_HEADERS, credentials: 'include', body: JSON.stringify(input) }),
  );
}

export async function updateHero(id: string, input: Partial<HeroInput>): Promise<ApiHeroImage> {
  return handle<ApiHeroImage>(
    await fetch(`${BASE}/${id}`, { method: 'PATCH', headers: JSON_HEADERS, credentials: 'include', body: JSON.stringify(input) }),
  );
}

export async function deleteHero(id: string): Promise<void> {
  await handle<{ ok: true }>(await fetch(`${BASE}/${id}`, { method: 'DELETE', credentials: 'include' }));
}

/** Persist a new order: `ids` in their new sequence. */
export async function reorderHero(ids: string[]): Promise<void> {
  await handle<{ ok: true }>(
    await fetch(`${BASE}/reorder`, { method: 'PATCH', headers: JSON_HEADERS, credentials: 'include', body: JSON.stringify({ ids }) }),
  );
}

/** Purge the home hero cache so changes appear instantly. Best-effort. */
export async function revalidateHero(): Promise<void> {
  try {
    await fetch('/revalidate-hero', { method: 'POST', credentials: 'include' });
  } catch {
    /* ISR timer still catches up */
  }
}
