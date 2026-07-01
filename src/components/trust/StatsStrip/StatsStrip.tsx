import { trustStats } from '@/data/whyChooseUs';
import Reveal from '@/components/ui/Reveal/Reveal';
import styles from './StatsStrip.module.scss';

/** Compact row of headline metrics beneath the trust cards. */
export default function StatsStrip() {
  return (
    <ul className={styles.strip}>
      {trustStats.map((stat, i) => (
        <Reveal as="li" key={stat.label} from="up" delay={i * 0.06} className={styles.item}>
          <span className={styles.value}>{stat.value}</span>
          <span className={styles.label}>{stat.label}</span>
        </Reveal>
      ))}
    </ul>
  );
}
