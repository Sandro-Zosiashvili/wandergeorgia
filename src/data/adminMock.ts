/**
 * Mock data for the admin UI preview. Front-end only — no backend. The pages
 * seed local state from these so the interface feels alive and testable.
 */

import { allTours } from './tours';
import { fromPriceUSD } from '@/lib/pricing';

export type TourStatus = 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
export type PaymentStatus = 'UNPAID' | 'DEPOSIT_PAID' | 'FULL_PAID';
export type DriverStatus = 'ACTIVE' | 'ON_TOUR' | 'INACTIVE';

export interface AdminBooking {
  id: string;
  clientName: string;
  phone: string;
  email: string;
  tourName: string;
  startDate: string; // ISO date
  days: number;
  passengers: number;
  vehicleType: string;
  totalPrice: number; // USD
  paymentStatus: PaymentStatus;
  tourStatus: TourStatus;
  driverId: string | null;
  specialRequests?: string;
  adminNotes?: string;
  createdAt: string; // ISO
}

export interface Driver {
  id: string;
  name: string;
  phone: string;
  vehicleModel: string;
  plate: string;
  capacity: number;
  status: DriverStatus;
}

export interface AdminTour {
  id: string;
  slug: string;
  name: string;
  city: string;
  type: 'one-day' | 'multi-day';
  price: number;
  active: boolean;
}

export const mockDrivers: Driver[] = [
  { id: 'd1', name: 'Giorgi Beridze', phone: '+995 599 12 34 56', vehicleModel: 'Toyota Land Cruiser', plate: 'AA-123-BB', capacity: 4, status: 'ON_TOUR' },
  { id: 'd2', name: 'Levan Kapanadze', phone: '+995 591 44 55 66', vehicleModel: 'Mercedes V-Class', plate: 'CC-456-DD', capacity: 7, status: 'ACTIVE' },
  { id: 'd3', name: 'Nika Tsiklauri', phone: '+995 568 77 88 99', vehicleModel: 'Toyota Prado', plate: 'EE-789-FF', capacity: 4, status: 'ACTIVE' },
  { id: 'd4', name: 'Davit Maisuradze', phone: '+995 577 10 20 30', vehicleModel: 'Ford Transit', plate: 'GG-012-HH', capacity: 7, status: 'INACTIVE' },
];

export const mockBookings: AdminBooking[] = [
  { id: 'b1041', clientName: 'Emma Richardson', phone: '+44 7700 900123', email: 'emma.r@example.com', tourName: 'Kazbegi Day Tour from Tbilisi', startDate: '2026-10-08', days: 1, passengers: 2, vehicleType: 'SUV / Jeep (4x4)', totalPrice: 170, paymentStatus: 'DEPOSIT_PAID', tourStatus: 'CONFIRMED', driverId: 'd1', specialRequests: 'Vegetarian lunch stop if possible.', adminNotes: '', createdAt: '2026-10-01' },
  { id: 'b1040', clientName: 'Lucas Müller', phone: '+49 1512 3456789', email: 'l.mueller@example.de', tourName: 'Kakheti Wine Day Tour', startDate: '2026-10-09', days: 1, passengers: 4, vehicleType: 'Minivan', totalPrice: 180, paymentStatus: 'UNPAID', tourStatus: 'PENDING', driverId: null, specialRequests: 'Celebrating an anniversary 🍷', adminNotes: '', createdAt: '2026-10-02' },
  { id: 'b1039', clientName: 'Sophie Laurent', phone: '+33 6 12 34 56 78', email: 'sophie.l@example.fr', tourName: 'Georgia Highlights Tour', startDate: '2026-10-12', days: 8, passengers: 2, vehicleType: 'SUV / Jeep (4x4)', totalPrice: 1200, paymentStatus: 'DEPOSIT_PAID', tourStatus: 'CONFIRMED', driverId: 'd3', specialRequests: 'Two single beds where possible.', adminNotes: 'VIP — repeat client.', createdAt: '2026-09-28' },
  { id: 'b1038', clientName: 'James O’Connor', phone: '+353 86 123 4567', email: 'james.oc@example.ie', tourName: 'Martvili Canyon & Prometheus Cave Day Tour', startDate: '2026-10-07', days: 1, passengers: 3, vehicleType: 'Sedan', totalPrice: 180, paymentStatus: 'FULL_PAID', tourStatus: 'COMPLETED', driverId: 'd2', specialRequests: '', adminNotes: 'Left a 5★ review.', createdAt: '2026-09-25' },
  { id: 'b1037', clientName: 'Mia Andersson', phone: '+46 70 123 45 67', email: 'mia.a@example.se', tourName: 'Tbilisi & Mtskheta Day Tour', startDate: '2026-10-10', days: 1, passengers: 2, vehicleType: 'Sedan', totalPrice: 100, paymentStatus: 'UNPAID', tourStatus: 'PENDING', driverId: null, specialRequests: 'Interested in sulphur baths.', adminNotes: '', createdAt: '2026-10-03' },
  { id: 'b1036', clientName: 'Daniel Rossi', phone: '+39 333 123 4567', email: 'd.rossi@example.it', tourName: 'Ultimate Georgia Adventure — 13 Days', startDate: '2026-10-15', days: 13, passengers: 4, vehicleType: 'SUV / Jeep (4x4)', totalPrice: 2780, paymentStatus: 'DEPOSIT_PAID', tourStatus: 'CONFIRMED', driverId: 'd1', specialRequests: 'Keen hiker — extra Tusheti time.', adminNotes: '', createdAt: '2026-09-20' },
  { id: 'b1035', clientName: 'Olivia Smith', phone: '+1 415 555 0142', email: 'olivia.s@example.com', tourName: 'Dashbashi Canyon Day Tour', startDate: '2026-10-06', days: 1, passengers: 5, vehicleType: 'Minivan', totalPrice: 180, paymentStatus: 'FULL_PAID', tourStatus: 'COMPLETED', driverId: 'd2', specialRequests: '', adminNotes: '', createdAt: '2026-09-22' },
  { id: 'b1034', clientName: 'Noah Johnson', phone: '+1 646 555 0199', email: 'noah.j@example.com', tourName: 'Tbilisi to Batumi Private Transfer', startDate: '2026-10-11', days: 1, passengers: 3, vehicleType: 'Sedan', totalPrice: 190, paymentStatus: 'UNPAID', tourStatus: 'CANCELLED', driverId: null, specialRequests: 'Flight change — may rebook.', adminNotes: 'Client cancelled 03 Oct.', createdAt: '2026-09-29' },
  { id: 'b1033', clientName: 'Hannah Becker', phone: '+49 160 1112223', email: 'h.becker@example.de', tourName: 'Wine & Mountains — 5 Days', startDate: '2026-10-18', days: 5, passengers: 2, vehicleType: 'SUV / Jeep (4x4)', totalPrice: 750, paymentStatus: 'DEPOSIT_PAID', tourStatus: 'CONFIRMED', driverId: 'd3', specialRequests: 'Prefers boutique guesthouses.', adminNotes: '', createdAt: '2026-10-01' },
  { id: 'b1032', clientName: 'Arjun Patel', phone: '+91 98765 43210', email: 'arjun.p@example.in', tourName: 'Borjomi Day Tour from Tbilisi', startDate: '2026-10-13', days: 1, passengers: 6, vehicleType: 'Minivan', totalPrice: 170, paymentStatus: 'UNPAID', tourStatus: 'PENDING', driverId: null, specialRequests: 'Group of friends, flexible timing.', adminNotes: '', createdAt: '2026-10-03' },
];

/** Tour catalog derived from the live site tours, with an active toggle. */
export const mockTours: AdminTour[] = allTours.map((t, i) => ({
  id: `t${i + 1}`,
  slug: t.slug,
  name: t.title,
  city: t.city,
  type: t.type,
  price: fromPriceUSD(t),
  active: true,
}));

/** Monthly tour-request counts for the trends chart. */
export const bookingTrends: { month: string; count: number }[] = [
  { month: 'May', count: 22 },
  { month: 'Jun', count: 31 },
  { month: 'Jul', count: 48 },
  { month: 'Aug', count: 54 },
  { month: 'Sep', count: 39 },
  { month: 'Oct', count: 27 },
];

export const vehicleTypes = ['Sedan', 'SUV / Jeep (4x4)', 'Minivan', 'Business Minivan'] as const;

/** Build a WhatsApp deep link to a client/driver phone number. */
export function waLink(phone: string, message?: string): string {
  const num = phone.replace(/[^0-9]/g, '');
  const text = message ? `?text=${encodeURIComponent(message)}` : '';
  return `https://wa.me/${num}${text}`;
}

export function driverById(id: string | null, drivers: Driver[]): Driver | undefined {
  return id ? drivers.find((d) => d.id === id) : undefined;
}
