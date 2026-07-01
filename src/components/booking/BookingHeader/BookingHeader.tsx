import Link from 'next/link';
import Icon from '@/components/ui/Icon/Icon';
import styles from './BookingHeader.module.scss';

interface BookingHeaderProps {
  tourTitle: string;
  tourSlug: string;
}

/** Compact header above the booking flow with a link back to the tour. */
export default function BookingHeader({ tourTitle, tourSlug }: BookingHeaderProps) {
  return (
    <div className={styles.header}>
      <Link href={`/tours/${tourSlug}`} className={styles.back}>
        <Icon name="chevron-right" size={16} className={styles.backIcon} />
        Back to tour
      </Link>
      <span className={styles.eyebrow}>
        <Icon name="sparkle" size={14} />
        Reserve your journey
      </span>
      <h1 className={styles.title}>{tourTitle}</h1>
    </div>
  );
}
