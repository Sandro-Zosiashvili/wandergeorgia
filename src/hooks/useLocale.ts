'use client';

import { usePathname } from 'next/navigation';
import { toLocale, type Locale } from '@/lib/locale';

/** The active locale, read from the first path segment (/en/..., /ru/...). */
export function useLocale(): Locale {
  const pathname = usePathname();
  return toLocale(pathname?.split('/')[1]);
}
