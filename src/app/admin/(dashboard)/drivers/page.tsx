import type { Metadata } from 'next';
import DriversClient from './DriversClient';

export const metadata: Metadata = {
  title: 'Drivers',
  robots: { index: false, follow: false },
};

export default function DriversPage() {
  return <DriversClient />;
}
