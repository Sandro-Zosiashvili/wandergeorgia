import { loadTours } from '@/lib/publicToursApi';
import Footer from './Footer';

/**
 * Async server wrapper that feeds the (client) Footer its "popular tours" from
 * the live DB — keeps the root layout synchronous while the footer stays in
 * sync with the catalog via ISR.
 */
export default async function FooterSection() {
  const tours = await loadTours();
  const popular = tours
    .filter((t) => t.type === 'one-day')
    .slice(0, 4)
    .map((t) => ({ slug: t.slug, title: t.title }));

  return <Footer popular={popular} />;
}
