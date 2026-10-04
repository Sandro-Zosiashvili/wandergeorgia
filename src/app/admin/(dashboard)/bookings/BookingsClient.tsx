'use client';

import { useMemo, useState } from 'react';
import Icon from '@/components/ui/Icon/Icon';
import StatusBadge from '@/components/admin/StatusBadge/StatusBadge';
import AdminModal from '@/components/admin/AdminModal/AdminModal';
import {
  mockBookings,
  mockDrivers,
  waLink,
  type AdminBooking,
  type TourStatus,
} from '@/data/adminMock';
import { formatUSD, formatDate } from '@/lib/format';
import styles from './Bookings.module.scss';

const TODAY = '2026-10-04';
const STATUSES: (TourStatus | 'ALL')[] = ['ALL', 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'];
const DATE_FILTERS = ['ALL', 'UPCOMING', 'PAST'] as const;

export default function BookingsClient() {
  const [bookings, setBookings] = useState<AdminBooking[]>(mockBookings);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<(typeof STATUSES)[number]>('ALL');
  const [dateFilter, setDateFilter] = useState<(typeof DATE_FILTERS)[number]>('ALL');
  const [selected, setSelected] = useState<AdminBooking | null>(null);
  const [notesDraft, setNotesDraft] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return bookings.filter((b) => {
      if (status !== 'ALL' && b.tourStatus !== status) return false;
      if (dateFilter === 'UPCOMING' && b.startDate < TODAY) return false;
      if (dateFilter === 'PAST' && b.startDate >= TODAY) return false;
      if (q && !b.clientName.toLowerCase().includes(q) && !b.phone.replace(/\s/g, '').includes(q.replace(/\s/g, ''))) {
        return false;
      }
      return true;
    });
  }, [bookings, query, status, dateFilter]);

  const assignDriver = (bookingId: string, driverId: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, driverId: driverId || null } : b)),
    );
  };

  const openDetails = (b: AdminBooking) => {
    setSelected(b);
    setNotesDraft(b.adminNotes ?? '');
  };

  const saveNotes = () => {
    if (!selected) return;
    setBookings((prev) =>
      prev.map((b) => (b.id === selected.id ? { ...b, adminNotes: notesDraft } : b)),
    );
    setSelected(null);
  };

  const exportCsv = () => {
    const headers = ['ID', 'Client', 'Phone', 'Email', 'Tour', 'Start', 'Days', 'Pax', 'Vehicle', 'Total', 'Payment', 'Status', 'Driver'];
    const rows = filtered.map((b) => [
      b.id, b.clientName, b.phone, b.email, b.tourName, b.startDate, b.days, b.passengers,
      b.vehicleType, b.totalPrice, b.paymentStatus, b.tourStatus,
      mockDrivers.find((d) => d.id === b.driverId)?.name ?? '',
    ]);
    const csv = [headers, ...rows]
      .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `wanderkartli-bookings-${TODAY}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={styles.wrap}>
      <header className={styles.head}>
        <div>
          <h1 className={styles.title}>Bookings</h1>
          <p className={styles.sub}>
            {filtered.length} of {bookings.length} bookings
          </p>
        </div>
        <button className={styles.export} onClick={exportCsv}>
          <Icon name="download" size={17} />
          Export CSV
        </button>
      </header>

      <div className={styles.toolbar}>
        <div className={styles.searchWrap}>
          <Icon name="search" size={17} className={styles.searchIcon} />
          <input
            className={styles.search}
            placeholder="Search by name or phone…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <select className={styles.select} value={status} onChange={(e) => setStatus(e.target.value as typeof status)}>
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s === 'ALL' ? 'All statuses' : s.charAt(0) + s.slice(1).toLowerCase()}</option>
          ))}
        </select>
        <select className={styles.select} value={dateFilter} onChange={(e) => setDateFilter(e.target.value as typeof dateFilter)}>
          <option value="ALL">All dates</option>
          <option value="UPCOMING">Upcoming</option>
          <option value="PAST">Past</option>
        </select>
      </div>

      <div className={styles.tableScroll}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Client</th>
              <th>Contact</th>
              <th>Tour</th>
              <th>Date · Days</th>
              <th>Pax</th>
              <th>Vehicle</th>
              <th>Total</th>
              <th>Payment</th>
              <th>Status</th>
              <th>Driver</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((b) => (
              <tr key={b.id} className={styles.row} onClick={() => openDetails(b)}>
                <td>
                  <span className={styles.client}>{b.clientName}</span>
                  <span className={styles.bookingId}>#{b.id}</span>
                </td>
                <td onClick={(e) => e.stopPropagation()}>
                  <a className={styles.wa} href={waLink(b.phone)} target="_blank" rel="noopener noreferrer" title="WhatsApp">
                    <Icon name="whatsapp" size={16} />
                    <span className={styles.waPhone}>{b.phone}</span>
                  </a>
                </td>
                <td className={styles.tourCell}>{b.tourName}</td>
                <td className={styles.nowrap}>
                  {formatDate(b.startDate)} · {b.days}d
                </td>
                <td>{b.passengers}</td>
                <td className={styles.nowrap}>{b.vehicleType}</td>
                <td className={styles.price}>{formatUSD(b.totalPrice)}</td>
                <td><StatusBadge kind="payment" value={b.paymentStatus} /></td>
                <td><StatusBadge kind="tour" value={b.tourStatus} /></td>
                <td onClick={(e) => e.stopPropagation()}>
                  <select
                    className={styles.driverSelect}
                    value={b.driverId ?? ''}
                    onChange={(e) => assignDriver(b.id, e.target.value)}
                  >
                    <option value="">Unassigned</option>
                    {mockDrivers.map((d) => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={10} className={styles.empty}>No bookings match your filters.</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <AdminModal
        open={selected !== null}
        onClose={() => setSelected(null)}
        title={selected?.clientName ?? ''}
        subtitle={selected ? `#${selected.id} · ${selected.tourName}` : undefined}
        wide
        footer={
          selected ? (
            <>
              <button className={styles.ghostBtn} onClick={() => setSelected(null)}>Close</button>
              <button className={styles.primaryBtn} onClick={saveNotes}>Save notes</button>
            </>
          ) : null
        }
      >
        {selected ? (
          <div className={styles.details}>
            <div className={styles.detailBadges}>
              <StatusBadge kind="tour" value={selected.tourStatus} />
              <StatusBadge kind="payment" value={selected.paymentStatus} />
            </div>

            <dl className={styles.detailGrid}>
              <div><dt>Dates</dt><dd>{formatDate(selected.startDate)} · {selected.days} day{selected.days === 1 ? '' : 's'}</dd></div>
              <div><dt>Passengers</dt><dd>{selected.passengers}</dd></div>
              <div><dt>Vehicle</dt><dd>{selected.vehicleType}</dd></div>
              <div><dt>Total</dt><dd className={styles.detailPrice}>{formatUSD(selected.totalPrice)}</dd></div>
              <div><dt>Email</dt><dd><a href={`mailto:${selected.email}`}>{selected.email}</a></dd></div>
              <div>
                <dt>Phone</dt>
                <dd>
                  <a className={styles.waInline} href={waLink(selected.phone)} target="_blank" rel="noopener noreferrer">
                    <Icon name="whatsapp" size={15} /> {selected.phone}
                  </a>
                </dd>
              </div>
            </dl>

            <div className={styles.block}>
              <span className={styles.blockLabel}>Special requests</span>
              <p className={styles.blockText}>{selected.specialRequests || '—'}</p>
            </div>

            <label className={styles.block}>
              <span className={styles.blockLabel}>Admin notes</span>
              <textarea
                className={styles.notes}
                rows={3}
                value={notesDraft}
                onChange={(e) => setNotesDraft(e.target.value)}
                placeholder="Internal notes about this booking…"
              />
            </label>
          </div>
        ) : null}
      </AdminModal>
    </div>
  );
}
