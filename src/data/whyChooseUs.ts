import type { TrustItem } from '@/components/trust/TrustCard/TrustCard';

/** Reasons-to-trust shown in the "Why choose us" section. Editable. */
export const whyChooseUs: TrustItem[] = [
  {
    icon: 'guide',
    title: 'Private expert guides',
    description:
      'Never a coach full of strangers. Every trip is just your party and a passionate local guide who tailors the day to you.',
  },
  {
    icon: 'plane-arrival',
    title: 'Airport transfers included',
    description:
      'We meet you the moment you land and see you off at departure — every tour includes airport pickup and drop-off.',
  },
  {
    icon: 'star',
    title: '500+ five-star reviews',
    description:
      'A decade of guiding, thousands of happy travelers, and a near-perfect rating across TripAdvisor and Google.',
  },
  {
    icon: 'route',
    title: 'Journeys built around you',
    description:
      'Flexible pacing, hidden stops and honest recommendations — itineraries shaped by what you actually want to see.',
  },
];

/** Headline stats strip. */
export const trustStats: { value: string; label: string }[] = [
  { value: '4.9★', label: 'Average rating' },
  { value: '12k+', label: 'Guests hosted' },
  { value: '10 yrs', label: 'Guiding Georgia' },
  { value: '100%', label: 'Private tours' },
];
