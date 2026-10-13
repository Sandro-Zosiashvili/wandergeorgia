import type { Locale } from '@/lib/locale';
import Reveal from '@/components/ui/Reveal/Reveal';
import { ui } from '@/lib/uiStrings';
import styles from './StatsStrip.module.scss';

/** Compact row of headline metrics beneath the trust cards. */
export default function StatsStrip({ lang }: { lang: Locale }) {
  const stats = ui(lang).home.why.stats;
  return (
    <ul className={styles.strip}>
      {stats.map((stat, i) => (
        <Reveal as="li" key={stat.label} from="up" delay={i * 0.06} className={styles.item}>
          <span className={styles.value}>{stat.value}</span>
          <span className={styles.label}>{stat.label}</span>
        </Reveal>
      ))}
    </ul>
  );
}
