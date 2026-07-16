import { photos, unsplashLandscape } from '@/lib/images';

/** Full-screen hero slideshow images — real Georgian photography. */

export interface HeroSlide {
  image: string;
  alt: string;
  /** Small location tag shown bottom-right during the slide. */
  place: string;
}

export const heroSlides: HeroSlide[] = [
  {
    image: unsplashLandscape(photos.kazbegiChurch),
    alt: 'Gergeti Trinity Church beneath the snow peaks of Mount Kazbek',
    place: 'Kazbegi',
  },
  {
    image: unsplashLandscape(photos.tbilisiAerial),
    alt: 'The old town of Tbilisi along the Mtkvari river at dusk',
    place: 'Tbilisi',
  },
  {
    image: unsplashLandscape(photos.kakhetiVineyard),
    alt: 'Vineyards of the Kakheti wine region beneath the Caucasus',
    place: 'Kakheti',
  },
  {
    image: unsplashLandscape(photos.caucasusValley),
    alt: 'A green valley deep in the Caucasus mountains',
    place: 'Caucasus',
  },
  {
    image: unsplashLandscape(photos.batumiCoast),
    alt: 'The Black Sea coast and skyline of Batumi at dawn',
    place: 'Batumi',
  },
];
