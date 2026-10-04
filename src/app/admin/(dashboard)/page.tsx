import type { Metadata } from 'next';
import Link from 'next/link';
import Icon, { type IconName } from '@/components/ui/Icon/Icon';
import StatusBadge from '@/components/admin/StatusBadge/StatusBadge';
import { mockBookings, bookingTrends } from '@/data/adminMock';
import { formatUSD, formatDate } from '@/lib/format';
import styles from './Dashboard.module.scss';

export const metadata: Metadata = {
  title: 'Overview',
  robots: { index: false, follow: false },
};

export default function OverviewPage() {
  const total = mockBookings.length;
  const pending = mockBookings.filter((b) => b.tourStatus === 'PENDING').length;
  const confirmed = mockBookings.filter((b) => b.tourStatus === 'CONFIRMED').length;
  const revenue = mockBookings
    .filter((b) => b.tourStatus !== 'CANCELLED')
    .reduce((sum, b) => sum + b.totalPrice, 0);

  const recent = [...mockBookings]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 5);

  const kpis: { label: string; value: string; icon: IconName; tone: string | undefined }[] = [
    { label: 'Total bookings', value: String(total), icon: 'clipboard', tone: styles.gold },
    { label: 'Pending approvals', value: String(pending), icon: 'clock', tone: styles.amber },
    { label: 'Confirmed tours', value: String(confirmed), icon: 'check', tone: styles.green },
    { label: 'Estimated revenue', value: formatUSD(revenue), icon: 'compass', tone: styles.gold },
  ];

  const maxTrend = Math.max(...bookingTrends.map((t) => t.count));

  return (
    <div className={styles.wrap}>
      <header className={styles.head}>
        <h1 className={styles.title}>Overview</h1>
        <p className={styles.sub}>A snapshot of bookings, approvals and revenue.</p>
      </header>

      <div className={styles.kpis}>
        {kpis.map((k) => (
          <div key={k.label} className={styles.kpi}>
            <span className={[styles.kpiIcon, k.tone].filter(Boolean).join(' ')}>
              <Icon name={k.icon} size={20} />
            </span>
            <span className={styles.kpiValue}>{k.value}</span>
            <span className={styles.kpiLabel}>{k.label}</span>
          </div>
        ))}
      </div>

      <div className={styles.grid}>
        <section className={styles.card}>
          <div className={styles.cardHead}>
            <h2 className={styles.cardTitle}>Recent bookings</h2>
            <Link href="/admin/bookings" className={styles.cardLink}>
              View all <Icon name="arrow-right" size={15} />
            </Link>
          </div>
          <div className={styles.recentList}>
            {recent.map((b) => (
              <div key={b.id} className={styles.recentRow}>
                <div className={styles.recentMain}>
                  <span className={styles.recentName}>{b.clientName}</span>
                  <span className={styles.recentTour}>{b.tourName}</span>
                </div>
                <span className={styles.recentDate}>{formatDate(b.startDate)}</span>
                <StatusBadge kind="tour" value={b.tourStatus} />
                <span className={styles.recentPrice}>{formatUSD(b.totalPrice)}</span>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.card}>
          <div className={styles.cardHead}>
            <h2 className={styles.cardTitle}>Booking trends</h2>
            <span className={styles.cardMeta}>monthly requests</span>
          </div>
          <div className={styles.chart}>
            {bookingTrends.map((t) => (
              <div key={t.month} className={styles.bar}>
                <span className={styles.barValue}>{t.count}</span>
                <span
                  className={styles.barFill}
                  style={{ height: `${Math.round((t.count / maxTrend) * 100)}%` }}
                />
                <span className={styles.barLabel}>{t.month}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
