'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Icon from '@/components/ui/Icon/Icon';
import StatusBadge from '@/components/admin/StatusBadge/StatusBadge';
import StatusSelect from '@/components/admin/StatusSelect/StatusSelect';
import AdminModal from '@/components/admin/AdminModal/AdminModal';
import Toast, { type ToastState } from '@/components/admin/Toast/Toast';
import { formatUSD, formatDate } from '@/lib/format';
import {
  ApiError,
  deleteBooking,
  listBookings,
  updateBooking,
  type ApiBooking,
  type BookingStatus,
  type PaymentStatus,
} from '@/lib/bookingsApi';
import styles from './Bookings.module.scss';

const STATUSES: (BookingStatus | 'ALL')[] = ['ALL', 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'];
const DATE_FILTERS = ['ALL', 'UPCOMING', 'PAST'] as const;

const dayOf = (iso: string) => (iso ? iso.slice(0, 10) : '');
const waLink = (phone: string) => `https://wa.me/${phone.replace(/[^\d]/g, '')}`;

export default function BookingsClient() {
  const [bookings, setBookings] = useState<ApiBooking[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [driverNames, setDriverNames] = useState<string[]>([]);

  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<(typeof STATUSES)[number]>('ALL');
  const [dateFilter, setDateFilter] = useState<(typeof DATE_FILTERS)[number]>('ALL');

  const [selected, setSelected] = useState<ApiBooking | null>(null);
  const [notesDraft, setNotesDraft] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<ApiBooking | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const [toast, setToast] = useState<ToastState | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const showToast = useCallback((message: string, variant: ToastState['variant'] = 'success') => {
    setToast({ message, variant });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2800);
  }, []);
  useEffect(() => () => { if (toastTimer.current) clearTimeout(toastTimer.current); }, []);

  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);

  const load = useCallback(async () => {
    setLoadError(null);
    try {
      setBookings(await listBookings());
    } catch (err) {
      setBookings([]);
      setLoadError(
        err instanceof ApiError && err.status === 401
          ? 'Your session expired. Please sign in again.'
          : err instanceof Error
            ? err.message
            : 'Could not load bookings.',
      );
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  // Driver roster for the assignment dropdown (live from the drivers API).
  useEffect(() => {
    let active = true;
    fetch('/api/drivers', { credentials: 'include' })
      .then((r) => (r.ok ? r.json() : []))
      .then((list: { name?: string; status?: string }[]) => {
        if (active) {
          setDriverNames(
            list.filter((d) => d.status !== 'INACTIVE').map((d) => d.name ?? '').filter(Boolean),
          );
        }
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const list = bookings ?? [];
    const q = query.trim().toLowerCase();
    return list.filter((b) => {
      if (status !== 'ALL' && b.status !== status) return false;
      const day = dayOf(b.startDate);
      if (dateFilter === 'UPCOMING' && day < today) return false;
      if (dateFilter === 'PAST' && day >= today) return false;
      if (q) {
        const hay = `${b.fullName} ${b.email} ${b.phone}`.toLowerCase().replace(/\s/g, '');
        if (!hay.includes(q.replace(/\s/g, ''))) return false;
      }
      return true;
    });
  }, [bookings, query, status, dateFilter, today]);

  const setBookingStatus = async (b: ApiBooking, value: string) => {
    const next = value as BookingStatus;
    setUpdatingId(b.id);
    setBookings((prev) => prev?.map((x) => (x.id === b.id ? { ...x, status: next } : x)) ?? prev);
    try {
      await updateBooking(b.id, { status: next });
      showToast('Status updated.');
    } catch (err) {
      setBookings((prev) => prev?.map((x) => (x.id === b.id ? { ...x, status: b.status } : x)) ?? prev);
      showToast(err instanceof Error ? err.message : 'Update failed.', 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  const setPayment = async (b: ApiBooking, value: string) => {
    const next = value as PaymentStatus;
    setUpdatingId(b.id);
    setBookings((prev) => prev?.map((x) => (x.id === b.id ? { ...x, paymentStatus: next } : x)) ?? prev);
    try {
      await updateBooking(b.id, { paymentStatus: next });
      showToast('Payment updated.');
    } catch (err) {
      setBookings((prev) => prev?.map((x) => (x.id === b.id ? { ...x, paymentStatus: b.paymentStatus } : x)) ?? prev);
      showToast(err instanceof Error ? err.message : 'Update failed.', 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  const setDriver = async (b: ApiBooking, name: string) => {
    setUpdatingId(b.id);
    setBookings((prev) => prev?.map((x) => (x.id === b.id ? { ...x, driverName: name || null } : x)) ?? prev);
    try {
      await updateBooking(b.id, { driverName: name });
      showToast(name ? 'Driver assigned.' : 'Driver unassigned.');
    } catch (err) {
      setBookings((prev) => prev?.map((x) => (x.id === b.id ? { ...x, driverName: b.driverName } : x)) ?? prev);
      showToast(err instanceof Error ? err.message : 'Update failed.', 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  const openDetails = (b: ApiBooking) => {
    setSelected(b);
    setNotesDraft(b.adminNotes ?? '');
  };

  const saveNotes = async () => {
    if (!selected) return;
    setSavingNotes(true);
    try {
      const updated = await updateBooking(selected.id, { adminNotes: notesDraft });
      setBookings((prev) => prev?.map((x) => (x.id === selected.id ? updated : x)) ?? prev);
      showToast('Notes saved.');
      setSelected(null);
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Save failed.', 'error');
    } finally {
      setSavingNotes(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteBooking(deleteTarget.id);
      setBookings((prev) => prev?.filter((x) => x.id !== deleteTarget.id) ?? prev);
      showToast('Booking deleted.');
      setDeleteTarget(null);
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Delete failed.', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const exportCsv = () => {
    const headers = ['ID', 'Client', 'Phone', 'Email', 'Tour', 'Start', 'Days', 'Pax', 'Vehicle', 'Total', 'Payment', 'Status', 'Driver', 'Booked'];
    const rows = filtered.map((b) => [
      b.id, b.fullName, b.phone, b.email, b.tourTitle, dayOf(b.startDate), b.daysCount,
      b.passengers, b.vehicleType, b.totalPrice, b.paymentStatus, b.status, b.driverName ?? '', dayOf(b.createdAt),
    ]);
    const csv = [headers, ...rows]
      .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `wanderkartli-bookings-${today}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const total = bookings?.length ?? 0;

  return (
    <div className={styles.wrap}>
      <header className={styles.head}>
        <div>
          <h1 className={styles.title}>Bookings</h1>
          <p className={styles.sub}>
            {bookings === null ? 'Loading…' : `${filtered.length} of ${total} booking${total === 1 ? '' : 's'}`}
          </p>
        </div>
        <button className={styles.export} onClick={exportCsv} disabled={!bookings || bookings.length === 0}>
          <Icon name="download" size={17} />
          Export CSV
        </button>
      </header>

      <div className={styles.toolbar}>
        <div className={styles.searchWrap}>
          <Icon name="search" size={17} className={styles.searchIcon} />
          <input
            className={styles.search}
            placeholder="Search by name, email or phone…"
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

      {bookings === null ? (
        <div className={styles.stateBox}>
          <span className={styles.spinner} aria-label="Loading bookings" />
        </div>
      ) : loadError ? (
        <div className={styles.stateBox}>
          <p className={styles.stateText}>{loadError}</p>
          <button className={styles.retryBtn} onClick={() => void load()}>
            <Icon name="arrow-right" size={16} /> Try again
          </button>
        </div>
      ) : (
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
                <th aria-label="Actions" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((b) => (
                <tr key={b.id} className={styles.row} onClick={() => openDetails(b)}>
                  <td>
                    <span className={styles.client}>{b.fullName}</span>
                    <span className={styles.bookingId}>#{b.id.slice(0, 8)}</span>
                  </td>
                  <td onClick={(e) => e.stopPropagation()}>
                    <a className={styles.wa} href={waLink(b.phone)} target="_blank" rel="noopener noreferrer" title={`WhatsApp ${b.phone}`}>
                      <Icon name="whatsapp" size={16} />
                      <span className={styles.waPhone}>{b.phone}</span>
                    </a>
                  </td>
                  <td className={styles.tourCell} title={b.tourTitle}>{b.tourTitle}</td>
                  <td className={styles.nowrap}>
                    {formatDate(dayOf(b.startDate)).replace(/,?\s*\d{4}$/, '')} · {b.daysCount}d
                  </td>
                  <td>{b.passengers}</td>
                  <td className={styles.vehicleCell} title={b.vehicleType}>{b.vehicleType}</td>
                  <td className={styles.price}>{formatUSD(b.totalPrice)}</td>
                  <td onClick={(e) => e.stopPropagation()}>
                    <StatusSelect kind="payment" value={b.paymentStatus} onChange={(v) => void setPayment(b, v)} />
                  </td>
                  <td onClick={(e) => e.stopPropagation()}>
                    <StatusSelect kind="tour" value={b.status} onChange={(v) => void setBookingStatus(b, v)} />
                  </td>
                  <td onClick={(e) => e.stopPropagation()}>
                    <select
                      className={styles.driverSelect}
                      value={b.driverName ?? ''}
                      onChange={(e) => void setDriver(b, e.target.value)}
                      disabled={updatingId === b.id}
                    >
                      <option value="">Unassigned</option>
                      {b.driverName && !driverNames.includes(b.driverName) ? (
                        <option value={b.driverName}>{b.driverName}</option>
                      ) : null}
                      {driverNames.map((n) => (
                        <option key={n} value={n}>{n}</option>
                      ))}
                    </select>
                  </td>
                  <td onClick={(e) => e.stopPropagation()}>
                    <button
                      className={styles.deleteBtn}
                      onClick={() => setDeleteTarget(b)}
                      aria-label={`Delete booking for ${b.fullName}`}
                      title="Delete booking"
                      disabled={updatingId === b.id}
                    >
                      <Icon name="trash" size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={11} className={styles.empty}>
                    {total === 0 ? 'No bookings yet.' : 'No bookings match your filters.'}
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      )}

      {/* Details + notes */}
      <AdminModal
        open={selected !== null}
        onClose={() => (savingNotes ? undefined : setSelected(null))}
        title={selected?.fullName ?? ''}
        subtitle={selected ? `#${selected.id.slice(0, 8)} · ${selected.tourTitle}` : undefined}
        wide
        footer={
          selected ? (
            <>
              <button className={styles.ghostBtn} onClick={() => setSelected(null)} disabled={savingNotes}>Close</button>
              <button className={styles.primaryBtn} onClick={() => void saveNotes()} disabled={savingNotes}>
                {savingNotes ? 'Saving…' : 'Save notes'}
              </button>
            </>
          ) : null
        }
      >
        {selected ? (
          <div className={styles.details}>
            <div className={styles.detailBadges}>
              <StatusBadge kind="tour" value={selected.status} />
              <StatusBadge kind="payment" value={selected.paymentStatus} />
            </div>

            <dl className={styles.detailGrid}>
              <div><dt>Dates</dt><dd>{formatDate(dayOf(selected.startDate))} · {selected.daysCount} day{selected.daysCount === 1 ? '' : 's'}</dd></div>
              <div><dt>Passengers</dt><dd>{selected.passengers}</dd></div>
              <div><dt>Vehicle</dt><dd>{selected.vehicleType}</dd></div>
              <div><dt>Driver</dt><dd>{selected.driverName || 'Unassigned'}</dd></div>
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
              <div><dt>Booked</dt><dd>{formatDate(dayOf(selected.createdAt))}</dd></div>
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

      {/* Delete confirm */}
      <AdminModal
        open={deleteTarget !== null}
        onClose={() => (deleting ? undefined : setDeleteTarget(null))}
        title="Delete booking"
        subtitle={deleteTarget ? `${deleteTarget.fullName} · ${deleteTarget.tourTitle}` : undefined}
        footer={
          <>
            <button className={styles.ghostBtn} onClick={() => setDeleteTarget(null)} disabled={deleting}>Cancel</button>
            <button className={styles.dangerBtn} onClick={() => void confirmDelete()} disabled={deleting}>
              {deleting ? 'Deleting…' : 'Delete booking'}
            </button>
          </>
        }
      >
        <p className={styles.blockText}>
          This permanently removes the booking for <strong>{deleteTarget?.fullName}</strong>. This can’t be undone.
        </p>
      </AdminModal>

      <Toast toast={toast} />
    </div>
  );
}
