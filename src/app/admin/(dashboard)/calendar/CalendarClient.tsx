'use client';

import { useEffect, useMemo, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import type { EventClickArg, EventInput, EventMountArg } from '@fullcalendar/core';
import Icon from '@/components/ui/Icon/Icon';
import StatusBadge from '@/components/admin/StatusBadge/StatusBadge';
import AdminModal from '@/components/admin/AdminModal/AdminModal';
import { mockBookings, mockDrivers, waLink, type AdminBooking } from '@/data/adminMock';
import { formatUSD, formatDate } from '@/lib/format';
import styles from './Calendar.module.scss';

const pad = (n: number) => String(n).padStart(2, '0');
const driverName = (id: string | null) => (id ? mockDrivers.find((d) => d.id === id)?.name ?? '' : '');

/** Exclusive end date (FullCalendar convention) = start + days. */
function exclusiveEnd(startStr: string, days: number): string {
  const [y, m, d] = startStr.split('-').map(Number) as [number, number, number];
  const end = new Date(y, m - 1, d + Math.max(1, days));
  return `${end.getFullYear()}-${pad(end.getMonth() + 1)}-${pad(end.getDate())}`;
}

export default function CalendarClient() {
  const [selected, setSelected] = useState<AdminBooking | null>(null);
  // FullCalendar touches the DOM, so only render it on the client.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const events = useMemo<EventInput[]>(
    () =>
      mockBookings.map((b) => ({
        id: b.id,
        title: b.tourName,
        start: b.startDate,
        end: exclusiveEnd(b.startDate, b.days),
        allDay: true,
        classNames: ['evt', `evt-${b.tourStatus.toLowerCase()}`],
        extendedProps: { booking: b },
      })),
    [],
  );

  const onEventClick = (arg: EventClickArg) => {
    setSelected(arg.event.extendedProps.booking as AdminBooking);
  };

  const onEventMount = (arg: EventMountArg) => {
    const b = arg.event.extendedProps.booking as AdminBooking;
    arg.el.title = `${b.clientName} · ${driverName(b.driverId) || 'Unassigned'} · ${b.passengers} pax`;
  };

  return (
    <div className={styles.wrap}>
      <header className={styles.head}>
        <div>
          <h1 className={styles.title}>Calendar</h1>
          <p className={styles.sub}>Scheduled tours by date</p>
        </div>
      </header>

      <div className={styles.fcWrap}>
        {mounted ? (
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            initialDate="2026-10-01"
            firstDay={1}
            headerToolbar={{ left: 'prev,next today', center: 'title', right: 'dayGridMonth,timeGridWeek' }}
            buttonText={{ today: 'Today', month: 'Month', week: 'Week' }}
            height="auto"
            dayMaxEvents={2}
            displayEventTime={false}
            dayHeaderFormat={{ weekday: 'short' }}
            events={events}
            eventClick={onEventClick}
            eventDidMount={onEventMount}
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
