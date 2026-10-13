import type { Tour } from '@/types/tour';
import type { Locale } from '@/lib/locale';
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
  lang: Locale;
}

/** Full tour detail page composition: hero, content + sticky booking, related. */
export default function TourDetail({ tour, lang }: TourDetailProps) {
  return (
    <article>
      <TourHero tour={tour} />

      <Container className={styles.layout}>
        <div className={styles.main}>
          <TourOverview tour={tour} lang={lang} />
          <TourItinerary tour={tour} lang={lang} />
          <TourIncluded tour={tour} lang={lang} />
        </div>

        <div className={styles.sidebar}>
          <TourBookingCard tour={tour} lang={lang} />
        </div>
      </Container>

      <RelatedTours current={tour} lang={lang} />
    </article>
  );
}
