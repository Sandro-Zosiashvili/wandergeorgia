import Image from 'next/image';
import Link from 'next/link';
import type { Tour } from '@/types/tour';
import { formatGEL } from '@/lib/format';
import Icon from '@/components/ui/Icon/Icon';
import styles from './TourCard.module.scss';

interface TourCardProps {
  tour: Tour;
  /** Larger, feature-sized card for the first item in a grid. */
  featured?: boolean;
}

/** Day-tour card: image, location, title, duration and price. */
export default function TourCard({ tour, featured = false }: TourCardProps) {
  return (
    <Link
      href={`/tours/${tour.slug}`}
      className={[styles.card, featured ? styles.featured : ''].filter(Boolean).join(' ')}
    >
      <div className={styles.media}>
        <Image
          src={tour.cardImage}
          alt={tour.title}
          fill
          sizes={featured ? '(max-width: 768px) 100vw, 66vw' : '(max-width: 768px) 100vw, 33vw'}
          className={styles.image}
        />
        <div className={styles.mediaScrim} aria-hidden="true" />
        <span className={styles.city}>
          <Icon name="map-pin" size={14} />
          {tour.city}
        </span>
      </div>

      <div className={styles.body}>
        <div className={styles.meta}>
          <span className={styles.duration}>
            <Icon name="clock" size={15} />
            {tour.duration}
          </span>
          <span className={styles.price}>
            <span className={styles.priceFrom}>from</span> {formatGEL(tour.price)}
          </span>
        </div>

        <h3 className={styles.title}>{tour.title}</h3>
        <p className={styles.desc}>{tour.shortDescription}</p>

        <span className={styles.cta}>
          View this tour
          <Icon name="arrow-right" size={17} className={styles.ctaIcon} />
        </span>
      </div>
    </Link>
  );
}
