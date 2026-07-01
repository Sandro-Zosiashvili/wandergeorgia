import { photos, unsplash } from '@/lib/images';

/** Full-screen hero slideshow images — real Georgian photography. */

export interface HeroSlide {
  image: string;
  alt: string;
  /** Small location tag shown bottom-right during the slide. */
  place: string;
}

export const heroSlides: HeroSlide[] = [
  {
    image: unsplash(photos.kazbegiChurch),
    alt: 'Gergeti Trinity Church beneath the snow peaks of Mount Kazbek',
    place: 'Kazbegi',
  },
  {
    image: unsplash(photos.tbilisiAerial),
    alt: 'The old town of Tbilisi along the Mtkvari river at dusk',
    place: 'Tbilisi',
  },
  {
    image: unsplash(photos.svanetiTowers),
    alt: 'Medieval stone towers of Ushguli in Svaneti beneath high peaks',
    place: 'Svaneti',
  },
  {
    image: unsplash(photos.martviliCanyon),
    alt: 'Emerald water winding through Martvili Canyon',
    place: 'Martvili',
  },
  {
    image: unsplash(photos.batumiCoast),
    alt: 'The Black Sea coast and skyline of Batumi at dawn',
    place: 'Batumi',
  },
];
