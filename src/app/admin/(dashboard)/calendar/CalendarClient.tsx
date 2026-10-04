'use client';

import { useMemo, useState } from 'react';
import Icon from '@/components/ui/Icon/Icon';
import StatusBadge from '@/components/admin/StatusBadge/StatusBadge';
import AdminModal from '@/components/admin/AdminModal/AdminModal';
import { mockBookings, mockDrivers, waLink, type AdminBooking } from '@/data/adminMock';
import { formatUSD, formatDate } from '@/lib/format';
import styles from './Calendar.module.scss';

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const TODAY = '2026-10-04';
const MAX_LANES = 3;

const STATUS_CLASS: Record<string, string | undefined> = {
  PENDING: styles.sPending,
  CONFIRMED: styles.sConfirmed,
  COMPLETED: styles.sCompleted,
  CANCELLED: styles.sCancelled,
};

const pad = (n: number) => String(n).padStart(2, '0');
const keyOf = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const parseKey = (s: string) => {
  const [y, m, d] = s.split('-').map(Number) as [number, number, number];
  return new Date(y, m - 1, d);
};
const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
const dayDiff = (a: Date, b: Date) => Math.round((b.getTime() - a.getTime()) / 86_400_000);

interface Cell { date: Date; key: string; dayNum: number; inMonth: boolean; }
interface Bar { booking: AdminBooking; startIdx: number; span: number; lane: number; contLeft: boolean; contRight: boolean; }
type View = { type: 'booking'; b: AdminBooking } | { type: 'day'; date: string; list: AdminBooking[] } | null;

const driverName = (id: string | null) => (id ? mockDrivers.find((d) => d.id === id)?.name ?? '' : '');

export default function CalendarClient() {
  const [cursor, setCursor] = useState(() => new Date(2026, 9, 1));
  const [view, setView] = useState<View>(null);

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const monthLabel = cursor.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  // Bookings with parsed start/end dates (end = start + days - 1).
  const items = useMemo(
    () =>
      mockBookings.map((b) => {
        const start = parseKey(b.startDate);
        return { b, start, end: addDays(start, Math.max(1, b.days) - 1) };
      }),
    [],
  );

  // Full weeks covering the visible month (padded with adjacent-month days).
  const weeks = useMemo<Cell[][]>(() => {
    const first = new Date(year, month, 1);
    const lead = (first.getDay() + 6) % 7;
    const gridStart = new Date(year, month, 1 - lead);
    const dim = new Date(year, month + 1, 0).getDate();
    const last = new Date(year, month, dim);
    const trail = 6 - ((last.getDay() + 6) % 7);
    const total = dayDiff(gridStart, new Date(year, month, dim + trail)) + 1;

    const out: Cell[][] = [];
    for (let i = 0; i < total; i += 7) {
      const row: Cell[] = [];
      for (let j = 0; j < 7; j++) {
        const d = addDays(gridStart, i + j);
        row.push({ date: d, key: keyOf(d), dayNum: d.getDate(), inMonth: d.getMonth() === month });
      }
      out.push(row);
    }
    return out;
  }, [year, month]);

  // Per-week spanning bars with greedy lane assignment + per-day overflow.
  const weekData = useMemo(
    () =>
      weeks.map((week) => {
        const weekStart = week[0]!.date;
        const weekEnd = week[6]!.date;

        const segments = items
          .filter((it) => it.start <= weekEnd && it.end >= weekStart)
          .map((it) => {
            const segStart = it.start < weekStart ? weekStart : it.start;
            const segEnd = it.end > weekEnd ? weekEnd : it.end;
            return {
              booking: it.b,
              startIdx: dayDiff(weekStart, segStart),
              span: dayDiff(segStart, segEnd) + 1,
              contLeft: it.start < weekStart,
              contRight: it.end > weekEnd,
            };
          })
          .sort((a, b) => a.startIdx - b.startIdx || b.span - a.span);

        const laneEnds: number[] = [];
        const bars: Bar[] = segments.map((s) => {
          let lane = laneEnds.findIndex((end) => end < s.startIdx);
          if (lane === -1) {
            lane = laneEnds.length;
            laneEnds.push(s.startIdx + s.span - 1);
          } else {
            laneEnds[lane] = s.startIdx + s.span - 1;
          }
          return { ...s, lane };
        });

        const overflow = Array(7).fill(0);
        for (const bar of bars) {
          if (bar.lane >= MAX_LANES) {
            for (let c = bar.startIdx; c < bar.startIdx + bar.span; c++) overflow[c] += 1;
          }
        }

        return { week, bars: bars.filter((b) => b.lane < MAX_LANES), overflow };
      }),
    [weeks, items],
  );

  const openDay = (cell: Cell) => {
    const list = items.filter((it) => it.start <= cell.date && it.end >= cell.date).map((it) => it.b);
    if (list.length) setView({ type: 'day', date: cell.key, list });
  };

  const modalTitle = view?.type === 'booking' ? view.b.clientName : view?.type === 'day' ? formatDate(view.date) : '';
  const modalSubtitle =
    view?.type === 'booking'
      ? `#${view.b.id} · ${view.b.tourName}`
      : view?.type === 'day'
        ? `${view.list.length} tour${view.list.length === 1 ? '' : 's'}`
        : undefined;

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
          <div className={styles.weekdays}>
            {WEEKDAYS.map((w) => (
              <div key={w} className={styles.weekday}>{w}</div>
            ))}
          </div>

          <div className={styles.weeks}>
            {weekData.map((wd, wi) => (
              <div key={wi} className={styles.week}>
                <div className={styles.dayCells}>
                  {wd.week.map((cell) => (
                    <div
                      key={cell.key}
                      className={[
                        styles.dayCell,
                        cell.inMonth ? '' : styles.outside,
                        cell.key === TODAY ? styles.today : '',
                      ].filter(Boolean).join(' ')}
                      onClick={() => openDay(cell)}
                    >
                      <span className={styles.dayNum}>{cell.dayNum}</span>
                    </div>
                  ))}
                </div>

                <div className={styles.barsLayer}>
                  {wd.bars.map((bar, bi) => (
                    <button
                      key={`${bar.booking.id}-${bi}`}
                      className={[
                        styles.bar,
                        STATUS_CLASS[bar.booking.tourStatus],
                        bar.contLeft ? styles.contLeft : '',
                        bar.contRight ? styles.contRight : '',
                      ].filter(Boolean).join(' ')}
                      style={{
                        left: `calc(${bar.startIdx} / 7 * 100% + 3px)`,
                        width: `calc(${bar.span} / 7 * 100% - 6px)`,
                        top: `${26 + bar.lane * 24}px`,
                      }}
                      title={`${bar.booking.tourName} — ${bar.booking.clientName}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setView({ type: 'booking', b: bar.booking });
                      }}
                    >
                      <span className={styles.barTour}>{bar.booking.tourName}</span>
                      {driverName(bar.booking.driverId) ? (
                        <span className={styles.barDriver}>{driverName(bar.booking.driverId)}</span>
                      ) : null}
                    </button>
                  ))}

                  {wd.overflow.map((n, ci) =>
                    n > 0 ? (
                      <span
                        key={`ov-${ci}`}
                        className={styles.more}
                        style={{ left: `calc(${ci} / 7 * 100% + 4px)`, top: `${26 + MAX_LANES * 24}px` }}
                      >
                        +{n} more
                      </span>
                    ) : null,
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.legend}>
        <span className={styles.legendItem}><i className={styles.sPending} />Pending</span>
        <span className={styles.legendItem}><i className={styles.sConfirmed} />Confirmed</span>
        <span className={styles.legendItem}><i className={styles.sCompleted} />Completed</span>
        <span className={styles.legendItem}><i className={styles.sCancelled} />Cancelled</span>
      </div>

      <AdminModal open={view !== null} onClose={() => setView(null)} title={modalTitle} subtitle={modalSubtitle} wide>
        {view?.type === 'booking' ? (
          <BookingDetail b={view.b} />
        ) : view?.type === 'day' ? (
          <div className={styles.dayList}>
            {view.list.map((b) => (
              <button key={b.id} className={styles.dayItem} onClick={() => setView({ type: 'booking', b })}>
                <span className={styles.dayItemMain}>
                  <span className={styles.dayItemTour}>{b.tourName}</span>
                  <span className={styles.dayItemClient}>{b.clientName} · {driverName(b.driverId) || 'Unassigned'}</span>
                </span>
                <StatusBadge kind="tour" value={b.tourStatus} />
              </button>
            ))}
          </div>
        ) : null}
      </AdminModal>
    </div>
  );
}

function BookingDetail({ b }: { b: AdminBooking }) {
  const driver = mockDrivers.find((d) => d.id === b.driverId);
  return (
    <div className={styles.detail}>
      <div className={styles.detailBadges}>
        <StatusBadge kind="tour" value={b.tourStatus} />
        <StatusBadge kind="payment" value={b.paymentStatus} />
      </div>
      <dl className={styles.detailGrid}>
        <div><dt>Dates</dt><dd>{formatDate(b.startDate)} · {b.days} day{b.days === 1 ? '' : 's'}</dd></div>
        <div><dt>Passengers</dt><dd>{b.passengers}</dd></div>
        <div><dt>Vehicle</dt><dd>{b.vehicleType}</dd></div>
        <div><dt>Total</dt><dd className={styles.price}>{formatUSD(b.totalPrice)}</dd></div>
        <div><dt>Driver</dt><dd>{driver ? driver.name : 'Unassigned'}</dd></div>
        <div>
          <dt>Phone</dt>
          <dd>
            <a className={styles.wa2} href={waLink(b.phone)} target="_blank" rel="noopener noreferrer">
              <Icon name="whatsapp" size={14} /> {b.phone}
            </a>
          </dd>
        </div>
        <div className={styles.detailWide}><dt>Email</dt><dd><a href={`mailto:${b.email}`}>{b.email}</a></dd></div>
      </dl>
      {b.specialRequests ? (
        <div className={styles.block}>
          <span className={styles.blockLabel}>Special requests</span>
          <p className={styles.blockText}>{b.specialRequests}</p>
        </div>
      ) : null}
    </div>
  );
}
