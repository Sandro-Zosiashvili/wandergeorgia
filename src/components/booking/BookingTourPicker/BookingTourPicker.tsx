import Image from 'next/image';
import LocaleLink from '@/components/ui/LocaleLink/LocaleLink';
import type { Tour } from '@/types/tour';
import type { Locale } from '@/lib/locale';
import { ui } from '@/lib/uiStrings';
import { formatUSD } from '@/lib/format';
import { fromPriceUSD } from '@/lib/pricing';
import Icon from '@/components/ui/Icon/Icon';
import styles from './BookingTourPicker.module.scss';

interface BookingTourPickerProps {
  tours: Tour[];
  lang: Locale;
}

/** Shown when /booking is opened without a valid tour — pick one to begin. */
export default function BookingTourPicker({ tours, lang }: BookingTourPickerProps) {
  const t = ui(lang).booking.picker;
  return (
    <div className={styles.picker}>
      <div className={styles.intro}>
        <h1 className={styles.title}>{t.title}</h1>
        <p className={styles.text}>{t.text}</p>
      </div>

      <ul className={styles.grid}>
        {tours.map((tour) => (
          <li key={tour.slug}>
            <LocaleLink href={`/booking?tour=${tour.slug}`} className={styles.card}>
              <span className={styles.media}>
                <Image src={tour.cardImage} alt={tour.title} fill sizes="120px" className={styles.image} />
              </span>
              <span className={styles.info}>
                <span className={styles.cardTitle}>{tour.title}</span>
                <span className={styles.meta}>
                  {tour.city} · {tour.duration} · {t.from} {formatUSD(fromPriceUSD(tour))}
                </span>
              </span>
              <Icon name="arrow-right" size={18} className={styles.arrow} />
            </LocaleLink>
          </li>
        ))}
      </ul>
    </div>
  );
}
