import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAllTourSlugs } from '@/data/tours';
import { fetchPublicTours, loadTourBySlug } from '@/lib/publicToursApi';
import { formatUSD } from '@/lib/format';
import { fromPriceUSD } from '@/lib/pricing';
import { getTourSeo } from '@/data/tourSeo';
import { tourJsonLd } from '@/lib/structuredData';
import TourDetail from '@/components/tourdetail/TourDetail/TourDetail';

interface PageProps {
  params: Promise<{ slug: string }>;
}

// ISR: pages are statically rendered but refetched from the DB in the
// background, so admin edits appear live within this window.
export const revalidate = 60;
// Tours created in the admin after a build still render, on-demand.
export const dynamicParams = true;

/** Pre-render every tour (DB + static) at build time. */
export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const db = await fetchPublicTours();
  const dbSlugs = db?.map((t) => t.slug) ?? [];
  const slugs = Array.from(new Set([...dbSlugs, ...getAllTourSlugs()]));
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const tour = await loadTourBySlug(slug);
  if (!tour) return { title: 'Tour not found' };

  // Curated SEO copy where we have it; fall back to on-page content otherwise.
  const seo = getTourSeo(tour.slug);
  const metaTitle = seo?.title ?? tour.title;
  const metaDescription = seo?.description ?? tour.shortDescription;
  const canonical = `/tours/${tour.slug}`;
  // Short, scannable social subtitle — price + place + length at a glance.
  const social = `${tour.duration} · ${tour.city} · from ${formatUSD(fromPriceUSD(tour))}`;

  return {
    // Absolute title bypasses the "%s · WanderKartli" template so the curated,
    // length-controlled title is exactly what Google shows.
    title: seo ? { absolute: seo.title } : tour.title,
    description: metaDescription,
    keywords: seo?.keywords,
    alternates: { canonical },
    openGraph: {
      type: 'article',
      url: canonical,
      title: metaTitle,
      description: social,
      images: [{ url: tour.heroImage, alt: tour.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: metaTitle,
      description: social,
      images: [tour.heroImage],
    },
  };
}

export default async function TourPage({ params }: PageProps) {
  const { slug } = await params;
  const tour = await loadTourBySlug(slug);

  if (!tour) notFound();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(tourJsonLd(tour)) }}
      />
      <TourDetail tour={tour} />
    </>
  );
}
