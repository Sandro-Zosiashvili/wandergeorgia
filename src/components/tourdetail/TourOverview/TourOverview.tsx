import type { Tour } from '@/types/tour';
import Icon from '@/components/ui/Icon/Icon';
import styles from './TourOverview.module.scss';

interface TourOverviewProps {
  tour: Tour;
}

/** Intro paragraph + key highlights describing the tour and its place. */
export default function TourOverview({ tour }: TourOverviewProps) {
  const highlights = tour.highlights ?? [];

  return (
    <section className={styles.overview} aria-labelledby="overview-title">
      <span className={styles.eyebrow}>
        <span className={styles.mark} aria-hidden="true" />
        Overview
      </span>
      <h2 id="overview-title" className={styles.heading}>
        About this {tour.type === 'multi-day' ? 'journey' : 'day'}
      </h2>
      <p className={styles.lead}>{tour.overview ?? tour.shortDescription}</p>

      {highlights.length > 0 ? (
        <ul className={styles.highlights} aria-label="Tour highlights">
          {highlights.map((h) => (
            <li key={h} className={styles.highlight}>
              <Icon name="check" size={18} className={styles.highlightIcon} />
              <span>{h}</span>
            </li>
          ))}
        </ul>
      ) : null}

      <p className={styles.body}>
        Every departure is fully private — just your party, a dedicated guide and
        a comfortable vehicle. We handle the details so you can be fully present:
        pacing to your energy, stopping where the light is good, and always
        leaving room for the unplanned discoveries that make a trip memorable.
      </p>
    </section>
  );
}
