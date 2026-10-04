import type { Metadata } from 'next';
import BookingsClient from './BookingsClient';

export const metadata: Metadata = {
  title: 'Bookings',
  robots: { index: false, follow: false },
};

export default function BookingsPage() {
  return <BookingsClient />;
}
