import type { Tour } from '@/types/tour';
import type { Locale } from '@/lib/locale';
import { formatUSD } from '@/lib/format';
import { fromPriceUSD, getFixedPackage } from '@/lib/pricing';
import { whatsappLink } from '@/config/site';
import { ui, tpl } from '@/lib/uiStrings';
import Button from '@/components/ui/Button/Button';
import Icon from '@/components/ui/Icon/Icon';
import styles from './TourBookingCard.module.scss';

interface TourBookingCardProps {
  tour: Tour;
  lang: Locale;
}

/** Sticky price + booking panel shown alongside the tour content. */
export default function TourBookingCard({ tour, lang }: TourBookingCardProps) {
  const t = ui(lang).tourDetail;
  const isFixed = getFixedPackage(tour) !== null;
  const perLabel = isFixed ? t.packageJeep : t.perGroup;

  return (
    <aside className={styles.card} aria-label={t.bookAria}>
      <div className={styles.priceRow}>
        <div>
          {isFixed ? null : <span className={styles.from}>{ui(lang).tourCard.from}</span>}
          <span className={styles.price}>{formatUSD(fromPriceUSD(tour))}</span>
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
          <span>{t.privateOnly}</span>
        </li>
        <li className={styles.highlight}>
          <Icon name="plane-arrival" size={17} />
          <span>{t.airportTransfers}</span>
        </li>
      </ul>

      <Button
        href={`/booking?tour=${tour.slug}`}
        size="lg"
        icon="arrow-right"
        fullWidth
        className={styles.book}
      >
        {t.bookNow}
      </Button>

      <Button
        href={whatsappLink(tpl(t.askMessage, { tour: tour.title }))}
        external
        variant="outline"
        icon="whatsapp"
        iconLeading
        fullWidth
      >
        {t.askQuestion}
      </Button>

      <p className={styles.reassurance}>
        <Icon name="shield" size={15} />
        {t.reassurance}
      </p>
    </aside>
  );
}
