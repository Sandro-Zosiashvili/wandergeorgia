import Link from 'next/link';
import { site } from '@/config/site';
import styles from './Logo.module.scss';

// Brand mark asset. The source SVG wraps a 1024px raster in a tiny 30x23
// canvas, so it rasterises blurry on hi-DPI screens; a pre-rendered 240px PNG
// (transparent) stays crisp at the small size the logo is shown, on any DPR.
const MARK_SRC = '/assets/icons/W-icon.png';

interface LogoProps {
  onClick?: () => void;
}

/** Brand lockup: compass-peak mark + wordmark, links home. A single fixed size
 *  at all times (no scroll-driven scaling). */
export default function Logo({ onClick }: LogoProps) {
  return (
    <Link
      href="/"
      className={styles.logo}
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
