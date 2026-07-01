import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAllTourSlugs, getTourBySlug } from '@/data/tours';
import { formatGEL } from '@/lib/format';
import TourDetail from '@/components/tourdetail/TourDetail/TourDetail';

interface PageProps {
  params: Promise<{ slug: string }>;
}

/** Pre-render every tour at build time. */
export function generateStaticParams(): { slug: string }[] {
  return getAllTourSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const tour = getTourBySlug(slug);
  if (!tour) return { title: 'Tour not found' };

  return {
    title: tour.title,
    description: tour.shortDescription,
    openGraph: {
      title: tour.title,
      description: `${tour.duration} · ${tour.city} · from ${formatGEL(tour.price)}`,
      images: [{ url: tour.heroImage }],
    },
  };
}

export default async function TourPage({ params }: PageProps) {
  const { slug } = await params;
  const tour = getTourBySlug(slug);

  if (!tour) notFound();

  return <TourDetail tour={tour} />;
}
