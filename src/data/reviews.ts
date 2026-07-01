/** Guest testimonials. Placeholder content — swap for real reviews. */

export interface Review {
  quote: string;
  author: string;
  country: string;
  rating: number;
  tour: string;
}

export const reviews: Review[] = [
  {
    quote:
      'From the airport welcome to the last goodbye, everything was seamless. Our guide felt like a friend who happened to know every hidden corner of Georgia.',
    author: 'Emily R.',
    country: 'United Kingdom',
    rating: 5,
    tour: 'Wine & Mountains — 5 Days',
  },
  {
    quote:
      'Kazbegi at sunrise was the single most beautiful morning of our lives. The private car meant we beat every crowd. Worth every lari.',
    author: 'Daniel & Sofia',
    country: 'Germany',
    rating: 5,
    tour: 'Kazbegi & Gergeti Trinity',
  },
  {
    quote:
      'The wine day in Kakheti was extraordinary — family cellars we could never have found alone, and a lunch we still talk about.',
    author: 'Marcus T.',
    country: 'United States',
    rating: 5,
    tour: 'Kakheti Wine Country Day',
  },
  {
    quote:
      'Impeccably organised and never rushed. They adjusted the whole itinerary around our toddler without a single complaint.',
    author: 'Aisha K.',
    country: 'United Arab Emirates',
    rating: 5,
    tour: 'Essential Georgia — 3 Days',
  },
  {
    quote:
      'Ten days of flawless logistics. Being met at arrivals and driven straight into the mountains set the tone for the whole trip.',
    author: 'Lucas M.',
    country: 'France',
    rating: 5,
    tour: 'Grand Georgia — 7 Days',
  },
  {
    quote:
      'Genuinely premium without being stuffy. Beautiful vehicle, a guide with real stories, and recommendations that were spot on.',
    author: 'Nina P.',
    country: 'Poland',
    rating: 5,
    tour: 'Tbilisi Old Town & Baths',
  },
];
