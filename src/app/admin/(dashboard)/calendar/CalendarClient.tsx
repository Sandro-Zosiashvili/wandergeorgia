'use client';

import { useMemo, useState } from 'react';
import Icon from '@/components/ui/Icon/Icon';
import { mockBookings, mockDrivers, type AdminBooking } from '@/data/adminMock';
import styles from './Calendar.module.scss';

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const TODAY = '2026-10-04';
const STATUS_CLASS: Record<string, string | undefined> = {
  PENDING: styles.pending,
  CONFIRMED: styles.confirmed,
  COMPLETED: styles.completed,
  CANCELLED: styles.cancelled,
};

export default function CalendarClient() {
  // Mock data lives in October 2026, so open there.
  const [cursor, setCursor] = useState(() => new Date(2026, 9, 1));
  const year = cursor.getFullYear();
  const month = cursor.getMonth();

  const byDate = useMemo(() => {
    const map: Record<string, AdminBooking[]> = {};
    for (const b of mockBookings) (map[b.startDate] ??= []).push(b);
    return map;
  }, []);

  const monthLabel = cursor.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const startWeekday = (new Date(year, month, 1).getDay() + 6) % 7; // Monday = 0
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: ({ day: number; key: string } | null)[] = [];
  for (let i = 0; i < startWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    const key = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    cells.push({ day: d, key });
  }

  const driverName = (id: string | null) =>
    id ? mockDrivers.find((d) => d.id === id)?.name.split(' ')[0] ?? '' : '';

  return (
    <div className={styles.wrap}>
      <header className={styles.head}>
        <div>
          <h1 className={styles.title}>Calendar</h1>
          <p className={styles.sub}>Scheduled tours by date</p>
        </div>
        <div className={styles.nav}>
          <button onClick={() => setCursor(new Date(year, month - 1, 1))} aria-label="Previous month">
            <Icon name="chevron-left" size={18} />
          </button>
          <span className={styles.month}>{monthLabel}</span>
          <button onClick={() => setCursor(new Date(year, month + 1, 1))} aria-label="Next month">
            <Icon name="chevron-right" size={18} />
          </button>
        </div>
      </header>

      <div className={styles.calScroll}>
        <div className={styles.cal}>
          {WEEKDAYS.map((w) => (
            <div key={w} className={styles.weekday}>{w}</div>
          ))}

          {cells.map((cell, i) =>
            cell === null ? (
              <div key={`blank-${i}`} className={[styles.cell, styles.blank].join(' ')} />
            ) : (
              <div
                key={cell.key}
                className={[styles.cell, cell.key === TODAY ? styles.today : ''].filter(Boolean).join(' ')}
              >
                <span className={styles.dayNum}>{cell.day}</span>
                <div className={styles.events}>
                  {(byDate[cell.key] ?? []).map((b) => (
                    <div key={b.id} className={[styles.event, STATUS_CLASS[b.tourStatus]].filter(Boolean).join(' ')} title={`${b.tourName} — ${b.clientName}`}>
                      <span className={styles.eventTour}>{b.tourName}</span>
                      {b.driverId ? <span className={styles.eventDriver}>{driverName(b.driverId)}</span> : null}
                    </div>
                  ))}
                </div>
              </div>
            ),
          )}
        </div>
      </div>

      <div className={styles.legend}>
        <span className={styles.legendItem}><i className={styles.pending} />Pending</span>
        <span className={styles.legendItem}><i className={styles.confirmed} />Confirmed</span>
        <span className={styles.legendItem}><i className={styles.completed} />Completed</span>
        <span className={styles.legendItem}><i className={styles.cancelled} />Cancelled</span>
      </div>
    </div>
  );
}
