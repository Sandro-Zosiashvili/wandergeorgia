'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import type { EventClickArg, EventContentArg, EventInput, MoreLinkArg } from '@fullcalendar/core';
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

/** True if the booking is running on the given 'YYYY-MM-DD' day (ISO strings sort lexically). */
function occursOn(b: AdminBooking, dayKey: string): boolean {
  return dayKey >= b.startDate && dayKey < exclusiveEnd(b.startDate, b.days);
}

export default function CalendarClient() {
  const calRef = useRef<FullCalendar>(null);
  const [selected, setSelected] = useState<AdminBooking | null>(null);
  const [dayKey, setDayKey] = useState<string | null>(null);
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
        classNames: ['evt', `evt-${b.tourStatus.toLowerCase()}`],
        extendedProps: { booking: b },
      })),
    [filtered],
  );

  const dayBookings = useMemo(
    () => (dayKey ? filtered.filter((b) => occursOn(b, dayKey)).sort((a, b) => (a.startTime ?? '').localeCompare(b.startTime ?? '')) : []),
    [dayKey, filtered],
  );

  const changeView = (v: CalView) => {
    setView(v);
    calRef.current?.getApi().changeView(v);
  };

  const onEventClick = (arg: EventClickArg) => {
    setSelected(arg.event.extendedProps.booking as AdminBooking);
  };

  // Replace the native "+ more" popover with a clean day-agenda drawer.
  // FullCalendar opens its own popover unless the handler returns a truthy,
  // non-string value, so we return a marker object to suppress it.
  const onMoreLinkClick = (arg: MoreLinkArg) => {
    setDayKey(toKey(arg.date));
    return { handled: true } as unknown as void;
  };

  const renderEvent = (arg: EventContentArg) => {
    const b = arg.event.extendedProps.booking as AdminBooking;
    const dn = driverName(b.driverId);
    return (
      <div className={styles.evtInner}>
        <span className={styles.evtDot} aria-hidden="true" />
        {b.startTime ? <span className={styles.evtTime}>{b.startTime}</span> : null}
        <span className={styles.evtName}>{b.tourName}</span>
        {dn ? <span className={styles.evtDriver}>· {dn}</span> : null}
      </div>
    );
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

      <div
        className={[
          styles.fcWrap,
          view === 'listMonth' ? styles.listMode : '',
          view === 'dayGridWeek' ? styles.weekMode : '',
        ].filter(Boolean).join(' ')}
      >
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
            dayMaxEvents={2}
            moreLinkText={(n) => `+${n} more`}
            moreLinkClick={onMoreLinkClick}
            displayEventTime={false}
            dayHeaderFormat={{ weekday: 'short' }}
            noEventsText="No tours match these filters"
            events={events}
            eventContent={renderEvent}
            eventClick={onEventClick}
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

      {/* Day agenda drawer (opened from "+X more") */}
      <AdminModal
        open={dayKey !== null}
        onClose={() => setDayKey(null)}
        title={dayKey ? formatDate(dayKey) : ''}
        subtitle={dayKey ? `${dayBookings.length} tour${dayBookings.length === 1 ? '' : 's'} scheduled` : undefined}
      >
        <ul className={styles.agenda}>
          {dayBookings.map((b) => (
            <li key={b.id}>
              <button
                className={[styles.agendaRow, styles[`row${b.tourStatus[0]}${b.tourStatus.slice(1).toLowerCase()}`]].join(' ')}
                onClick={() => { setDayKey(null); setSelected(b); }}
              >
                <span className={styles.agendaTime}>{b.startTime ?? '—'}</span>
                <span className={styles.agendaBody}>
                  <span className={styles.agendaName}>{b.tourName}</span>
                  <span className={styles.agendaMeta}>
                    {b.clientName} · {driverName(b.driverId) || 'Unassigned'} · {b.passengers} pax
                  </span>
                </span>
                <StatusBadge kind="tour" value={b.tourStatus} />
              </button>
            </li>
          ))}
        </ul>
      </AdminModal>

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
  return (
    <div className={styles.detail}>
      <div className={styles.detailBadges}>
        <StatusBadge kind="tour" value={b.tourStatus} />
        <StatusBadge kind="payment" value={b.paymentStatus} />
      </div>
      <dl className={styles.detailGrid}>
        <div><dt>Dates</dt><dd>{formatDate(b.startDate)}{b.startTime ? ` · ${b.startTime}` : ''} · {b.days} day{b.days === 1 ? '' : 's'}</dd></div>
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
