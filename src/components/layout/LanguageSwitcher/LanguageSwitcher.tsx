'use client';

import { usePathname, useRouter } from 'next/navigation';
import { isLocale, LOCALES, toLocale, type Locale } from '@/lib/locale';
import styles from './LanguageSwitcher.module.scss';

const SHORT: Record<Locale, string> = { en: 'EN', ru: 'RU' };

/** Sleek EN/RU toggle that preserves the current path when switching. */
export default function LanguageSwitcher({ className }: { className?: string }) {
  const pathname = usePathname() ?? '/';
  const router = useRouter();
  const current = toLocale(pathname.split('/')[1]);

  const switchTo = (locale: Locale) => {
    if (locale === current) return;
    const parts = pathname.split('/');
    if (isLocale(parts[1])) parts[1] = locale;
    else parts.splice(1, 0, locale);
    const next = parts.join('/') || `/${locale}`;
    router.push(next);
  };

  return (
    <div className={[styles.switcher, className].filter(Boolean).join(' ')} role="group" aria-label="Language">
      {LOCALES.map((locale) => (
        <button
          key={locale}
          type="button"
          className={[styles.option, locale === current ? styles.active : ''].filter(Boolean).join(' ')}
          aria-current={locale === current ? 'true' : undefined}
          onClick={() => switchTo(locale)}
        >
          {SHORT[locale]}
        </button>
      ))}
    </div>
  );
}
