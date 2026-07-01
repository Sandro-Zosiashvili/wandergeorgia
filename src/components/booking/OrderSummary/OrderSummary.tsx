'use client';

import Image from 'next/image';
import type { Tour } from '@/types/tour';
import type { BookingData } from '@/hooks/useBooking';
import { formatGEL, formatDate } from '@/lib/format';
import Icon from '@/components/ui/Icon/Icon';
import styles from './OrderSummary.module.scss';

interface OrderSummaryProps {
  tour: Tour;
  data: BookingData;
  total: number;
}

/** Sticky order summary shown beside the booking steps. */
export default function OrderSummary({ tour, data, total }: OrderSummaryProps) {
  const isMultiDay = tour.type === 'multi-day';
  const unitLabel = isMultiDay ? 'per person' : 'group price';

  return (
    <aside className={styles.summary} aria-label="Order summary">
      <div className={styles.media}>
        <Image src={tour.cardImage} alt={tour.title} fill sizes="360px" className={styles.image} />
        <div className={styles.mediaScrim} aria-hidden="true" />
        <span className={styles.tag}>
          {isMultiDay ? `${tour.days}-day package` : 'Day tour'}
        </span>
      </div>

      <div className={styles.body}>
        <h2 className={styles.title}>{tour.title}</h2>
        <p className={styles.place}>
          <Icon name="map-pin" size={15} />
          {tour.city}
        </p>

        <dl className={styles.lines}>
          <div className={styles.line}>
            <dt>{formatGEL(tour.price)} · {unitLabel}</dt>
            <dd>{isMultiDay ? `× ${data.travelers}` : formatGEL(tour.price)}</dd>
          </div>
          <div className={styles.line}>
            <dt>Travelers</dt>
            <dd>{data.travelers}</dd>
          </div>
          {data.arrivalDate ? (
            <div className={styles.line}>
              <dt>Arrival</dt>
              <dd>{formatDate(data.arrivalDate)}</dd>
            </div>
          ) : null}
          {data.departureDate ? (
            <div className={styles.line}>
              <dt>Departure</dt>
              <dd>{formatDate(data.departureDate)}</dd>
            </div>
          ) : null}
          <div className={styles.line}>
            <dt className={styles.included}>
              <Icon name="check" size={14} /> Airport transfers
            </dt>
            <dd className={styles.free}>Included</dd>
          </div>
        </dl>

        <div className={styles.totalRow}>
          <span>Total</span>
          <span className={styles.total}>{formatGEL(total)}</span>
        </div>
      </div>
    </aside>
  );
}
