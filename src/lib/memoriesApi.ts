/**
 * Admin Memories API client. Same-origin relative paths (`/api/memories`) that
 * next.config.ts rewrites to the NestJS backend, so the HttpOnly admin cookie
 * rides along. Every call sends `credentials: 'include'`.
 */

export type MemoryType = 'image' | 'video';

export interface ApiMemory {
  id: string;
  type: MemoryType;
  mediaUrl: string;
  thumbnailUrl: string;
  tourTitle: string;
  caption: string;
  travelerName: string;
  country: string;
  date: string;
  orderIndex: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/** Fields accepted by POST / PATCH. */
export interface MemoryInput {
  type: MemoryType;
  mediaUrl: string;
  thumbnailUrl?: string;
  tourTitle?: string;
  caption?: string;
  travelerName?: string;
  country?: string;
  date?: string;
  orderIndex?: number;
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

const BASE = '/api/memories';
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
      /* non-JSON error body — keep the default message */
    }
    throw new ApiError(message, res.status);
  }
  const text = await res.text();
  return (text ? JSON.parse(text) : undefined) as T;
}

export async function listMemories(): Promise<ApiMemory[]> {
  return handle<ApiMemory[]>(await fetch(BASE, { credentials: 'include' }));
}

export async function createMemory(input: MemoryInput): Promise<ApiMemory> {
  return handle<ApiMemory>(
    await fetch(BASE, {
      method: 'POST',
      headers: JSON_HEADERS,
      credentials: 'include',
      body: JSON.stringify(input),
    }),
  );
}

export async function updateMemory(id: string, input: Partial<MemoryInput>): Promise<ApiMemory> {
  return handle<ApiMemory>(
    await fetch(`${BASE}/${id}`, {
      method: 'PATCH',
      headers: JSON_HEADERS,
      credentials: 'include',
      body: JSON.stringify(input),
    }),
  );
}

export async function deleteMemory(id: string): Promise<void> {
  await handle<{ ok: true }>(
    await fetch(`${BASE}/${id}`, { method: 'DELETE', credentials: 'include' }),
  );
}

/**
 * Purge the public caches (home "Moments" section + /memories gallery) so admin
 * changes appear for visitors immediately. Best-effort — never blocks the
 * admin action.
 */
export async function revalidateMemories(): Promise<void> {
  try {
    await fetch('/revalidate-memories', { method: 'POST', credentials: 'include' });
  } catch {
    /* ignore — the ISR timer still catches up within ~60s */
  }
}
