import type { Metadata } from 'next';
import HeroClient from './HeroClient';

export const metadata: Metadata = {
  title: 'Hero slideshow',
  robots: { index: false, follow: false },
};

export default function HeroAdminPage() {
  return <HeroClient />;
}
