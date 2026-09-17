import type { MetadataRoute } from 'next';
import { site } from '@/config/site';
import { allTours } from '@/data/tours';

/**
 * XML sitemap served at /sitemap.xml — lists every public page so search
 * engines can discover and index them. Tour pages are generated from the
 * same data the site renders, so the sitemap stays in sync automatically.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.url.replace(/\/$/, '');
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/booking`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
  ];

  const tourPages: MetadataRoute.Sitemap = allTours.map((tour) => ({
    url: `${base}/tours/${tour.slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [...staticPages, ...tourPages];
}
