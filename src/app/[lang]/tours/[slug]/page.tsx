import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { fetchPublicTours, loadTourBySlug } from '@/lib/publicToursApi';
import { formatUSD } from '@/lib/format';
import { fromPriceUSD } from '@/lib/pricing';
import { getTourSeo } from '@/data/tourSeo';
import { tourJsonLd } from '@/lib/structuredData';
import { hreflangAlternates } from '@/lib/i18nSeo';
import { LOCALES, toLocale } from '@/lib/locale';
import { ui } from '@/lib/uiStrings';
import TourDetail from '@/components/tourdetail/TourDetail/TourDetail';

interface PageProps {
  params: Promise<{ slug: string; lang: string }>;
}

export const revalidate = 60;
export const dynamicParams = true;

/** Pre-render active tours in both locales. */
export async function generateStaticParams(): Promise<{ lang: string; slug: string }[]> {
  const db = await fetchPublicTours();
  const slugs = (db ?? []).map((t) => t.slug);
  return LOCALES.flatMap((lang) => slugs.map((slug) => ({ lang, slug })));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, lang: raw } = await params;
  const lang = toLocale(raw);
  const tour = await loadTourBySlug(slug, lang);
  if (!tour) return { title: ui(lang).tourDetail.notFound };

  const seo = getTourSeo(tour.slug);
  const metaTitle = lang === 'en' && seo ? seo.title : tour.title;
  const metaDescription = lang === 'en' && seo ? seo.description : tour.shortDescription;
  const social = `${tour.duration} · ${tour.city} · from ${formatUSD(fromPriceUSD(tour))}`;

  return {
    title: lang === 'en' && seo ? { absolute: seo.title } : tour.title,
    description: metaDescription,
    keywords: lang === 'en' ? seo?.keywords : undefined,
    alternates: hreflangAlternates(lang, `/tours/${tour.slug}`),
    openGraph: {
      type: 'article',
      url: `/${lang}/tours/${tour.slug}`,
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
  const { slug, lang } = await params;
  const locale = toLocale(lang);
  const tour = await loadTourBySlug(slug, locale);
  if (!tour) notFound();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(tourJsonLd(tour)) }}
      />
      <TourDetail tour={tour} lang={locale} />
    </>
  );
}
