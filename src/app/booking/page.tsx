import type { Metadata } from 'next';
import { getTourBySlug } from '@/data/tours';
import Container from '@/components/ui/Container/Container';
import BookingFlow from '@/components/booking/BookingFlow/BookingFlow';
import BookingHeader from '@/components/booking/BookingHeader/BookingHeader';
import BookingTourPicker from '@/components/booking/BookingTourPicker/BookingTourPicker';
import styles from './page.module.scss';

export const metadata: Metadata = {
  title: 'Book your tour',
  description: 'Reserve your private Georgian tour — airport transfers included.',
};

interface PageProps {
  searchParams: Promise<{ tour?: string }>;
}

export default async function BookingPage({ searchParams }: PageProps) {
  const { tour: slug } = await searchParams;
  const tour = slug ? getTourBySlug(slug) : undefined;

  return (
    <div className={styles.page}>
      <Container>
        {tour ? (
          <>
            <BookingHeader tourTitle={tour.title} tourSlug={tour.slug} />
            <BookingFlow tour={tour} />
          </>
        ) : (
          <BookingTourPicker />
        )}
      </Container>
    </div>
  );
}
