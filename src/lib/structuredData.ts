import { site } from '@/config/site';
import type { Tour } from '@/types/tour';

const BASE = site.url.replace(/\/$/, '');

/**
 * Organization / TravelAgency schema — tells Google what the business is, who
 * to contact, and which social profiles belong to it. Rendered site-wide so it
 * strengthens brand ("WanderKartli") and local-business signals.
 */
export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'TravelAgency',
    '@id': `${BASE}/#organization`,
    name: site.name,
    url: BASE,
    logo: `${BASE}/icon.svg`,
    image: `${BASE}/assets/icons/gramp-image.png`,
    description: site.description,
    email: site.contact.email,
    telephone: site.contact.phone,
    priceRange: '$$',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Rustaveli Ave',
      addressLocality: 'Tbilisi',
      addressCountry: 'GE',
    },
    areaServed: [
      { '@type': 'Country', name: 'Georgia' },
      { '@type': 'Place', name: 'Caucasus' },
    ],
    knowsAbout: [
      'Private tours in Georgia',
      'Day tours from Tbilisi',
      'Kazbegi tours',
      'Kakheti wine tours',
      'Multi-day Georgia tour packages',
      'Airport transfers',
    ],
    sameAs: [site.socials.instagram, site.socials.facebook].filter(Boolean),
  };
}

/**
 * WebSite schema — declares the canonical site + name so Google can show the
 * site name in results.
 */
export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${BASE}/#website`,
    url: BASE,
    name: site.name,
    description: site.description,
    publisher: { '@id': `${BASE}/#organization` },
    inLanguage: 'en',
  };
}

/**
 * Per-tour Product + Offer schema — makes each tour eligible for rich results
 * (price, currency) and helps the page rank for its specific tour.
 */
export function tourJsonLd(tour: Tour) {
  const url = `${BASE}/tours/${tour.slug}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: tour.title,
    description: tour.shortDescription,
    image: tour.heroImage,
    url,
    category: 'Tour',
    brand: { '@type': 'Brand', name: site.name },
    offers: {
      '@type': 'Offer',
      price: tour.price,
      priceCurrency: 'GEL',
      availability: 'https://schema.org/InStock',
      url,
      seller: { '@id': `${BASE}/#organization` },
    },
  };
}
