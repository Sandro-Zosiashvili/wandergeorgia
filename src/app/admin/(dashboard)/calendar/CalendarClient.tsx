'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import type { EventClickArg, EventContentArg, EventInput, EventMountArg } from '@fullcalendar/core';
import Icon from '@/components/ui/Icon/Icon';
import StatusBadge from '@/components/admin/StatusBadge/StatusBadge';
import AdminModal from '@/components/admin/AdminModal/AdminModal';
import { mockBookings, mockDrivers, waLink, type AdminBooking, type TourStatus } from '@/data/adminMock';
import { formatUSD, formatDate } from '@/lib/format';
import styles from './Calendar.module.scss';

type CalView = 'dayGridMonth' | 'dayGridWeek' | 'listMonth';
type StatusFilter = 'ALL' | TourStatus;
type DriverFilter = 'ALL' | 'UNASSIGNED' | string;

const VIEWS: { id: CalView; label: string }[] = [
  { id: 'dayGridMonth', label: 'Month' },
  { id: 'dayGridWeek', label: 'Week' },
  { id: 'listMonth', label: 'List' },
];

const STATUS_FILTERS: { id: StatusFilter; label: string }[] = [
  { id: 'ALL', label: 'All' },
  { id: 'PENDING', label: 'Pending' },
  { id: 'CONFIRMED', label: 'Confirmed' },
  { id: 'COMPLETED', label: 'Completed' },
  { id: 'CANCELLED', label: 'Cancelled' },
];

const pad = (n: number) => String(n).padStart(2, '0');
const toKey = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const driverName = (id: string | null) => (id ? mockDrivers.find((d) => d.id === id)?.name ?? '' : '');

/** Exclusive end date (FullCalendar convention) = start + days. */
function exclusiveEnd(startStr: string, days: number): string {
  const [y, m, d] = startStr.split('-').map(Number) as [number, number, number];
  const end = new Date(y, m - 1, d + Math.max(1, days));
  return `${end.getFullYear()}-${pad(end.getMonth() + 1)}-${pad(end.getDate())}`;
}

type ProgressState = 'upcoming' | 'active' | 'done';

/** Where a tour sits relative to today — used for "Day X of Y" progress. */
function tourProgress(b: AdminBooking): { x: number; total: number; state: ProgressState } {
  const total = Math.max(1, b.days);
  const todayKey = toKey(new Date());
  if (todayKey < b.startDate) return { x: 0, total, state: 'upcoming' };
  if (todayKey >= exclusiveEnd(b.startDate, b.days)) return { x: total, total, state: 'done' };
  const start = new Date(`${b.startDate}T00:00:00`);
  const today = new Date(`${todayKey}T00:00:00`);
  const diff = Math.round((today.getTime() - start.getTime()) / 86_400_000);
  return { x: diff + 1, total, state: 'active' };
}

/** Short progress label for tooltips, e.g. "Day 3 of 13". */
function progressLabel(b: AdminBooking): string {
  if (b.days <= 1) return '';
  const p = tourProgress(b);
  if (p.state === 'active') return `Day ${p.x} of ${p.total}`;
  if (p.state === 'upcoming') return 'Upcoming';
  return 'Completed';
}

/** Toggle a hover class on every segment of a multi-day event at once. */
function highlightEvent(id: string, on: boolean): void {
  if (typeof document === 'undefined') return;
  document.querySelectorAll(`[data-eid="${id}"]`).forEach((el) => el.classList.toggle('fc-evt-hover', on));
}

export default function CalendarClient() {
  const calRef = useRef<FullCalendar>(null);
  const [selected, setSelected] = useState<AdminBooking | null>(null);
  const [view, setView] = useState<CalView>('dayGridMonth');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL');
  const [driverFilter, setDriverFilter] = useState<DriverFilter>('ALL');

  // FullCalendar touches the DOM, so only render it on the client.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const filtered = useMemo(
    () =>
      mockBookings.filter((b) => {
        if (statusFilter !== 'ALL' && b.tourStatus !== statusFilter) return false;
        if (driverFilter === 'UNASSIGNED') return b.driverId === null;
        if (driverFilter !== 'ALL' && b.driverId !== driverFilter) return false;
        return true;
      }),
    [statusFilter, driverFilter],
  );

  const events = useMemo<EventInput[]>(
    () =>
      filtered.map((b) => ({
        id: b.id,
        title: b.tourName,
        start: b.startDate,
        end: exclusiveEnd(b.startDate, b.days),
        allDay: true,
        classNames: ['evt', `evt-${b.tourStatus.toLowerCase()}`, b.days > 1 ? 'evt-multi' : 'evt-single'],
        extendedProps: { booking: b },
      })),
    [filtered],
  );

  const changeView = (v: CalView) => {
    setView(v);
    calRef.current?.getApi().changeView(v);
  };

  const onEventClick = (arg: EventClickArg) => {
    highlightEvent(arg.event.id, false);
    setSelected(arg.event.extendedProps.booking as AdminBooking);
  };

  // A continuous bar across the grid: the tour title + driver live inside it.
  const renderEvent = (arg: EventContentArg) => {
    const b = arg.event.extendedProps.booking as AdminBooking;
    const dn = driverName(b.driverId);
    return (
      <div className={styles.barInner}>
        <span className={styles.barTitle}>{b.tourName}</span>
        {dn ? <span className={styles.barDriver}>· {dn}</span> : null}
        {b.days > 1 ? <span className={styles.barDays}>{b.days}d</span> : null}
      </div>
    );
  };

  // Tag each segment with its event id (so hover can highlight the whole span)
  // and give it a rich native tooltip.
  const onEventDidMount = (arg: EventMountArg) => {
    const b = arg.event.extendedProps.booking as AdminBooking;
    arg.el.setAttribute('data-eid', arg.event.id);
    const dn = driverName(b.driverId) || 'Unassigned';
    const span =
      b.days > 1
        ? `${formatDate(b.startDate)} → ${formatDate(exclusiveEnd(b.startDate, b.days))} · ${b.days} days`
        : formatDate(b.startDate);
    const prog = progressLabel(b);
    arg.el.title = [b.tourName, `${b.clientName} · ${dn} · ${b.passengers} pax`, span, prog, b.tourStatus]
      .filter(Boolean)
      .join('\n');
  };

  return (
    <div className={styles.wrap}>
      <header className={styles.head}>
        <div>
          <h1 className={styles.title}>Calendar</h1>
          <p className={styles.sub}>Scheduled tours by date</p>
        </div>
        <div className={styles.viewTabs} role="tablist" aria-label="Calendar view">
          {VIEWS.map((v) => (
            <button
              key={v.id}
              role="tab"
              aria-selected={view === v.id}
              className={[styles.viewTab, view === v.id ? styles.viewTabActive : ''].filter(Boolean).join(' ')}
              onClick={() => changeView(v.id)}
            >
              {v.label}
            </button>
          ))}
        </div>
      </header>

      <div className={styles.filters}>
        <div className={styles.statusPills} role="group" aria-label="Filter by status">
          {STATUS_FILTERS.map((s) => (
            <button
              key={s.id}
              className={[
                styles.pill,
                s.id !== 'ALL' ? styles[`pill${s.id[0]}${s.id.slice(1).toLowerCase()}`] : '',
                statusFilter === s.id ? styles.pillActive : '',
              ].filter(Boolean).join(' ')}
              onClick={() => setStatusFilter(s.id)}
            >
              {s.id !== 'ALL' ? <i aria-hidden="true" /> : null}
              {s.label}
            </button>
          ))}
        </div>

        <label className={styles.driverFilter}>
          <Icon name="filter" size={15} />
          <select
            className={styles.driverSelect}
            value={driverFilter}
            onChange={(e) => setDriverFilter(e.target.value as DriverFilter)}
            aria-label="Filter by driver"
          >
            <option value="ALL">All drivers</option>
            <option value="UNASSIGNED">Unassigned</option>
            {mockDrivers.map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        </label>
      </div>

      <div className={[styles.fcWrap, view === 'listMonth' ? styles.listMode : ''].filter(Boolean).join(' ')}>
        {mounted ? (
          <FullCalendar
            ref={calRef}
            plugins={[dayGridPlugin, listPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            initialDate="2026-10-01"
            firstDay={1}
            headerToolbar={{ left: 'prev,next today', center: 'title', right: '' }}
            buttonText={{ today: 'Today' }}
            height="auto"
            dayMaxEvents={false}
            displayEventTime={false}
            eventDisplay="block"
            dayHeaderFormat={{ weekday: 'short' }}
            noEventsText="No tours match these filters"
            events={events}
            eventContent={renderEvent}
            eventClick={onEventClick}
            eventDidMount={onEventDidMount}
            eventMouseEnter={(arg) => highlightEvent(arg.event.id, true)}
            eventMouseLeave={(arg) => highlightEvent(arg.event.id, false)}
          />
        ) : (
          <div className={styles.calLoading}>
            <span className={styles.spinner} aria-label="Loading calendar" />
          </div>
        )}
      </div>

      <div className={styles.legend}>
        <span className={styles.legendItem}><i className={styles.sPending} />Pending</span>
        <span className={styles.legendItem}><i className={styles.sConfirmed} />Confirmed</span>
        <span className={styles.legendItem}><i className={styles.sCompleted} />Completed</span>
        <span className={styles.legendItem}><i className={styles.sCancelled} />Cancelled</span>
      </div>

      {/* Booking detail */}
      <AdminModal
        open={selected !== null}
        onClose={() => setSelected(null)}
        title={selected?.clientName ?? ''}
        subtitle={selected ? `#${selected.id} · ${selected.tourName}` : undefined}
        wide
      >
        {selected ? <BookingDetail b={selected} /> : null}
      </AdminModal>
    </div>
  );
}

function BookingDetail({ b }: { b: AdminBooking }) {
  const driver = mockDrivers.find((d) => d.id === b.driverId);
  const multi = b.days > 1;
  const p = multi ? tourProgress(b) : null;
  const pct = p && p.state === 'active' ? Math.round((p.x / p.total) * 100) : p?.state === 'done' ? 100 : 0;

  return (
    <div className={styles.detail}>
      <div className={styles.detailBadges}>
        <StatusBadge kind="tour" value={b.tourStatus} />
        <StatusBadge kind="payment" value={b.paymentStatus} />
      </div>

      {multi && p ? (
        <div className={[styles.progress, styles[`prog${b.tourStatus[0]}${b.tourStatus.slice(1).toLowerCase()}`]].join(' ')}>
          <div className={styles.progressTop}>
            <span className={styles.progressLabel}>
              {p.state === 'active' ? `Day ${p.x} of ${p.total}` : p.state === 'upcoming' ? 'Upcoming' : 'Completed'}
            </span>
            <span className={styles.progressRange}>
              {formatDate(b.startDate)} → {formatDate(exclusiveEnd(b.startDate, b.days))}
            </span>
          </div>
          <div className={styles.progressTrack}>
            <span className={styles.progressFill} style={{ width: `${pct}%` }} />
          </div>
        </div>
      ) : null}

      <dl className={styles.detailGrid}>
        <div><dt>Dates</dt><dd>{formatDate(b.startDate)}{b.startTime ? ` · ${b.startTime}` : ''} · {b.days} day{b.days === 1 ? '' : 's'}</dd></div>
        <div><dt>Passengers</dt><dd>{b.passengers}</dd></div>
        <div><dt>Vehicle</dt><dd>{b.vehicleType}</dd></div>
        <div><dt>Total</dt><dd className={styles.price}>{formatUSD(b.totalPrice)}</dd></div>
        <div><dt>Driver / guide</dt><dd>{driver ? driver.name : 'Unassigned'}</dd></div>
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
