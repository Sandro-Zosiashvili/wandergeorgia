import type { Review } from '@/data/reviews';
import Icon from '@/components/ui/Icon/Icon';
import GoogleG from '../GoogleG/GoogleG';
import styles from './ReviewCard.module.scss';

interface ReviewCardProps {
  review: Review;
}

/** Google-style avatar colours for guests without a photo. */
const AVATAR_COLORS = ['#1a73e8', '#34a853', '#ea4335', '#9334e6', '#e8710a', '#12b5cb'];

function avatarColor(name: string): string {
  let sum = 0;
  for (let i = 0; i < name.length; i += 1) sum += name.charCodeAt(i);
  return AVATAR_COLORS[sum % AVATAR_COLORS.length]!;
}

/** A single guest review, styled like a Google review card. */
export default function ReviewCard({ review }: ReviewCardProps) {
  return (
    <article className={styles.card}>
      <header className={styles.head}>
        <span
          className={styles.avatar}
          style={{ backgroundColor: avatarColor(review.author) }}
          aria-hidden="true"
        >
          {review.author.charAt(0)}
        </span>
        <div className={styles.who}>
          <span className={styles.author}>{review.author}</span>
          <span className={styles.sub}>
            {review.country}
            {review.date ? ` · ${review.date}` : ''}
          </span>
        </div>
        <GoogleG size={22} className={styles.g} />
      </header>

      <div className={styles.stars} aria-label={`${review.rating} out of 5 stars`}>
        {Array.from({ length: review.rating }).map((_, i) => (
          <Icon key={i} name="star" size={17} />
        ))}
      </div>

      <p className={styles.quote}>{review.quote}</p>

      <span className={styles.tour}>{review.tour}</span>
    </article>
  );
}
