import { LOCALES, type Locale } from './locale';

/**
 * Build the `alternates` block for a localized page: a self-referential
 * canonical plus `hreflang` links for every locale and an x-default. Paths are
 * relative (metadataBase in the root layout resolves them to absolute URLs).
 */
export function hreflangAlternates(locale: Locale, path: string): {
  canonical: string;
  languages: Record<string, string>;
} {
  const clean = path === '/' ? '' : path;
  const languages: Record<string, string> = {};
  for (const l of LOCALES) languages[l] = `/${l}${clean}`;
  languages['x-default'] = `/en${clean}`;
  return { canonical: `/${locale}${clean}`, languages };
}
