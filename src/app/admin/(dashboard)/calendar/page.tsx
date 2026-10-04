import type { Metadata } from 'next';
import CalendarClient from './CalendarClient';

export const metadata: Metadata = {
  title: 'Calendar',
  robots: { index: false, follow: false },
};

export default function CalendarPage() {
  return <CalendarClient />;
}
