import type { Tour } from '@/types/tour';
import type { Locale } from '@/lib/locale';
import { loadTours } from '@/lib/publicToursApi';
import Container from '@/components/ui/Container/Container';
import SectionHeading from '@/components/ui/SectionHeading/SectionHeading';
import Reveal from '@/components/ui/Reveal/Reveal';
import TourCard from '@/components/tours/TourCard/TourCard';
import { ui } from '@/lib/uiStrings';
import { emphasize } from '@/lib/emphasize';
import styles from './RelatedTours.module.scss';

interface RelatedToursProps {
  current: Tour;
  lang: Locale;
}

/** All other tours of the same kind (day trips ↔ day trips, packages ↔ packages). */
export default async function RelatedTours({ current, lang }: RelatedToursProps) {
  const t = ui(lang).tourDetail;
  const all = await loadTours(lang);
  const related = all.filter((t) => t.slug !== current.slug && t.type === current.type);

  if (related.length === 0) return null;

  const isMultiDay = current.type === 'multi-day';

  return (
    <section className={styles.section} aria-labelledby="related-title">
      <Container>
        <SectionHeading
          eyebrow={t.keepExploring}
          title={
            <span id="related-title">
              {emphasize(isMultiDay ? t.moreMultiDay : t.moreOneDay)}
            </span>
          }
        />
        <div className={styles.grid}>
          {related.map((tour, i) => (
            <Reveal key={tour.slug} from="up" delay={i * 0.06}>
              <TourCard tour={tour} lang={lang} />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
