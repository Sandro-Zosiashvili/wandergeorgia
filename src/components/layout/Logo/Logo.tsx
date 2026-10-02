import Link from 'next/link';
import { site } from '@/config/site';
import styles from './Logo.module.scss';

/** Brand mark asset — the "W" landscape logo in /public. */
const MARK_SRC = '/assets/icons/W-icon.svg';

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
        {/* Plain <img>: the SVG embeds a raster, so there's nothing for
            next/image to optimise, and this needs no next.config SVG flag. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={MARK_SRC} alt="" className={styles.markSvg} />
      </span>
      <span className={styles.word}>
        <span className={styles.wander}>Wander</span>
        <span className={styles.kartli}>Kartli</span>
      </span>
    </Link>
  );
}
