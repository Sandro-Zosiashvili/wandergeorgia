import type { Locale } from './locale';

export type Dictionary = typeof import('../dictionaries/en.json');

// Server-only dynamic imports: only the active locale's JSON is loaded, and it
// never ships in the client bundle.
const loaders: Record<Locale, () => Promise<Dictionary>> = {
  en: () => import('../dictionaries/en.json').then((m) => m.default),
  ru: () => import('../dictionaries/ru.json').then((m) => m.default),
};

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  return (loaders[locale] ?? loaders.en)();
}
