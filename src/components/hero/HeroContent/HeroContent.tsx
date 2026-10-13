'use client';

import Reveal from '@/components/ui/Reveal/Reveal';
import Button from '@/components/ui/Button/Button';
import Icon from '@/components/ui/Icon/Icon';
import { useLocale } from '@/hooks/useLocale';
import { ui } from '@/lib/uiStrings';
import { emphasize } from '@/lib/emphasize';
import styles from './HeroContent.module.scss';

/** Hero headline, subhead and calls-to-action with a staggered entrance. */
export default function HeroContent() {
  const t = ui(useLocale()).home.hero;
  return (
    <div className={styles.content}>
      <Reveal from="up" distance={18}>
        <span className={styles.eyebrow}>
          <Icon name="sparkle" size={15} />
          {t.eyebrow}
        </span>
      </Reveal>

      <Reveal from="up" delay={0.1}>
        <h1 className={styles.title}>{emphasize(t.title)}</h1>
      </Reveal>

      <Reveal from="up" delay={0.2}>
        <p className={styles.subhead}>{t.subhead}</p>
      </Reveal>

      <Reveal from="up" delay={0.3}>
        <div className={styles.actions}>
          <Button href="/#day-tours" size="lg" icon="arrow-right">
            {t.exploreTours}
          </Button>
          {/* Same link, two weights — a full outline pill reads as a second
              equally-important choice on phones, adding real height to an
              already tall stack. A quieter ghost link keeps it reachable
              without competing with the primary CTA. Desktop is untouched. */}
          <Button
            href="/#packages"
            size="lg"
            variant="outline"
            className={styles.packagesDesktop}
          >
            {t.multiDayPackages}
          </Button>
          <Button
            href="/#packages"
            size="sm"
            variant="ghost"
            icon="arrow-right"
            className={styles.packagesMobile}
          >
            {t.multiDayPackages}
          </Button>
        </div>
      </Reveal>

      <Reveal from="up" delay={0.4}>
        <ul className={styles.trust}>
          <li className={styles.trustItem}>
            <span className={styles.stars} aria-hidden="true">
              {Array.from({ length: 5 }).map((_, i) => (
                <Icon key={i} name="star" size={15} />
              ))}
            </span>
            <span>{t.trustReviews}</span>
          </li>
          <li className={styles.trustItem}>
            <Icon name="plane-arrival" size={18} />
            <span>{t.trustTransfers}</span>
          </li>
          <li className={styles.trustItem}>
            <Icon name="guide" size={18} />
            <span>{t.trustGuides}</span>
          </li>
        </ul>
      </Reveal>
    </div>
  );
}
