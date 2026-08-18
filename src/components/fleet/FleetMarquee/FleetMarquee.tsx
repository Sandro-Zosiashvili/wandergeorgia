import Image from 'next/image';
import { fleetCars } from '@/data/fleet';
import Container from '@/components/ui/Container/Container';
import SectionHeading from '@/components/ui/SectionHeading/SectionHeading';
import styles from './FleetMarquee.module.scss';

// Doubled so the strip can loop seamlessly: translating the track exactly
// -50% lines the second copy up perfectly with where the first one started.
const track = [...fleetCars, ...fleetCars];

/** Endless, non-stop left-scrolling showcase of the vehicles used on tours. */
export default function FleetMarquee() {
  return (
    <section id="fleet" className={styles.section} aria-labelledby="fleet-title">
      <Container>
        <SectionHeading
          eyebrow="Our Fleet"
          title={
            <span id="fleet-title">
              Premium cars, <em>every journey</em>
            </span>
          }
          description="Modern, air-conditioned vehicles driven by our own guides — comfortable however far the road goes."
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
