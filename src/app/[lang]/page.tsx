import type { Metadata } from 'next';
import Hero from '@/components/hero/Hero/Hero';
import OneDayTours from '@/components/tours/OneDayTours/OneDayTours';
import MultiDayTours from '@/components/tours/MultiDayTours/MultiDayTours';
import TravelerMemories from '@/components/memories/TravelerMemories/TravelerMemories';
import FleetMarquee from '@/components/fleet/FleetMarquee/FleetMarquee';
import WhyChooseUs from '@/components/trust/WhyChooseUs/WhyChooseUs';
import Reviews from '@/components/reviews/Reviews/Reviews';
import CTABand from '@/components/cta/CTABand/CTABand';
import { loadTours } from '@/lib/publicToursApi';
import { loadMemories } from '@/lib/publicMemoriesApi';
import { loadHeroSlides } from '@/lib/publicHeroApi';
import { hreflangAlternates } from '@/lib/i18nSeo';
import { toLocale } from '@/lib/locale';

// ISR — the home listings refetch from the DB so admin edits appear live.
export const revalidate = 60;

const HOME_META: Record<'en' | 'ru', { title: string; description: string }> = {
  en: {
    title: 'WanderKartli — Private tours across Georgia',
    description:
      'Hand-crafted private tours across Georgia — Tbilisi, Kazbegi, Kakheti and beyond. Dedicated guide, premium vehicle and airport transfers included. Book today.',
  },
  ru: {
    title: 'WanderKartli — Частные туры по Грузии',
    description:
      'Индивидуальные частные туры по Грузии — Тбилиси, Казбеги, Кахетия и не только. Персональный гид, премиум-автомобиль и трансферы из аэропорта включены. Бронируйте сегодня.',
  },
};

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const l = toLocale(lang);
  return {
    title: { absolute: HOME_META[l].title },
    description: HOME_META[l].description,
    alternates: hreflangAlternates(l, '/'),
    openGraph: { type: 'website', url: `/${l}`, title: HOME_META[l].title, description: HOME_META[l].description },
  };
}

export default async function HomePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: raw } = await params;
  const lang = toLocale(raw);
  const [tours, moments, heroSlides] = await Promise.all([
    loadTours(lang),
    loadMemories(lang),
    loadHeroSlides(lang),
  ]);
  const oneDay = tours.filter((t) => t.type === 'one-day');
  const multiDay = tours.filter((t) => t.type === 'multi-day');

  return (
    <>
      <Hero slides={heroSlides} />
      <OneDayTours tours={oneDay} />
      <MultiDayTours tours={multiDay} lang={lang} />
      <TravelerMemories memories={moments} />
      <FleetMarquee lang={lang} />
      <WhyChooseUs lang={lang} />
      <Reviews lang={lang} />
      <CTABand lang={lang} />
    </>
  );
}
