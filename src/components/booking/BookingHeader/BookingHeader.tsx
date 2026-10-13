import LocaleLink from '@/components/ui/LocaleLink/LocaleLink';
import Icon from '@/components/ui/Icon/Icon';
import type { Locale } from '@/lib/locale';
import { ui } from '@/lib/uiStrings';
import styles from './BookingHeader.module.scss';

interface BookingHeaderProps {
  tourTitle: string;
  tourSlug: string;
  lang: Locale;
}

/** Compact header above the booking flow with a link back to the tour. */
export default function BookingHeader({ tourTitle, tourSlug, lang }: BookingHeaderProps) {
  const t = ui(lang).booking.header;
  return (
    <div className={styles.header}>
      <LocaleLink href={`/tours/${tourSlug}`} className={styles.back}>
        <Icon name="chevron-right" size={16} className={styles.backIcon} />
        {t.back}
      </LocaleLink>
      <span className={styles.eyebrow}>
        <Icon name="sparkle" size={14} />
        {t.eyebrow}
      </span>
      <h1 className={styles.title}>{tourTitle}</h1>
    </div>
  );
}
