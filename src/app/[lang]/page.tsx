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

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  return { alternates: hreflangAlternates(toLocale(lang), '/') };
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
      <MultiDayTours tours={multiDay} />
      <TravelerMemories memories={moments} />
      <FleetMarquee />
      <WhyChooseUs />
      <Reviews />
      <CTABand />
    </>
  );
}
