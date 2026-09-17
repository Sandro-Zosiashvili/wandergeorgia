import type { MetadataRoute } from 'next';
import { site } from '@/config/site';

/**
 * robots.txt served at /robots.txt — allows all crawlers and points them to
 * the sitemap so Google can find every page.
 */
export default function robots(): MetadataRoute.Robots {
  const base = site.url.replace(/\/$/, '');

  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
