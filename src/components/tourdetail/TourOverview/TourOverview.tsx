import type { Tour } from '@/types/tour';
import type { Locale } from '@/lib/locale';
import { ui } from '@/lib/uiStrings';
import Icon from '@/components/ui/Icon/Icon';
import styles from './TourOverview.module.scss';

interface TourOverviewProps {
  tour: Tour;
  lang: Locale;
}

/** Intro paragraph + key highlights describing the tour and its place. */
export default function TourOverview({ tour, lang }: TourOverviewProps) {
  const t = ui(lang).tourDetail;
  const highlights = tour.highlights ?? [];

  return (
    <section className={styles.overview} aria-labelledby="overview-title">
      <span className={styles.eyebrow}>
        <span className={styles.mark} aria-hidden="true" />
        {t.overviewEyebrow}
      </span>
      <h2 id="overview-title" className={styles.heading}>
        {tour.type === 'multi-day' ? t.aboutJourney : t.aboutDay}
      </h2>
      <p className={styles.lead}>{tour.overview ?? tour.shortDescription}</p>

      {highlights.length > 0 ? (
        <ul className={styles.highlights} aria-label={t.highlightsAria}>
          {highlights.map((h) => (
            <li key={h} className={styles.highlight}>
              <Icon name="check" size={18} className={styles.highlightIcon} />
              <span>{h}</span>
            </li>
          ))}
        </ul>
      ) : null}

      <p className={styles.body}>{t.overviewBody}</p>
    </section>
  );
}
