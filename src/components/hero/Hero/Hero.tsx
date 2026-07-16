import HeroSlideshow from '../HeroSlideshow/HeroSlideshow';
import HeroContent from '../HeroContent/HeroContent';
import styles from './Hero.module.scss';

export default function Hero() {
  return (
    <section className={styles.hero} aria-label="Introduction">
      <HeroSlideshow />
      <div className={styles.inner}>
        <HeroContent />
      </div>
    </section>
  );
}
