'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { Tour } from '@/types/tour';
import type { BookingData } from '@/hooks/useBooking';
import { type PriceBreakdown, getVehicle } from '@/lib/pricing';
import { formatUSD } from '@/lib/format';
import { plural } from '@/lib/plural';
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll';
import { useLocale } from '@/hooks/useLocale';
import { ui } from '@/lib/uiStrings';
import Button from '@/components/ui/Button/Button';
import Icon from '@/components/ui/Icon/Icon';
import styles from './MobileSummaryBar.module.scss';

interface MobileSummaryBarProps {
  tour: Tour;
  data: BookingData;
  total: number;
  breakdown: PriceBreakdown;
  /** Advance to the next step (runs the step's validation first). */
  onContinue: () => void;
}

const EASE = [0.22, 1, 0.36, 1] as const;

// Applied inline so the CSS minifier can't strip the standard property and
// leave only the -webkit- form (which modern Android Chrome doesn't support).
const BAR_BLUR = {
  backdropFilter: 'blur(20px) saturate(160%)',
  WebkitBackdropFilter: 'blur(20px) saturate(160%)',
} as const;
const BACKDROP_BLUR = {
  backdropFilter: 'blur(2px)',
  WebkitBackdropFilter: 'blur(2px)',
} as const;

/**
 * Mobile-only sticky summary. Keeps the live grand total (and the Continue
 * action) pinned to the bottom of the viewport so it's always visible while the
 * traveler scrolls through group size and vehicle options. Tapping it opens a
 * bottom sheet with the full price breakdown. Hidden at `lg`+, where the side
 * OrderSummary card takes over.
 */
export default function MobileSummaryBar({
  tour,
  data,
  total,
  breakdown,
  onContinue,
}: MobileSummaryBarProps) {
  const [open, setOpen] = useState(false);
  useLockBodyScroll(open);

  const locale = useLocale();
  const b = ui(locale).booking;
  const s = b.summary;
  const vehicle = getVehicle(breakdown.vehicle);
  const { days, baseRatePerDay, upgradePerDay, isFixed } = breakdown;
  const perDay = tour.type === 'multi-day' || days > 1 ? ` ${b.vehicle.perDay}` : '';

  const handleContinue = () => {
    setOpen(false);
    onContinue();
  };

  const AnimatedTotal = (
    <span className={styles.totalValueWrap} aria-live="polite">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={total}
          className={styles.totalValue}
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -10, opacity: 0 }}
          transition={{ duration: 0.28, ease: EASE }}
        >
          {formatUSD(total)}
        </motion.span>
      </AnimatePresence>
    </span>
  );

  return (
    <>
      <AnimatePresence>
        {open ? (
          <>
            <motion.div
              className={styles.backdrop}
              style={BACKDROP_BLUR}
              onClick={() => setOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              aria-hidden="true"
            />
            <motion.div
              className={styles.sheet}
              role="dialog"
              aria-label={s.ariaBreakdown}
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ duration: 0.34, ease: EASE }}
            >
              <span className={styles.grabber} aria-hidden="true" />

              <div className={styles.sheetHead}>
                <h3 className={styles.sheetTitle}>{tour.title}</h3>
                <button
                  type="button"
                  className={styles.close}
                  onClick={() => setOpen(false)}
                  aria-label={s.closeBreakdown}
                >
                  <Icon name="close" size={18} />
                </button>
              </div>

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
                        {perDay}
                      </dd>
                    </div>
                    <div className={styles.line}>
                      <dt>{s.vehicleUpgrade}</dt>
                      <dd className={upgradePerDay > 0 ? undefined : styles.free}>
                        {upgradePerDay > 0
                          ? `+${formatUSD(upgradePerDay)}${perDay}`
                          : s.included}
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
                <div className={styles.line}>
                  <dt className={styles.included}>
                    <Icon name="check" size={14} /> {s.airportTransfers}
                  </dt>
                  <dd className={styles.free}>{s.included}</dd>
                </div>
              </dl>

              <div className={styles.sheetFoot}>
                <div className={styles.sheetTotal}>
                  <span>{s.grandTotal}</span>
                  <span className={styles.sheetTotalValue}>{formatUSD(total)}</span>
                </div>
                <Button onClick={handleContinue} icon="arrow-right" fullWidth size="lg">
                  {b.nav.continue}
                </Button>
              </div>
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>

      <div className={styles.bar} style={BAR_BLUR}>
        <button
          type="button"
          className={styles.toggle}
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-label={s.viewBreakdown}
        >
          <span className={styles.toggleHead}>
            {s.grandTotal}
            <Icon
              name="chevron-down"
              size={14}
              className={open ? styles.chevronUp : styles.chevron}
            />
          </span>
          {AnimatedTotal}
        </button>

        <Button onClick={onContinue} icon="arrow-right" className={styles.continue}>
          {b.nav.continue}
        </Button>
      </div>
    </>
  );
}
