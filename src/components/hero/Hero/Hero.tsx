import HeroSlideshow from '../HeroSlideshow/HeroSlideshow';
import HeroContent from '../HeroContent/HeroContent';
import HeroScrollCue from '../HeroScrollCue/HeroScrollCue';
import styles from './Hero.module.scss';

/** Full-screen hero: cross-fading slideshow behind the headline and CTAs. */
export default function Hero() {
  return (
    <section className={styles.hero} aria-label="Introduction">
      <HeroSlideshow />
      <div className={styles.inner}>
        <HeroContent />
      </div>
      <HeroScrollCue />
    </section>
  );
}
