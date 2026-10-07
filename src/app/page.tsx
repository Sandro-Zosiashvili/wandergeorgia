import Hero from '@/components/hero/Hero/Hero';
import OneDayTours from '@/components/tours/OneDayTours/OneDayTours';
import MultiDayTours from '@/components/tours/MultiDayTours/MultiDayTours';
import TravelerMemories from '@/components/memories/TravelerMemories/TravelerMemories';
import FleetMarquee from '@/components/fleet/FleetMarquee/FleetMarquee';
import WhyChooseUs from '@/components/trust/WhyChooseUs/WhyChooseUs';
import Reviews from '@/components/reviews/Reviews/Reviews';
import CTABand from '@/components/cta/CTABand/CTABand';
import { loadTours } from '@/lib/publicToursApi';

// ISR — the home listings refetch from the DB so admin edits appear live.
export const revalidate = 60;

export default async function HomePage() {
  const tours = await loadTours();
  const oneDay = tours.filter((t) => t.type === 'one-day');
  const multiDay = tours.filter((t) => t.type === 'multi-day');

  return (
    <>
      <Hero />
      <OneDayTours tours={oneDay} />
      <MultiDayTours tours={multiDay} />
      <TravelerMemories />
      <FleetMarquee />
      <WhyChooseUs />
      <Reviews />
      <CTABand />
    </>
  );
}
