import type { Metadata } from 'next';
import Container from '@/components/ui/Container/Container';
import SectionHeading from '@/components/ui/SectionHeading/SectionHeading';
import MemoriesGallery from '@/components/memories/MemoriesGallery/MemoriesGallery';
import { loadMemories } from '@/lib/publicMemoriesApi';
import { hreflangAlternates } from '@/lib/i18nSeo';
import { toLocale } from '@/lib/locale';
import styles from './page.module.scss';

export const revalidate = 60;

const META: Record<'en' | 'ru', { title: string; description: string; eyebrow: string; heading: string; lead: string }> = {
  en: {
    title: 'Traveler Moments',
    description:
      'Real photos and video clips shared by guests on their private Georgia tours — from Kazbegi sunrises to Kakheti wine cellars. Browse the full gallery.',
    eyebrow: 'Traveler moments',
    heading: 'Memories from the road',
    lead: 'Every photo and clip here was shared by a guest on one of our private tours. Filter by photos or videos, and tap any moment to view it full size.',
  },
  ru: {
    title: 'Моменты путешественников',
    description:
      'Настоящие фото и видео, которыми делятся гости в частных турах по Грузии — от рассветов Казбеги до винных погребов Кахетии. Смотрите всю галерею.',
    eyebrow: 'Моменты путешественников',
    heading: 'Моменты из путешествий',
    lead: 'Каждое фото и видео здесь прислал гость одного из наших частных туров. Фильтруйте по фото или видео и нажмите на любой момент, чтобы открыть его полностью.',
  },
};

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const l = toLocale(lang);
  return {
    title: META[l].title,
    description: META[l].description,
    alternates: hreflangAlternates(l, '/memories'),
    openGraph: { type: 'website', url: `/${l}/memories`, title: `${META[l].title} · WanderKartli`, description: META[l].description },
  };
}

export default async function MemoriesPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const l = toLocale(lang);
  const memories = await loadMemories(l);

  return (
    <div className={styles.page}>
      <Container>
        <div className={styles.header}>
          <SectionHeading eyebrow={META[l].eyebrow} title={META[l].heading} description={META[l].lead} align="center" />
        </div>
        <MemoriesGallery memories={memories} />
      </Container>
    </div>
  );
}
