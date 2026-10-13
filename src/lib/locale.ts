/** Supported UI locales. English is the default/base. */
export const LOCALES = ['en', 'ru'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'en';

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (LOCALES as readonly string[]).includes(value);
}

/** Coerce an untrusted value to a valid locale (defaults to English). */
export function toLocale(value: unknown): Locale {
  return isLocale(value) ? value : DEFAULT_LOCALE;
}

/** First path segments that are never locale-prefixed (match the proxy's
 *  excluded paths — admin tool, API, SEO files, Next internals). */
const NON_LOCALIZED = new Set([
  'admin',
  'api',
  'revalidate',
  'robots.txt',
  'sitemap.xml',
  'favicon.ico',
  '_next',
]);

/**
 * Prefix an app-relative path with the locale, e.g. ('ru','/tours') →
 * '/ru/tours'. Safe to call more than once: a path that already starts with a
 * locale, points at a non-localized area (/admin, /api…), or is a hash,
 * external, mailto/tel or a file asset is returned unchanged. This idempotence
 * lets every internal link flow through one place (LocaleLink / Button)
 * without risk of double-prefixing.
 */
export function localePath(locale: Locale, path: string): string {
  if (!path || path.startsWith('http') || path.startsWith('mailto:') || path.startsWith('tel:')) {
    return path;
  }
  if (path.startsWith('#')) return path;
  if (/\.[^/]+$/.test(path)) return path; // has a file extension (asset)

  const seg = path.split('/')[1] ?? '';
  if (seg === 'en' || seg === 'ru') return path; // already localized
  if (NON_LOCALIZED.has(seg)) return path; // not a localized area

  if (path === '/') return `/${locale}`;
  const clean = path.startsWith('/') ? path : `/${path}`;
  return `/${locale}${clean}`;
}
