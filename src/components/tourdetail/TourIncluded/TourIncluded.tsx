import type { Tour } from '@/types/tour';
import Icon, { type IconName } from '@/components/ui/Icon/Icon';
import { isIconName } from '@/components/ui/Icon/icons';
import styles from './TourIncluded.module.scss';

interface TourIncludedProps {
  tour: Tour;
}

const AIRPORT_ICONS = new Set(['plane-arrival', 'plane-departure']);

/** "Included" grid — airport transfers are visually emphasised. */
export default function TourIncluded({ tour }: TourIncludedProps) {
  return (
    <section className={styles.section} aria-labelledby="included-title">
      <span className={styles.eyebrow}>
        <span className={styles.mark} aria-hidden="true" />
        Included
      </span>
      <h2 id="included-title" className={styles.heading}>
        What&apos;s in the price
      </h2>

      <ul className={styles.grid}>
        {tour.included.map((inc) => {
          const iconName: IconName = isIconName(inc.icon) ? inc.icon : 'check';
          const isAirport = AIRPORT_ICONS.has(inc.icon);
          return (
            <li
              key={inc.label}
              className={[styles.item, isAirport ? styles.airport : ''].filter(Boolean).join(' ')}
            >
              <span className={styles.itemIcon}>
                <Icon name={iconName} size={20} />
              </span>
              <span className={styles.itemLabel}>{inc.label}</span>
              {isAirport ? <span className={styles.tag}>Always included</span> : null}
            </li>
          );
        })}
      </ul>

      {tour.notIncluded && tour.notIncluded.length > 0 ? (
        <ul className={styles.notIncluded}>
          {tour.notIncluded.map((label) => (
            <li key={label} className={styles.notItem}>
              <span className={styles.notIcon}>
                <Icon name="close" size={16} />
              </span>
              <span className={styles.itemLabel}>{label}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
