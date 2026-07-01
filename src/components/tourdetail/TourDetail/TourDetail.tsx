import type { Tour } from '@/types/tour';
import Container from '@/components/ui/Container/Container';
import TourHero from '../TourHero/TourHero';
import TourOverview from '../TourOverview/TourOverview';
import TourItinerary from '../TourItinerary/TourItinerary';
import TourIncluded from '../TourIncluded/TourIncluded';
import TourBookingCard from '../TourBookingCard/TourBookingCard';
import RelatedTours from '../RelatedTours/RelatedTours';
import styles from './TourDetail.module.scss';

interface TourDetailProps {
  tour: Tour;
}

/** Full tour detail page composition: hero, content + sticky booking, related. */
export default function TourDetail({ tour }: TourDetailProps) {
  return (
    <article>
      <TourHero tour={tour} />

      <Container className={styles.layout}>
        <div className={styles.main}>
          <TourOverview tour={tour} />
          <TourItinerary tour={tour} />
          <TourIncluded tour={tour} />
        </div>

        <div className={styles.sidebar}>
          <TourBookingCard tour={tour} />
        </div>
      </Container>

      <RelatedTours current={tour} />
    </article>
  );
}
