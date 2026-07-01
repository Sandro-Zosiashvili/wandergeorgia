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

/** Up to three other tours to explore next. */
export default function RelatedTours({ current }: RelatedToursProps) {
  // Prefer same type, then fill from anything else.
  const sameType = allTours.filter((t) => t.slug !== current.slug && t.type === current.type);
  const others = allTours.filter((t) => t.slug !== current.slug && t.type !== current.type);
  const related = [...sameType, ...others].slice(0, 3);

  if (related.length === 0) return null;

  return (
    <section className={styles.section} aria-labelledby="related-title">
      <Container>
        <SectionHeading
          eyebrow="Keep exploring"
          title={<span id="related-title">More journeys</span>}
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
