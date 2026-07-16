import Image from 'next/image';
import Link from 'next/link';
import type { Tour } from '@/types/tour';
import { unsplashSized } from '@/lib/images';
import Icon from '@/components/ui/Icon/Icon';
import TourHeroSlideshow from '../TourHeroSlideshow/TourHeroSlideshow';
import styles from './TourHero.module.scss';

interface TourHeroProps {
  tour: Tour;
}

/** Immersive header for a tour: a single photo, or — for multi-day trips with a
 *  day-by-day plan — a slideshow that previews each day's destination. */
export default function TourHero({ tour }: TourHeroProps) {
  const typeLabel = tour.type === 'multi-day' ? `${tour.days}-day package` : 'Day tour';
  const hasAirportTransfers = tour.included.some((inc) => inc.icon.startsWith('plane'));

  const slides =
    tour.itinerary
      ?.filter((d) => d.image)
      .map((d) => ({
        image: unsplashSized(d.image),
        label: `${d.day} · ${d.title}`,
        imagePosition: d.imagePosition,
      })) ?? [];

  return (
    <header className={styles.hero}>
      <div className={styles.media}>
        {slides.length > 1 ? (
          <TourHeroSlideshow slides={slides} />
        ) : (
          <>
            <Image
              src={tour.heroImage}
              alt={tour.title}
              fill
              priority
              sizes="100vw"
              className={styles.image}
              style={{ objectPosition: tour.imagePosition ?? 'center' }}
            />
            <div className={styles.scrim} aria-hidden="true" />
          </>
        )}
      </div>

      <div className={styles.inner}>
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <Icon name="chevron-right" size={14} />
          <Link href={tour.type === 'multi-day' ? '/#packages' : '/#day-tours'}>
            {tour.type === 'multi-day' ? 'Packages' : 'Day tours'}
          </Link>
          <Icon name="chevron-right" size={14} />
          <span aria-current="page">{tour.title}</span>
        </nav>

        <span className={styles.typeTag}>{typeLabel}</span>
        <h1 className={styles.title}>{tour.title}</h1>

        <ul className={styles.facts}>
          <li className={styles.fact}>
            <Icon name="map-pin" size={17} />
            {tour.city}
          </li>
          <li className={styles.fact}>
            <Icon name="clock" size={17} />
            {tour.duration}
          </li>
          <li className={styles.fact}>
            {hasAirportTransfers ? (
              <>
                <Icon name="plane-arrival" size={17} />
                Airport transfers included
              </>
            ) : (
              <>
                <Icon name="map-pin" size={17} />
                Hotel pick-up included
              </>
            )}
          </li>
        </ul>
      </div>
    </header>
  );
}
