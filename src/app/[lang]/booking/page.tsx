import type { Metadata } from 'next';
import { loadTourBySlug, loadTours } from '@/lib/publicToursApi';
import Container from '@/components/ui/Container/Container';
import BookingFlow from '@/components/booking/BookingFlow/BookingFlow';
import BookingHeader from '@/components/booking/BookingHeader/BookingHeader';
import BookingTourPicker from '@/components/booking/BookingTourPicker/BookingTourPicker';
import { hreflangAlternates } from '@/lib/i18nSeo';
import { toLocale } from '@/lib/locale';
import styles from './page.module.scss';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const l = toLocale(lang);
  const title = l === 'ru' ? 'Бронирование частного тура по Грузии' : 'Book a Private Georgia Tour';
  const description =
    l === 'ru'
      ? 'Забронируйте частный тур по Грузии онлайн — выберите даты, размер группы и автомобиль. Англоговорящий водитель-гид и трансферы из аэропорта включены.'
      : 'Reserve your private Georgia tour online. Choose your dates, group size and vehicle — English-speaking driver-guide and airport transfers included. Book today.';
  return {
    title,
    description,
    alternates: hreflangAlternates(l, '/booking'),
    openGraph: { type: 'website', url: `/${l}/booking`, title: `${title} · WanderKartli`, description },
  };
}

interface PageProps {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ tour?: string }>;
}

export default async function BookingPage({ params, searchParams }: PageProps) {
  const { lang } = await params;
  const l = toLocale(lang);
  const { tour: slug } = await searchParams;
  const tour = slug ? await loadTourBySlug(slug, l) : undefined;

  return (
    <div className={styles.page}>
      <Container>
        {tour ? (
          <>
            <BookingHeader tourTitle={tour.title} tourSlug={tour.slug} lang={l} />
            <BookingFlow tour={tour} />
          </>
        ) : (
          <BookingTourPicker tours={await loadTours(l)} lang={l} />
        )}
      </Container>
    </div>
  );
}
