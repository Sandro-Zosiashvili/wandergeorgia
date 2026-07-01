import Image from 'next/image';
import Link from 'next/link';
import type { Tour } from '@/types/tour';
import { formatGEL } from '@/lib/format';
import Icon from '@/components/ui/Icon/Icon';
import Button from '@/components/ui/Button/Button';
import styles from './MultiDayCard.module.scss';

interface MultiDayCardProps {
  tour: Tour;
  /** Flip media to the right for an alternating rhythm. */
  reversed?: boolean;
}

/** Wide, editorial card for multi-day packages with highlights + itinerary. */
export default function MultiDayCard({ tour, reversed = false }: MultiDayCardProps) {
  return (
    <article className={[styles.card, reversed ? styles.reversed : ''].filter(Boolean).join(' ')}>
      <Link href={`/tours/${tour.slug}`} className={styles.media} aria-label={tour.title}>
        <Image
          src={tour.cardImage}
          alt={tour.title}
          fill
          sizes="(max-width: 900px) 100vw, 50vw"
          className={styles.image}
        />
        <div className={styles.mediaScrim} aria-hidden="true" />
        <span className={styles.daysBadge}>
          <span className={styles.daysNum}>{tour.days}</span>
          <span className={styles.daysLabel}>days</span>
        </span>
      </Link>

      <div className={styles.body}>
        <span className={styles.route}>
          <Icon name="route" size={16} />
          {tour.city}
        </span>

        <h3 className={styles.title}>
          <Link href={`/tours/${tour.slug}`} className={styles.titleLink}>
            {tour.title}
          </Link>
        </h3>

        <p className={styles.desc}>{tour.shortDescription}</p>

        {tour.highlights ? (
          <ul className={styles.highlights}>
            {tour.highlights.map((h) => (
              <li key={h} className={styles.highlight}>
                <Icon name="check" size={15} />
                {h}
              </li>
            ))}
          </ul>
        ) : null}

        <div className={styles.footer}>
          <div className={styles.priceBlock}>
            <span className={styles.priceFrom}>from</span>
            <span className={styles.price}>{formatGEL(tour.price)}</span>
            <span className={styles.perPerson}>/ person</span>
          </div>
          <Button href={`/tours/${tour.slug}`} icon="arrow-right" size="sm">
            View package
          </Button>
        </div>
      </div>
    </article>
  );
}
