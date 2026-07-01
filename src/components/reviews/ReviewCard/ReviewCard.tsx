import type { Review } from '@/data/reviews';
import Icon from '@/components/ui/Icon/Icon';
import styles from './ReviewCard.module.scss';

interface ReviewCardProps {
  review: Review;
}

/** A single testimonial with rating, quote and attribution. */
export default function ReviewCard({ review }: ReviewCardProps) {
  return (
    <figure className={styles.card}>
      <Icon name="quote" size={30} className={styles.quoteMark} />

      <div className={styles.stars} aria-label={`${review.rating} out of 5 stars`}>
        {Array.from({ length: review.rating }).map((_, i) => (
          <Icon key={i} name="star" size={16} />
        ))}
      </div>

      <blockquote className={styles.quote}>{review.quote}</blockquote>

      <figcaption className={styles.foot}>
        <span className={styles.avatar} aria-hidden="true">
          {review.author.charAt(0)}
        </span>
        <span className={styles.who}>
          <span className={styles.author}>{review.author}</span>
          <span className={styles.meta}>
            {review.country} · {review.tour}
          </span>
        </span>
      </figcaption>
    </figure>
  );
}
