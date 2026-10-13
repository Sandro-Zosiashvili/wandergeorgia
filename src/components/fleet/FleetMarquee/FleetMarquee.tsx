import Image from 'next/image';
import { fleetCars } from '@/data/fleet';
import type { Locale } from '@/lib/locale';
import Container from '@/components/ui/Container/Container';
import SectionHeading from '@/components/ui/SectionHeading/SectionHeading';
import { ui } from '@/lib/uiStrings';
import { emphasize } from '@/lib/emphasize';
import styles from './FleetMarquee.module.scss';

// Doubled so the strip can loop seamlessly: translating the track exactly
// -50% lines the second copy up perfectly with where the first one started.
const track = [...fleetCars, ...fleetCars];

/** Endless, non-stop left-scrolling showcase of the vehicles used on tours. */
export default function FleetMarquee({ lang }: { lang: Locale }) {
  const t = ui(lang).home.fleet;
  return (
    <section id="fleet" className={styles.section} aria-labelledby="fleet-title">
      <Container>
        <SectionHeading
          eyebrow={t.eyebrow}
          title={<span id="fleet-title">{emphasize(t.title)}</span>}
          description={t.description}
        />
      </Container>

      {/* Purely atmospheric — the same 8 photos repeat, so it's hidden from
          assistive tech rather than read out twice with no unique content. */}
      <div className={styles.marquee} aria-hidden="true">
        <div className={styles.track}>
          {track.map((car, i) => (
            <div className={styles.card} key={`${car.id}-${i}`}>
              <Image
                src={car.image}
                alt=""
                fill
                sizes="340px"
                className={styles.image}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
