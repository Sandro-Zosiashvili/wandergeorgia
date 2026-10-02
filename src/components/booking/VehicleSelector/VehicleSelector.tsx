'use client';

import type { Tour } from '@/types/tour';
import {
  type VehicleId,
  VEHICLES,
  MAX_PRIVATE_PAX,
  computeBreakdown,
  getFixedPackage,
  getTourDays,
} from '@/lib/pricing';
import { formatUSD } from '@/lib/format';
import { whatsappLink } from '@/config/site';
import Icon from '@/components/ui/Icon/Icon';
import Button from '@/components/ui/Button/Button';
import styles from './VehicleSelector.module.scss';

interface VehicleSelectorProps {
  tour: Tour;
  /** Current passenger count. */
  pax: number;
  /** Selected vehicle id. */
  value: VehicleId;
  onChange: (vehicle: VehicleId) => void;
  error?: string;
}

/**
 * Vehicle-class picker for the booking flow. Shows the four classes as cards,
 * disables any that can't seat the group, surfaces the per-day upgrade (and the
 * multi-day total), and shows a "contact us" notice when the group is too large
 * to price online.
 */
export default function VehicleSelector({
  tour,
  pax,
  value,
  onChange,
  error,
}: VehicleSelectorProps) {
  const fixed = getFixedPackage(tour);
  const days = getTourDays(tour);
  const isMultiDay = days > 1;
  const tooMany = pax > MAX_PRIVATE_PAX;

  return (
    <div className={styles.wrap}>
      <div className={styles.head}>
        <span className={styles.label}>Choose your vehicle</span>
        <span className={styles.sub}>
          {fixed
            ? 'This package is offered with a 4x4 Jeep.'
            : isMultiDay
              ? `Upgrade prices shown per day · ${days} days`
              : 'One private vehicle for your group'}
        </span>
      </div>

      <div className={styles.grid} role="radiogroup" aria-label="Vehicle class">
        {VEHICLES.map((v) => {
          const bd = computeBreakdown(tour, v.id);
          const disabled =
            tooMany || pax > v.capacity || (fixed !== null && v.id !== fixed.vehicle);
          const selected = value === v.id && !disabled;

          const unavailable = fixed !== null && v.id !== fixed.vehicle;
          const priceLabel = fixed
            ? v.id === fixed.vehicle
              ? `${formatUSD(fixed.total)} package`
              : 'Not available'
            : v.id === 'sedan'
              ? 'Included'
              : `+${formatUSD(bd.upgradePerDay)}${isMultiDay ? ' / day' : ''}`;

          const priceClass = unavailable
            ? styles.unavailable
            : v.id === 'sedan' && !fixed
              ? styles.included
              : styles.price;

          const totalUpgrade = bd.upgradePerDay * days;
          const showSubtotal = !fixed && isMultiDay && bd.upgradePerDay > 0;

          return (
            <button
              key={v.id}
              type="button"
              role="radio"
              aria-checked={selected}
              aria-disabled={disabled}
              disabled={disabled}
              className={[styles.card, selected ? styles.selected : '']
                .filter(Boolean)
                .join(' ')}
              onClick={() => !disabled && onChange(v.id)}
            >
              <span className={styles.cardTop}>
                <span className={styles.icon} aria-hidden="true">
                  <Icon name={v.icon} size={26} />
                </span>
                {v.premium ? <span className={styles.premium}>Premium</span> : null}
                <span className={styles.check} aria-hidden="true">
                  <Icon name="check" size={14} />
                </span>
              </span>

              <span className={styles.name}>{v.label}</span>
              <span className={styles.capacity}>
                <Icon name="users" size={13} />
                1–{v.capacity} passengers
              </span>

              <span className={styles.priceRow}>
                <span className={priceClass}>{priceLabel}</span>
                {showSubtotal ? (
                  <span className={styles.subtotal}>{formatUSD(totalUpgrade)} total</span>
                ) : null}
              </span>
            </button>
          );
        })}
      </div>

      {error && !tooMany ? (
        <p className={styles.error} role="alert">
          <Icon name="shield" size={15} />
          {error}
        </p>
      ) : null}

      {tooMany ? (
        <div className={styles.notice} role="status">
          <Icon name="users" size={18} />
          <div>
            <strong>Traveling with more than {MAX_PRIVATE_PAX}?</strong>
            <p>
              For larger groups we arrange extra vehicles or a coach. Message us and
              we&apos;ll tailor it to your party.
            </p>
            <Button
              href={whatsappLink(
                `Hi WanderKartli, we're a group of ${pax} for the "${tour.title}" tour.`,
              )}
              external
              variant="outline"
              size="sm"
              icon="whatsapp"
              iconLeading
            >
              Contact us
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
