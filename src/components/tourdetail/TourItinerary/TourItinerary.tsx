import type { Tour } from '@/types/tour';
import Reveal from '@/components/ui/Reveal/Reveal';
import styles from './TourItinerary.module.scss';

interface TourItineraryProps {
  tour: Tour;
}

/** "What you'll see" — a numbered vertical timeline of the tour's stops. */
export default function TourItinerary({ tour }: TourItineraryProps) {
  const isMultiDay = tour.type === 'multi-day';

  return (
    <section className={styles.section} aria-labelledby="itinerary-title">
      <span className={styles.eyebrow}>
        <span className={styles.mark} aria-hidden="true" />
        {isMultiDay ? 'Day by day' : "What you'll see"}
      </span>
      <h2 id="itinerary-title" className={styles.heading}>
        {isMultiDay ? 'Your itinerary' : 'Highlights of the day'}
      </h2>

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
    </section>
  );
}
