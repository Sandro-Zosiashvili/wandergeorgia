import type { Locale } from './locale';

/**
 * Pick the correct plural word form for a count.
 *
 * English uses two forms (`one` / `other`). Russian uses three (`one` / `few`
 * / `many`) selected by the standard CLDR rule. Pass the forms straight from
 * the dictionary, e.g. `plural('ru', 3, dict.booking.units.day)`.
 */
export function plural(locale: Locale, n: number, forms: Record<string, string>): string {
  if (locale === 'ru') {
    const mod10 = n % 10;
    const mod100 = n % 100;
    if (mod10 === 1 && mod100 !== 11) return forms.one ?? '';
    if (mod10 >= 2 && mod10 <= 4 && !(mod100 >= 12 && mod100 <= 14)) return forms.few ?? '';
    return forms.many ?? '';
  }
  return n === 1 ? (forms.one ?? '') : (forms.other ?? '');
}

/** `3` + day forms → `"3 days"` / `"3 дня"`. */
export function pluralCount(locale: Locale, n: number, forms: Record<string, string>): string {
  return `${n} ${plural(locale, n, forms)}`;
}
