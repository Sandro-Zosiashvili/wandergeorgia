import { reviews } from '@/data/reviews';
import Container from '@/components/ui/Container/Container';
import SectionHeading from '@/components/ui/SectionHeading/SectionHeading';
import Reveal from '@/components/ui/Reveal/Reveal';
import ReviewCard from '../ReviewCard/ReviewCard';
import styles from './Reviews.module.scss';

/** Testimonials section — a masonry-style column layout of guest reviews. */
export default function Reviews() {
  return (
    <section className={styles.section} aria-labelledby="reviews-title">
      <Container>
        <SectionHeading
          eyebrow="Guest stories"
          align="center"
          title={
            <span id="reviews-title">
              Loved by travelers <em>worldwide</em>
            </span>
          }
          description="A few words from guests who explored Georgia with us. We're proud of every one."
        />

        <div className={styles.masonry}>
          {reviews.map((review, i) => (
            <Reveal key={review.author} from="up" delay={(i % 3) * 0.08} className={styles.cell}>
              <ReviewCard review={review} />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
