import Hero from '@/components/hero/Hero/Hero';
import OneDayTours from '@/components/tours/OneDayTours/OneDayTours';
import MultiDayTours from '@/components/tours/MultiDayTours/MultiDayTours';
import WhyChooseUs from '@/components/trust/WhyChooseUs/WhyChooseUs';
import Reviews from '@/components/reviews/Reviews/Reviews';
import CTABand from '@/components/cta/CTABand/CTABand';

export default function HomePage() {
  return (
    <>
      <Hero />
      <OneDayTours />
      <MultiDayTours />
      <WhyChooseUs />
      <Reviews />
      <CTABand />
    </>
  );
}
