import type { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import { isLocale, LOCALES } from '@/lib/locale';

/** Pre-render both locale trees. */
export function generateStaticParams(): { lang: string }[] {
  return LOCALES.map((lang) => ({ lang }));
}

export default async function LangLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return children;
}
