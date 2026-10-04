import type { Metadata } from 'next';
import Icon, { type IconName } from '@/components/ui/Icon/Icon';
import styles from './Dashboard.module.scss';

export const metadata: Metadata = {
  title: 'Dashboard',
  robots: { index: false, follow: false },
};

const STATS: { label: string; value: string; icon: IconName }[] = [
  { label: 'Total bookings', value: '—', icon: 'calendar' },
  { label: 'Pending', value: '—', icon: 'clock' },
  { label: 'Confirmed', value: '—', icon: 'check' },
  { label: 'Revenue (USD)', value: '—', icon: 'compass' },
];

export default function AdminDashboardPage() {
  return (
    <div className={styles.wrap}>
      <header className={styles.head}>
        <h1 className={styles.title}>Welcome back</h1>
        <p className={styles.sub}>
          Your tour-booking overview. Live figures wire up with the Bookings table next.
        </p>
      </header>

      <div className={styles.stats}>
        {STATS.map((s) => (
          <div key={s.label} className={styles.stat}>
            <span className={styles.statIcon}>
              <Icon name={s.icon} size={20} />
            </span>
            <span className={styles.statValue}>{s.value}</span>
            <span className={styles.statLabel}>{s.label}</span>
          </div>
        ))}
      </div>

      <div className={styles.placeholder}>
        <span className={styles.placeholderIcon}>
          <Icon name="calendar" size={30} />
        </span>
        <h2 className={styles.placeholderTitle}>Bookings table coming next</h2>
        <p className={styles.placeholderText}>
          Incoming tour bookings will appear here — with status controls, traveller
          details and totals — once the Bookings view is wired up.
        </p>
      </div>
    </div>
  );
}
