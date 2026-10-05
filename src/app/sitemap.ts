import type { MetadataRoute } from 'next';
import { site } from '@/config/site';
import { loadTours } from '@/lib/publicToursApi';

/**
 * XML sitemap served at /sitemap.xml — lists every public page so search
 * engines can discover and index them. Tour pages come from the live DB (with
 * a static fallback), so the sitemap stays in sync with the catalog.
 */
export const revalidate = 60;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = site.url.replace(/\/$/, '');
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/booking`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
  ];

  const tours = await loadTours();
  const tourPages: MetadataRoute.Sitemap = tours.map((tour) => ({
    url: `${base}/tours/${tour.slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [...staticPages, ...tourPages];
}
