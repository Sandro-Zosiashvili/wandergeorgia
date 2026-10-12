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

/** Prefix an app-relative path with the locale, e.g. ('ru','/tours') → '/ru/tours'.
 *  Hash-only and absolute/external links are returned unchanged. */
export function localePath(locale: Locale, path: string): string {
  if (!path || path.startsWith('http') || path.startsWith('mailto:') || path.startsWith('tel:')) {
    return path;
  }
  if (path.startsWith('#')) return path;
  if (path === '/') return `/${locale}`;
  const clean = path.startsWith('/') ? path : `/${path}`;
  return `/${locale}${clean}`;
}
