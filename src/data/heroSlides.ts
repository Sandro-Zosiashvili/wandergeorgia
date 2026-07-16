import { photos } from '@/lib/images';

/** Full-screen hero slideshow images — real Georgian photography. */

export interface HeroSlide {
  /**
   * Unsplash base path (from the `photos` registry). The slideshow builds a
   * landscape crop for desktop and a portrait crop for phones from this.
   */
  photo: string;
  alt: string;
  /** Small location tag shown bottom-right during the slide. */
  place: string;
}

export const heroSlides: HeroSlide[] = [
  {
    photo: photos.kazbegiChurch,
    alt: 'Gergeti Trinity Church beneath the snow peaks of Mount Kazbek',
    place: 'Kazbegi',
  },
  {
    photo: photos.tbilisiAerial,
    alt: 'The old town of Tbilisi along the Mtkvari river at dusk',
    place: 'Tbilisi',
  },
  {
    photo: photos.kakhetiVineyard,
    alt: 'Vineyards of the Kakheti wine region beneath the Caucasus',
    place: 'Kakheti',
  },
  {
    photo: photos.caucasusValley,
    alt: 'A green valley deep in the Caucasus mountains',
    place: 'Caucasus',
  },
  {
    photo: photos.batumiCoast,
    alt: 'The Black Sea coast and skyline of Batumi at dawn',
    place: 'Batumi',
  },
];
