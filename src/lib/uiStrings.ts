import en from '@/dictionaries/en.json';
import ru from '@/dictionaries/ru.json';
import type { Locale } from './locale';

/** Client-safe UI strings (small; both locales bundle to the client). Use in
 *  client leaves via `ui(useLocale())`; Server Components use getDictionary. */
const DICTS = { en, ru } as const;

export function ui(locale: Locale): typeof en {
  return DICTS[locale] ?? en;
}

/** Fill `{name}` placeholders in a template string, e.g.
 *  `tpl('{days}-day package', { days: 5 })` → `'5-day package'`. */
export function tpl(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, k) =>
    k in vars ? String(vars[k]) : `{${k}}`,
  );
}
