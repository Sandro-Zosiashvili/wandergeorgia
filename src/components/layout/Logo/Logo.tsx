import Link from 'next/link';
import { site } from '@/config/site';
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
        <svg viewBox="0 0 48 48" width="100%" height="100%">
          <defs>
            <linearGradient id="logoGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#e2c074" />
              <stop offset="1" stopColor="#a17c30" />
            </linearGradient>
          </defs>
          <circle cx="24" cy="24" r="22" fill="none" stroke="url(#logoGrad)" strokeWidth="1.5" />
          <path d="M12 32 L22 16 L28 26 L32 20 L38 32 Z" fill="url(#logoGrad)" />
          <circle cx="24" cy="12.5" r="2.4" fill="url(#logoGrad)" />
        </svg>
      </span>
      <span className={styles.word}>
        <span className={styles.wander}>Wander</span>
        <span className={styles.georgia}>Georgia</span>
      </span>
    </Link>
  );
}
