import type { Metadata } from 'next';
import ToursClient from './ToursClient';

export const metadata: Metadata = {
  title: 'Tours',
  robots: { index: false, follow: false },
};

export default function ToursPage() {
  return <ToursClient />;
}
