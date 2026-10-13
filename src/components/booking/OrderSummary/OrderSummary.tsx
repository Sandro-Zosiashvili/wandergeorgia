'use client';

import Image from 'next/image';
import type { Tour } from '@/types/tour';
import type { BookingData } from '@/hooks/useBooking';
import { type PriceBreakdown, getVehicle } from '@/lib/pricing';
import { formatUSD, formatDate } from '@/lib/format';
import { plural } from '@/lib/plural';
import { useLocale } from '@/hooks/useLocale';
import { ui, tpl } from '@/lib/uiStrings';
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
  const locale = useLocale();
  const b = ui(locale).booking;
  const s = b.summary;
  const isMultiDay = tour.type === 'multi-day';
  const vehicle = getVehicle(breakdown.vehicle);
  const { days, baseRatePerDay, upgradePerDay, isFixed } = breakdown;
  const perDayLabel = isMultiDay || days > 1 ? ` ${b.vehicle.perDay}` : '';

  return (
    <aside className={styles.summary} aria-label={s.ariaPrice}>
      <div className={styles.media}>
        <Image src={tour.cardImage} alt={tour.title} fill sizes="360px" className={styles.image} />
        <div className={styles.mediaScrim} aria-hidden="true" />
        <span className={styles.tag}>
          {isMultiDay ? tpl(s.dayPackageTag, { days: tour.days ?? days }) : s.dayTourTag}
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
              <Icon name={vehicle.icon} size={15} /> {s.vehicle}
            </dt>
            <dd>{b.vehicleNames[breakdown.vehicle]}</dd>
          </div>
          <div className={styles.line}>
            <dt>{s.travelers}</dt>
            <dd>{data.travelers}</dd>
          </div>

          {isFixed ? (
            <div className={styles.line}>
              <dt>{s.packagePrice}</dt>
              <dd>{formatUSD(baseRatePerDay)}</dd>
            </div>
          ) : (
            <>
              <div className={styles.line}>
                <dt>{s.basePrice}</dt>
                <dd>
                  {formatUSD(baseRatePerDay)}
                  {perDayLabel}
                </dd>
              </div>
              <div className={styles.line}>
                <dt>{s.vehicleUpgrade}</dt>
                <dd className={upgradePerDay > 0 ? undefined : styles.free}>
                  {upgradePerDay > 0 ? `+${formatUSD(upgradePerDay)}${perDayLabel}` : s.included}
                </dd>
              </div>
            </>
          )}

          <div className={styles.line}>
            <dt>{s.duration}</dt>
            <dd>
              {days} {plural(locale, days, b.units.day)}
            </dd>
          </div>

          {data.arrivalDate ? (
            <div className={styles.line}>
              <dt>{s.arrival}</dt>
              <dd>{formatDate(data.arrivalDate, locale)}</dd>
            </div>
          ) : null}

          <div className={styles.line}>
            <dt className={styles.included}>
              <Icon name="check" size={14} /> {s.airportTransfers}
            </dt>
            <dd className={styles.free}>{s.included}</dd>
          </div>
        </dl>

        <div className={styles.totalRow}>
          <span>{s.grandTotal}</span>
          <span className={styles.total}>{formatUSD(total)}</span>
        </div>
        <p className={styles.fine}>{s.fine}</p>
      </div>
    </aside>
  );
}
