import type { HeroSlide } from '@/lib/publicHeroApi';
import HeroSlideshow from '../HeroSlideshow/HeroSlideshow';
import HeroContent from '../HeroContent/HeroContent';
import styles from './Hero.module.scss';

export default function Hero({ slides }: { slides: HeroSlide[] }) {
  return (
    <section className={styles.hero} aria-label="Introduction">
      <HeroSlideshow slides={slides} />
      <div className={styles.inner}>
        <HeroContent />
      </div>
    </section>
  );
}
