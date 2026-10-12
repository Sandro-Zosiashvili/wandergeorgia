'use client';

import Link from 'next/link';
import type { ComponentProps } from 'react';
import { localePath } from '@/lib/locale';
import { useLocale } from '@/hooks/useLocale';

type LocaleLinkProps = ComponentProps<typeof Link>;

/**
 * A next/link that automatically prefixes the current locale onto internal
 * paths (e.g. `/tours/x` → `/ru/tours/x`). Hash, external, mailto and tel
 * links pass through unchanged. Lets Server Components link correctly without
 * threading the locale down as a prop.
 */
export default function LocaleLink({ href, ...props }: LocaleLinkProps) {
  const locale = useLocale();
  const resolved = typeof href === 'string' ? localePath(locale, href) : href;
  return <Link href={resolved} {...props} />;
}
