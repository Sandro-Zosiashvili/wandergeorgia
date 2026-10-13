import { getReviews } from '@/data/reviews';
import type { Locale } from '@/lib/locale';
import Container from '@/components/ui/Container/Container';
import Reveal from '@/components/ui/Reveal/Reveal';
import Icon from '@/components/ui/Icon/Icon';
import ReviewCard from '../ReviewCard/ReviewCard';
import GoogleG from '../GoogleG/GoogleG';
import { ui, tpl } from '@/lib/uiStrings';
import { emphasize } from '@/lib/emphasize';
import styles from './Reviews.module.scss';

/** Guest reviews — presented in a clean, Google-style card layout. */
export default function Reviews({ lang }: { lang: Locale }) {
  const t = ui(lang).home.reviews;
  const reviews = getReviews(lang);
  const rating = 5.0;
  const count = '500+';

  return (
    <section className={styles.section} aria-labelledby="reviews-title">
      <Container>
        <div className={styles.header}>
          <span className={styles.eyebrow}>{t.eyebrow}</span>
          <h2 id="reviews-title" className={styles.title}>
            {emphasize(t.title)}
          </h2>

          {/* Google rating summary */}
          <div className={styles.summary}>
            <GoogleG size={40} className={styles.summaryG} />
            <div className={styles.summaryText}>
              <div className={styles.summaryTop}>
                <span className={styles.score}>{rating.toFixed(1)}</span>
                <span className={styles.summaryStars} aria-label={tpl(t.outOf, { rating })}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Icon key={i} name="star" size={18} />
                  ))}
                </span>
              </div>
              <span className={styles.summaryMeta}>{tpl(t.googleRating, { count })}</span>
            </div>
          </div>

          {/* Google-style verified badge + authenticity note */}
          <span className={styles.verifiedChip}>
            <span className={styles.check}>
              <Icon name="check" size={12} />
            </span>
            {t.verified}
          </span>
          <p className={styles.certified}>{t.certified}</p>
        </div>

        <div className={styles.masonry}>
          {reviews.map((review, i) => (
            <Reveal key={review.author} from="up" delay={(i % 3) * 0.08} className={styles.cell}>
              <ReviewCard review={review} lang={lang} />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
