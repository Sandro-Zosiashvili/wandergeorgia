import type { Tour } from '@/types/tour';
import type { Locale } from '@/lib/locale';
import Container from '@/components/ui/Container/Container';
import SectionHeading from '@/components/ui/SectionHeading/SectionHeading';
import Reveal from '@/components/ui/Reveal/Reveal';
import MultiDayCard from '../MultiDayCard/MultiDayCard';
import { ui } from '@/lib/uiStrings';
import { emphasize } from '@/lib/emphasize';
import styles from './MultiDayTours.module.scss';

interface MultiDayToursProps {
  tours: Tour[];
  lang: Locale;
}

/** "Multi-Day Packages" home section — stacked, alternating editorial cards. */
export default function MultiDayTours({ tours, lang }: MultiDayToursProps) {
  const t = ui(lang).home.multiDay;
  return (
    <section id="packages" className={styles.section} aria-labelledby="packages-title">
      <Container>
        <SectionHeading
          eyebrow={t.eyebrow}
          align="center"
          title={<span id="packages-title">{emphasize(t.title)}</span>}
          description={t.description}
        />

        <div className={styles.stack}>
          {tours.map((tour, i) => (
            <Reveal key={tour.slug} from="up" delay={i * 0.05}>
              <MultiDayCard tour={tour} reversed={i % 2 === 1} lang={lang} />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
