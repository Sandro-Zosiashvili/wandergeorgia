import type { Tour } from '@/types/tour';
import { allTours } from '@/data/tours';
import Container from '@/components/ui/Container/Container';
import SectionHeading from '@/components/ui/SectionHeading/SectionHeading';
import Reveal from '@/components/ui/Reveal/Reveal';
import TourCard from '@/components/tours/TourCard/TourCard';
import styles from './RelatedTours.module.scss';

interface RelatedToursProps {
  current: Tour;
}

/** All other tours of the same kind (day trips ↔ day trips, packages ↔ packages). */
export default function RelatedTours({ current }: RelatedToursProps) {
  const related = allTours.filter((t) => t.slug !== current.slug && t.type === current.type);

  if (related.length === 0) return null;

  const isMultiDay = current.type === 'multi-day';

  return (
    <section className={styles.section} aria-labelledby="related-title">
      <Container>
        <SectionHeading
          eyebrow="Keep exploring"
          title={
            <span id="related-title">
              {isMultiDay ? (
                <>More multi-day <em>packages</em></>
              ) : (
                <>More one-day <em>tours</em></>
              )}
            </span>
          }
        />
        <div className={styles.grid}>
          {related.map((tour, i) => (
            <Reveal key={tour.slug} from="up" delay={i * 0.06}>
              <TourCard tour={tour} />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
