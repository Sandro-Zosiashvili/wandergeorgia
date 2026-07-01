import type { Tour } from '@/types/tour';
import { formatGEL } from '@/lib/format';
import { whatsappLink } from '@/config/site';
import Button from '@/components/ui/Button/Button';
import Icon from '@/components/ui/Icon/Icon';
import styles from './TourBookingCard.module.scss';

interface TourBookingCardProps {
  tour: Tour;
}

/** Sticky price + booking panel shown alongside the tour content. */
export default function TourBookingCard({ tour }: TourBookingCardProps) {
  const perLabel = tour.type === 'multi-day' ? 'per person' : 'per group';

  return (
    <aside className={styles.card} aria-label="Book this tour">
      <div className={styles.priceRow}>
        <div>
          <span className={styles.from}>from</span>
          <span className={styles.price}>{formatGEL(tour.price)}</span>
        </div>
        <span className={styles.per}>{perLabel}</span>
      </div>

      <ul className={styles.facts}>
        <li>
          <Icon name="clock" size={17} />
          <span>{tour.duration}</span>
        </li>
        <li>
          <Icon name="map-pin" size={17} />
          <span>{tour.city}</span>
        </li>
        <li>
          <Icon name="users" size={17} />
          <span>Private — your group only</span>
        </li>
        <li className={styles.highlight}>
          <Icon name="plane-arrival" size={17} />
          <span>Airport pickup &amp; drop-off</span>
        </li>
      </ul>

      <Button
        href={`/booking?tour=${tour.slug}`}
        size="lg"
        icon="arrow-right"
        fullWidth
        className={styles.book}
      >
        Book now
      </Button>

      <Button
        href={whatsappLink(`Hi WanderGeorgia, I'm interested in the "${tour.title}" tour.`)}
        external
        variant="outline"
        icon="whatsapp"
        iconLeading
        fullWidth
      >
        Ask a question
      </Button>

      <p className={styles.reassurance}>
        <Icon name="shield" size={15} />
        No payment today — reserve your dates and we&apos;ll confirm within 24 hours.
      </p>
    </aside>
  );
}
