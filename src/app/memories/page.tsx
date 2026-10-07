import type { Metadata } from 'next';
import Container from '@/components/ui/Container/Container';
import SectionHeading from '@/components/ui/SectionHeading/SectionHeading';
import MemoriesGallery from '@/components/memories/MemoriesGallery/MemoriesGallery';
import styles from './page.module.scss';

export const metadata: Metadata = {
  title: 'Traveler Moments',
  description:
    'Real photos and video clips shared by guests on their private Georgia tours — from Kazbegi sunrises to Kakheti wine cellars. Browse the full gallery.',
  keywords: [
    'Georgia tour photos',
    'traveler moments Georgia',
    'Georgia trip gallery',
    'WanderKartli guests',
  ],
  alternates: {
    canonical: '/memories',
  },
  openGraph: {
    type: 'website',
    url: '/memories',
    title: 'Traveler Moments · WanderKartli',
    description:
      'Real photos and clips from guests across Georgia. A glimpse of the trip waiting for you.',
  },
};

export default function MemoriesPage() {
  return (
    <div className={styles.page}>
      <Container>
        <div className={styles.header}>
          <SectionHeading
            eyebrow="Traveler moments"
            title="Memories from the road"
            description="Every photo and clip here was shared by a guest on one of our private tours. Filter by photos or videos, and tap any moment to view it full size."
            align="center"
          />
        </div>

        <MemoriesGallery />
      </Container>
    </div>
  );
}
