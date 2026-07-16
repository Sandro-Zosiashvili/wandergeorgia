import type { Tour } from '@/types/tour';
import Reveal from '@/components/ui/Reveal/Reveal';
import styles from './TourItinerary.module.scss';

interface TourItineraryProps {
  tour: Tour;
}

/** "What you'll see" — a numbered vertical timeline of the tour's stops, or a
 *  day-by-day plan (with per-day highlights) when the tour has an itinerary. */
export default function TourItinerary({ tour }: TourItineraryProps) {
  const isMultiDay = tour.type === 'multi-day';
  const days = tour.itinerary ?? [];

  return (
    <section className={styles.section} aria-labelledby="itinerary-title">
      <span className={styles.eyebrow}>
        <span className={styles.mark} aria-hidden="true" />
        {isMultiDay ? 'Day by day' : "What you'll see"}
      </span>
      <h2 id="itinerary-title" className={styles.heading}>
        {isMultiDay ? 'Your itinerary' : 'Highlights of the day'}
      </h2>

      {days.length > 0 ? (
        <ol className={styles.timeline}>
          {days.map((day, i) => (
            <Reveal as="li" key={day.day} from="up" delay={i * 0.05} className={styles.step}>
              <span className={styles.index} aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className={styles.stepBody}>
                <span className={styles.dayLabel}>{day.day}</span>
                <h3 className={styles.stepTitle}>{day.title}</h3>
                {day.highlights.length > 0 ? (
                  <ul className={styles.chips}>
                    {day.highlights.map((h) => (
                      <li key={h} className={styles.chip}>
                        {h}
                      </li>
                    ))}
                  </ul>
                ) : null}
                <p className={styles.stepDesc}>{day.description}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      ) : (
        <ol className={styles.timeline}>
          {tour.locations.map((loc, i) => (
            <Reveal as="li" key={loc.name} from="up" delay={i * 0.05} className={styles.step}>
              <span className={styles.index} aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className={styles.stepBody}>
                <h3 className={styles.stepTitle}>{loc.name}</h3>
                <p className={styles.stepDesc}>{loc.description}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      )}
    </section>
  );
}
