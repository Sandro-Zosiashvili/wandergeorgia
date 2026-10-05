import type { Metadata } from 'next';
import { loadTourBySlug, loadTours } from '@/lib/publicToursApi';
import Container from '@/components/ui/Container/Container';
import BookingFlow from '@/components/booking/BookingFlow/BookingFlow';
import BookingHeader from '@/components/booking/BookingHeader/BookingHeader';
import BookingTourPicker from '@/components/booking/BookingTourPicker/BookingTourPicker';
import styles from './page.module.scss';

export const metadata: Metadata = {
  title: 'Book a Private Georgia Tour',
  description:
    'Reserve your private Georgia tour online. Choose your dates, group size and vehicle — English-speaking driver-guide and airport transfers included. Book today.',
  keywords: [
    'book Georgia tour',
    'private Georgia tour booking',
    'reserve Georgia day tour',
    'Georgia tour with driver',
  ],
  alternates: {
    canonical: '/booking',
  },
  openGraph: {
    type: 'website',
    url: '/booking',
    title: 'Book a Private Georgia Tour · WanderKartli',
    description:
      'Reserve your private Georgia tour — pick your dates, group size and vehicle. Driver-guide and airport transfers included.',
  },
};

interface PageProps {
  searchParams: Promise<{ tour?: string }>;
}

export default async function BookingPage({ searchParams }: PageProps) {
  const { tour: slug } = await searchParams;
  const tour = slug ? await loadTourBySlug(slug) : undefined;

  return (
    <div className={styles.page}>
      <Container>
        {tour ? (
          <>
            <BookingHeader tourTitle={tour.title} tourSlug={tour.slug} />
            <BookingFlow tour={tour} />
          </>
        ) : (
          <BookingTourPicker tours={await loadTours()} />
        )}
      </Container>
    </div>
  );
}
