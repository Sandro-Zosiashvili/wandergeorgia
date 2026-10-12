import en from '@/dictionaries/en.json';
import ru from '@/dictionaries/ru.json';
import type { Locale } from './locale';

/** Client-safe UI strings (small; both locales bundle to the client). Use in
 *  client leaves via `ui(useLocale())`; Server Components use getDictionary. */
const DICTS = { en, ru } as const;

export function ui(locale: Locale): typeof en {
  return DICTS[locale] ?? en;
}
