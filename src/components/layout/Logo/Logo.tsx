import Link from 'next/link';
import { site } from '@/config/site';
import WMark from './WMark';
import styles from './Logo.module.scss';

interface LogoProps {
  /** Shrinks the wordmark on compact bars. */
  compact?: boolean;
  onClick?: () => void;
}

/** Brand lockup: compass-peak mark + wordmark, links home. */
export default function Logo({ compact = false, onClick }: LogoProps) {
  return (
    <Link
      href="/"
      className={[styles.logo, compact ? styles.compact : ''].filter(Boolean).join(' ')}
      aria-label={`${site.name} — home`}
      onClick={onClick}
    >
      <span className={styles.mark} aria-hidden="true">
        <WMark className={styles.markSvg} />
      </span>
      <span className={styles.word}>
        <span className={styles.wander}>Wander</span>
        <span className={styles.georgia}>Georgia</span>
      </span>
    </Link>
  );
}
