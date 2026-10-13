import type { Locale } from '@/lib/locale';

/** Verified guest reviews. Placeholder content — swap for real Google reviews. */

export interface Review {
  quote: string;
  author: string;
  country: string;
  rating: number;
  tour: string;
  /** When the review was posted, e.g. '2 weeks ago'. */
  date?: string;
}

const reviewsEn: Review[] = [
  {
    quote:
      'From the airport welcome to the last goodbye, everything was seamless. Our guide felt like a friend who happened to know every hidden corner of Georgia.',
    author: 'Emily R.',
    country: 'United Kingdom',
    rating: 5,
    tour: 'Wine & Mountains — 5 Days',
    date: '2 weeks ago',
  },
  {
    quote:
      'Kazbegi at sunrise was the single most beautiful morning of our lives. The private car meant we beat every crowd. Worth every lari.',
    author: 'Daniel & Sofia',
    country: 'Germany',
    rating: 5,
    tour: 'Kazbegi & Gergeti Trinity',
    date: 'a month ago',
  },
  {
    quote:
      'The wine day in Kakheti was extraordinary — family cellars we could never have found alone, and a lunch we still talk about.',
    author: 'Marcus T.',
    country: 'United States',
    rating: 5,
    tour: 'Kakheti Wine Country Day',
    date: '3 weeks ago',
  },
  {
    quote:
      'Impeccably organised and never rushed. They adjusted the whole itinerary around our toddler without a single complaint.',
    author: 'Aisha K.',
    country: 'United Arab Emirates',
    rating: 5,
    tour: 'Essential Georgia — 3 Days',
    date: 'a month ago',
  },
  {
    quote:
      'Ten days of flawless logistics. Being met at arrivals and driven straight into the mountains set the tone for the whole trip.',
    author: 'Lucas M.',
    country: 'France',
    rating: 5,
    tour: 'Grand Georgia — 7 Days',
    date: '2 months ago',
  },
  {
    quote:
      'Genuinely premium without being stuffy. Beautiful vehicle, a guide with real stories, and recommendations that were spot on.',
    author: 'Nina P.',
    country: 'Poland',
    rating: 5,
    tour: 'Tbilisi Old Town & Baths',
    date: '6 days ago',
  },
];

const reviewsRu: Review[] = [
  {
    quote:
      'От встречи в аэропорту до последнего прощания всё было безупречно. Наш гид был как друг, который знает каждый укромный уголок Грузии.',
    author: 'Emily R.',
    country: 'Великобритания',
    rating: 5,
    tour: 'Вино и горы — 5 дней',
    date: '2 недели назад',
  },
  {
    quote:
      'Казбеги на рассвете — самое красивое утро в нашей жизни. Личный автомобиль позволил опередить все толпы. Стоит каждого лари.',
    author: 'Daniel & Sofia',
    country: 'Германия',
    rating: 5,
    tour: 'Казбеги и Гергетская Троица',
    date: 'месяц назад',
  },
  {
    quote:
      'Винный день в Кахетии был необыкновенным — семейные погреба, которые сами мы бы не нашли, и обед, о котором мы до сих пор вспоминаем.',
    author: 'Marcus T.',
    country: 'США',
    rating: 5,
    tour: 'Винный край Кахетии — день',
    date: '3 недели назад',
  },
  {
    quote:
      'Безупречно организовано и без спешки. Они перестроили весь маршрут под нашего малыша без единого возражения.',
    author: 'Aisha K.',
    country: 'ОАЭ',
    rating: 5,
    tour: 'Знакомство с Грузией — 3 дня',
    date: 'месяц назад',
  },
  {
    quote:
      'Десять дней безупречной логистики. Встреча в зале прилёта и дорога прямо в горы задали тон всей поездке.',
    author: 'Lucas M.',
    country: 'Франция',
    rating: 5,
    tour: 'Большое путешествие по Грузии — 7 дней',
    date: '2 месяца назад',
  },
  {
    quote:
      'По-настоящему премиально и без пафоса. Прекрасный автомобиль, гид с настоящими историями и точные рекомендации.',
    author: 'Nina P.',
    country: 'Польша',
    rating: 5,
    tour: 'Старый Тбилиси и бани',
    date: '6 дней назад',
  },
];

/** Reviews in the active locale (English content is the base). */
export function getReviews(locale: Locale): Review[] {
  return locale === 'ru' ? reviewsRu : reviewsEn;
}

/** Back-compat export (English). Prefer getReviews(locale). */
export const reviews = reviewsEn;
