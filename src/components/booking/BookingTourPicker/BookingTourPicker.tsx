import Link from 'next/link';
import Image from 'next/image';
import { allTours } from '@/data/tours';
import { formatGEL } from '@/lib/format';
import Icon from '@/components/ui/Icon/Icon';
import styles from './BookingTourPicker.module.scss';

/** Shown when /booking is opened without a valid tour — pick one to begin. */
export default function BookingTourPicker() {
  return (
    <div className={styles.picker}>
      <div className={styles.intro}>
        <h1 className={styles.title}>Choose a tour to book</h1>
        <p className={styles.text}>
          Select the experience you&apos;d like to reserve and we&apos;ll walk you
          through the details.
        </p>
      </div>

      <ul className={styles.grid}>
        {allTours.map((tour) => (
          <li key={tour.slug}>
            <Link href={`/booking?tour=${tour.slug}`} className={styles.card}>
              <span className={styles.media}>
                <Image src={tour.cardImage} alt={tour.title} fill sizes="120px" className={styles.image} />
              </span>
              <span className={styles.info}>
                <span className={styles.cardTitle}>{tour.title}</span>
                <span className={styles.meta}>
                  {tour.city} · {tour.duration} · from {formatGEL(tour.price)}
                </span>
              </span>
              <Icon name="arrow-right" size={18} className={styles.arrow} />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
