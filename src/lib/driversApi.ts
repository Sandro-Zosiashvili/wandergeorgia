/**
 * Admin Drivers API client. Same-origin relative paths (`/api/drivers`) that
 * next.config.ts rewrites to the NestJS backend, so the HttpOnly admin cookie
 * rides along. Every call sends `credentials: 'include'`.
 */

export type DriverStatus = 'ACTIVE' | 'ON_TOUR' | 'INACTIVE';

/** A tour as embedded in a driver's `tours` relation. */
export interface DriverTour {
  id: string;
  title: string;
  slug: string;
  type: 'one-day' | 'multi-day';
  isActive: boolean;
}

export interface ApiDriver {
  id: string;
  name: string;
  phone: string;
  photo: string;
  bio: string;
  vehicleModel: string;
  plate: string;
  capacity: number;
  status: DriverStatus;
  isActive: boolean;
  orderIndex: number;
  tours: DriverTour[];
  createdAt: string;
  updatedAt: string;
}

/** Fields accepted by POST / PATCH. */
export interface DriverInput {
  name: string;
  phone?: string;
  photo?: string;
  bio?: string;
  vehicleModel?: string;
  plate?: string;
  capacity?: number;
  status?: DriverStatus;
  isActive?: boolean;
  /** Tour ids assigned to this driver (replaces the set). */
  tourIds?: string[];
}

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

const BASE = '/api/drivers';
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

export async function listDrivers(): Promise<ApiDriver[]> {
  return handle<ApiDriver[]>(await fetch(BASE, { credentials: 'include' }));
}

export async function createDriver(input: DriverInput): Promise<ApiDriver> {
  return handle<ApiDriver>(
    await fetch(BASE, { method: 'POST', headers: JSON_HEADERS, credentials: 'include', body: JSON.stringify(input) }),
  );
}

export async function updateDriver(id: string, input: Partial<DriverInput>): Promise<ApiDriver> {
  return handle<ApiDriver>(
    await fetch(`${BASE}/${id}`, { method: 'PATCH', headers: JSON_HEADERS, credentials: 'include', body: JSON.stringify(input) }),
  );
}

export async function deleteDriver(id: string): Promise<void> {
  await handle<{ ok: true }>(await fetch(`${BASE}/${id}`, { method: 'DELETE', credentials: 'include' }));
}
