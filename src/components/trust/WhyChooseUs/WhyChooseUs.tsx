import type { Locale } from '@/lib/locale';
import type { IconName } from '@/components/ui/Icon/Icon';
import Container from '@/components/ui/Container/Container';
import SectionHeading from '@/components/ui/SectionHeading/SectionHeading';
import Reveal from '@/components/ui/Reveal/Reveal';
import TrustCard from '../TrustCard/TrustCard';
import StatsStrip from '../StatsStrip/StatsStrip';
import { ui } from '@/lib/uiStrings';
import { emphasize } from '@/lib/emphasize';
import styles from './WhyChooseUs.module.scss';

/** "Why Choose Us" trust section: reason cards + a headline stats strip. */
export default function WhyChooseUs({ lang }: { lang: Locale }) {
  const t = ui(lang).home.why;
  return (
    <section id="why-us" className={styles.section} aria-labelledby="why-us-title">
      <Container>
        <SectionHeading
          eyebrow={t.eyebrow}
          title={<span id="why-us-title">{emphasize(t.title)}</span>}
          description={t.description}
        />

        <div className={styles.grid}>
          {t.items.map((item, i) => (
            <Reveal key={item.title} from="up" delay={i * 0.07}>
              <TrustCard item={{ icon: item.icon as IconName, title: item.title, description: item.description }} />
            </Reveal>
          ))}
        </div>

        <StatsStrip lang={lang} />
      </Container>
    </section>
  );
}
