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
import { plural } from '@/lib/plural';
import { whatsappLink } from '@/config/site';
import { useLocale } from '@/hooks/useLocale';
import { ui, tpl } from '@/lib/uiStrings';
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
  const locale = useLocale();
  const t = ui(locale).booking;
  const v0 = t.vehicle;
  const fixed = getFixedPackage(tour);
  const days = getTourDays(tour);
  const isMultiDay = days > 1;
  const tooMany = pax > MAX_PRIVATE_PAX;

  return (
    <div className={styles.wrap}>
      <div className={styles.head}>
        <span className={styles.label}>{v0.choose}</span>
        <span className={styles.sub}>
          {fixed
            ? v0.subFixed
            : isMultiDay
              ? `${v0.subPerDay} · ${days} ${plural(locale, days, t.units.day)}`
              : v0.subSingle}
        </span>
      </div>

      <div className={styles.grid} role="radiogroup" aria-label={v0.ariaGroup}>
        {VEHICLES.map((v) => {
          const bd = computeBreakdown(tour, v.id);
          const disabled =
            tooMany || pax > v.capacity || (fixed !== null && v.id !== fixed.vehicle);
          const selected = value === v.id && !disabled;

          const unavailable = fixed !== null && v.id !== fixed.vehicle;
          const priceLabel = fixed
            ? v.id === fixed.vehicle
              ? tpl(v0.packageLabel, { price: formatUSD(fixed.total) })
              : v0.notAvailable
            : v.id === 'sedan'
              ? v0.included
              : `+${formatUSD(bd.upgradePerDay)}${isMultiDay ? ' ' + v0.perDay : ''}`;

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
                {v.premium ? <span className={styles.premium}>{v0.premium}</span> : null}
                <span className={styles.check} aria-hidden="true">
                  <Icon name="check" size={14} />
                </span>
              </span>

              <span className={styles.name}>{t.vehicleNames[v.id]}</span>
              <span className={styles.capacity}>
                <Icon name="users" size={13} />
                {tpl(v0.passengers, { cap: v.capacity })}
              </span>

              <span className={styles.priceRow}>
                <span className={priceClass}>{priceLabel}</span>
                {showSubtotal ? (
                  <span className={styles.subtotal}>
                    {tpl(v0.totalLabel, { price: formatUSD(totalUpgrade) })}
                  </span>
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
            <strong>{tpl(v0.tooManyTitle, { max: MAX_PRIVATE_PAX })}</strong>
            <p>{v0.tooManyText}</p>
            <Button
              href={whatsappLink(tpl(v0.whatsappMessage, { pax, tour: tour.title }))}
              external
              variant="outline"
              size="sm"
              icon="whatsapp"
              iconLeading
            >
              {v0.contactUs}
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
