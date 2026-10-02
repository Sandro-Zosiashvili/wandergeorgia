'use client';

import Image from 'next/image';
import type { Tour } from '@/types/tour';
import type { BookingData } from '@/hooks/useBooking';
import { type PriceBreakdown, getVehicle } from '@/lib/pricing';
import { formatUSD, formatDate } from '@/lib/format';
import Icon from '@/components/ui/Icon/Icon';
import styles from './OrderSummary.module.scss';

interface OrderSummaryProps {
  tour: Tour;
  data: BookingData;
  total: number;
  breakdown: PriceBreakdown;
}

/** Sticky, live price breakdown shown beside the booking steps. */
export default function OrderSummary({ tour, data, total, breakdown }: OrderSummaryProps) {
  const isMultiDay = tour.type === 'multi-day';
  const vehicle = getVehicle(breakdown.vehicle);
  const { days, baseRatePerDay, upgradePerDay, isFixed } = breakdown;
  const perDayLabel = isMultiDay || days > 1 ? ' / day' : '';

  return (
    <aside className={styles.summary} aria-label="Price summary">
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
            <dt>
              <Icon name={vehicle.icon} size={15} /> Vehicle
            </dt>
            <dd>{vehicle.label}</dd>
          </div>
          <div className={styles.line}>
            <dt>Travelers</dt>
            <dd>{data.travelers}</dd>
          </div>

          {isFixed ? (
            <div className={styles.line}>
              <dt>Package price</dt>
              <dd>{formatUSD(baseRatePerDay)}</dd>
            </div>
          ) : (
            <>
              <div className={styles.line}>
                <dt>Base price</dt>
                <dd>
                  {formatUSD(baseRatePerDay)}
                  {perDayLabel}
                </dd>
              </div>
              <div className={styles.line}>
                <dt>Vehicle upgrade</dt>
                <dd className={upgradePerDay > 0 ? undefined : styles.free}>
                  {upgradePerDay > 0 ? `+${formatUSD(upgradePerDay)}${perDayLabel}` : 'Included'}
                </dd>
              </div>
            </>
          )}

          <div className={styles.line}>
            <dt>Duration</dt>
            <dd>
              {days} {days === 1 ? 'day' : 'days'}
            </dd>
          </div>

          {data.arrivalDate ? (
            <div className={styles.line}>
              <dt>Arrival</dt>
              <dd>{formatDate(data.arrivalDate)}</dd>
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
          <span>Grand total</span>
          <span className={styles.total}>{formatUSD(total)}</span>
        </div>
        <p className={styles.fine}>Private tour · all prices in USD</p>
      </div>
    </aside>
  );
}
