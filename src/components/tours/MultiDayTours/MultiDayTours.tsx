import { multiDayTours } from '@/data/tours';
import Container from '@/components/ui/Container/Container';
import SectionHeading from '@/components/ui/SectionHeading/SectionHeading';
import Reveal from '@/components/ui/Reveal/Reveal';
import MultiDayCard from '../MultiDayCard/MultiDayCard';
import styles from './MultiDayTours.module.scss';

/** "Multi-Day Packages" home section — stacked, alternating editorial cards. */
export default function MultiDayTours() {
  return (
    <section id="packages" className={styles.section} aria-labelledby="packages-title">
      <Container>
        <SectionHeading
          eyebrow="Complete journeys"
          align="center"
          title={
            <span id="packages-title">
              Multi-day <em>packages</em>
            </span>
          }
          description="Longer, seamless itineraries that string the best of Georgia together — accommodation, guiding and every airport transfer handled end to end."
        />

        <div className={styles.stack}>
          {multiDayTours.map((tour, i) => (
            <Reveal key={tour.slug} from="up" delay={i * 0.05}>
              <MultiDayCard tour={tour} reversed={i % 2 === 1} />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
