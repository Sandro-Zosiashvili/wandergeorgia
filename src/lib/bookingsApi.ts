/**
 * Admin Bookings API client. Same-origin relative paths (`/api/bookings`) that
 * next.config.ts rewrites to the NestJS backend, so the HttpOnly admin cookie
 * rides along. Every call sends `credentials: 'include'`.
 * (Public submissions go to POST /booking via the booking flow hook.)
 */

export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
export type PaymentStatus = 'UNPAID' | 'DEPOSIT_PAID' | 'FULL_PAID';

export interface ApiBooking {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  tourTitle: string;
  startDate: string;
  daysCount: number;
  passengers: number;
  vehicleType: string;
  totalPrice: number;
  specialRequests: string | null;
  adminNotes: string | null;
  paymentStatus: PaymentStatus;
  driverName: string | null;
  status: BookingStatus;
  createdAt: string;
}

export interface BookingUpdate {
  status?: BookingStatus;
  paymentStatus?: PaymentStatus;
  driverName?: string;
  adminNotes?: string;
}

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

const BASE = '/api/bookings';
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

export async function listBookings(): Promise<ApiBooking[]> {
  return handle<ApiBooking[]>(await fetch(BASE, { credentials: 'include' }));
}

export async function updateBooking(id: string, update: BookingUpdate): Promise<ApiBooking> {
  return handle<ApiBooking>(
    await fetch(`${BASE}/${id}`, {
      method: 'PATCH',
      headers: JSON_HEADERS,
      credentials: 'include',
      body: JSON.stringify(update),
    }),
  );
}

export async function deleteBooking(id: string): Promise<void> {
  await handle<{ ok: true }>(
    await fetch(`${BASE}/${id}`, { method: 'DELETE', credentials: 'include' }),
  );
}
