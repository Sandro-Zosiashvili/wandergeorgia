'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Icon from '@/components/ui/Icon/Icon';
import Toggle from '@/components/admin/Toggle/Toggle';
import AdminModal from '@/components/admin/AdminModal/AdminModal';
import Toast, { type ToastState } from '@/components/admin/Toast/Toast';
import { formatUSD } from '@/lib/format';
import {
  ApiError,
  createTour,
  deleteTour,
  listTours,
  revalidateTours,
  updateTour,
  type ApiTour,
} from '@/lib/toursApi';
import TourFormDrawer, {
  blankTourForm,
  toFormDay,
  toTourInput,
  type TourFormState,
} from './TourFormDrawer';
import styles from './Tours.module.scss';

const formFromTour = (t: ApiTour): TourFormState => ({
  title: t.title,
  slug: t.slug,
  type: t.type,
  location: t.location,
  duration: t.duration,
  basePrice: t.basePrice,
  overview: t.overview,
  highlights: [...t.highlights],
  included: [...t.included],
  excluded: [...t.excluded],
  itinerary: t.itinerary.map((d) => toFormDay(d)),
  coverImage: t.coverImage,
  gallery: [...t.gallery],
  isActive: t.isActive,
});

export default function ToursClient() {
  const [tours, setTours] = useState<ApiTour[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Editor drawer
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mode, setMode] = useState<'create' | 'edit'>('create');
  const [editing, setEditing] = useState<ApiTour | null>(null);
  const [seed, setSeed] = useState<TourFormState>(blankTourForm);
  const [seedKey, setSeedKey] = useState(0);
  const [saving, setSaving] = useState(false);

  // Delete confirm
  const [deleteTarget, setDeleteTarget] = useState<ApiTour | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Inline toggle in-flight guard
  const [togglingId, setTogglingId] = useState<string | null>(null);

  // Toast
  const [toast, setToast] = useState<ToastState | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const showToast = useCallback((message: string, variant: ToastState['variant'] = 'success') => {
    setToast({ message, variant });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2800);
  }, []);
  useEffect(() => () => { if (toastTimer.current) clearTimeout(toastTimer.current); }, []);

  const load = useCallback(async () => {
    setLoadError(null);
    try {
      const data = await listTours();
      setTours(data);
    } catch (err) {
      setTours([]);
      setLoadError(
        err instanceof ApiError && err.status === 401
          ? 'Your session expired. Please sign in again.'
          : err instanceof Error
            ? err.message
            : 'Could not load tours.',
      );
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const openCreate = () => {
    setMode('create');
    setEditing(null);
    setSeed(blankTourForm());
    setSeedKey((k) => k + 1);
    setDrawerOpen(true);
  };

  const openEdit = (t: ApiTour) => {
    setMode('edit');
    setEditing(t);
    setSeed(formFromTour(t));
    setSeedKey((k) => k + 1);
    setDrawerOpen(true);
  };

  const handleSubmit = async (form: TourFormState) => {
    setSaving(true);
    try {
      const input = toTourInput(form);
      if (mode === 'create') {
        await createTour(input);
        showToast('Tour created.');
      } else if (editing) {
        await updateTour(editing.id, input);
        showToast('Changes saved.');
      }
      setDrawerOpen(false);
      await load(); // re-sync list with the DB
      await revalidateTours(); // purge public caches BEFORE we finish (instant for visitors)
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Save failed.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (t: ApiTour, next: boolean) => {
    setTogglingId(t.id);
    // Optimistic update for a snappy toggle.
    setTours((prev) => prev?.map((x) => (x.id === t.id ? { ...x, isActive: next } : x)) ?? prev);
    try {
      await updateTour(t.id, { isActive: next });
      await revalidateTours(); // hidden/shown on the public site immediately
      showToast(next ? 'Tour activated.' : 'Tour hidden.');
    } catch (err) {
      // Roll back on failure.
      setTours((prev) => prev?.map((x) => (x.id === t.id ? { ...x, isActive: !next } : x)) ?? prev);
      showToast(err instanceof Error ? err.message : 'Update failed.', 'error');
    } finally {
      setTogglingId(null);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteTour(deleteTarget.id);
      showToast('Tour deleted.');
      setDeleteTarget(null);
      await load();
      await revalidateTours(); // purge public caches BEFORE we finish (instant for visitors)
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Delete failed.', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const activeCount = tours?.filter((t) => t.isActive).length ?? 0;
  const total = tours?.length ?? 0;

  return (
    <div className={styles.wrap}>
      <header className={styles.head}>
        <div>
          <h1 className={styles.title}>Tours</h1>
          <p className={styles.sub}>
            {tours === null
              ? 'Loading…'
              : `${activeCount} of ${total} tour${total === 1 ? '' : 's'} active on the website`}
          </p>
        </div>
        <button className={styles.addBtn} onClick={openCreate}>
          <Icon name="plus" size={17} />
          Add new tour
        </button>
      </header>

      {tours === null ? (
        <div className={styles.stateBox}>
          <span className={styles.spinner} aria-label="Loading tours" />
        </div>
      ) : loadError ? (
        <div className={styles.stateBox}>
          <p className={styles.stateText}>{loadError}</p>
          <button className={styles.retryBtn} onClick={() => void load()}>
            <Icon name="arrow-right" size={16} /> Try again
          </button>
        </div>
      ) : tours.length === 0 ? (
        <div className={styles.stateBox}>
          <p className={styles.stateText}>No tours yet. Create your first one.</p>
          <button className={styles.retryBtn} onClick={openCreate}>
            <Icon name="plus" size={16} /> Add new tour
          </button>
        </div>
      ) : (
        <div className={styles.list}>
          <div className={[styles.row, styles.headerRow].join(' ')}>
            <span>Tour</span>
            <span className={styles.colType}>Type</span>
            <span className={styles.colPrice}>Base price</span>
            <span className={styles.colActive}>Active</span>
            <span className={styles.colActions}>Actions</span>
          </div>

          {tours.map((t) => (
            <div key={t.id} className={styles.row}>
              <div className={styles.tourInfo}>
                <span className={styles.tourName}>{t.title}</span>
                <span className={styles.tourCity}>
                  <Icon name="map-pin" size={13} /> {t.location || '—'}
                </span>
              </div>

              <div className={styles.metaGroup}>
                <span className={[styles.typeBadge, styles.colType].join(' ')}>
                  {t.type === 'multi-day' ? 'Multi-day' : 'Day tour'}
                </span>
                <span className={[styles.price, styles.colPrice].join(' ')}>{formatUSD(t.basePrice)}</span>
              </div>

              <div className={[styles.toggleCell, styles.colActive].join(' ')}>
                <Toggle
                  checked={t.isActive}
                  onChange={(v) => void handleToggleActive(t, v)}
                  disabled={togglingId === t.id}
                  label={`Toggle ${t.title}`}
                />
                <span className={t.isActive ? styles.on : styles.off}>
                  {t.isActive ? 'Active' : 'Hidden'}
                </span>
              </div>

              <div className={[styles.actions, styles.colActions].join(' ')}>
                <button
                  className={styles.actionBtn}
                  onClick={() => openEdit(t)}
                  aria-label={`Edit ${t.title}`}
                  title="Edit"
                >
                  <Icon name="pencil" size={16} />
                </button>
                <button
                  className={[styles.actionBtn, styles.deleteBtn].join(' ')}
                  onClick={() => setDeleteTarget(t)}
                  aria-label={`Delete ${t.title}`}
                  title="Delete"
                >
                  <Icon name="trash" size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <TourFormDrawer
        key={seedKey}
        open={drawerOpen}
        mode={mode}
        initial={seed}
        saving={saving}
        onCancel={() => setDrawerOpen(false)}
        onSubmit={(form) => void handleSubmit(form)}
      />

      <AdminModal
        open={deleteTarget !== null}
        onClose={() => (deleting ? undefined : setDeleteTarget(null))}
        title="Delete tour"
        subtitle={deleteTarget ? deleteTarget.title : undefined}
        footer={
          <>
            <button className={styles.ghostBtn} onClick={() => setDeleteTarget(null)} disabled={deleting}>
              Cancel
            </button>
            <button className={styles.dangerBtn} onClick={() => void confirmDelete()} disabled={deleting}>
              {deleting ? 'Deleting…' : 'Delete tour'}
            </button>
          </>
        }
      >
        <p className={styles.confirmText}>
          This permanently removes <strong>{deleteTarget?.title}</strong> from the catalog. This can’t be undone.
        </p>
      </AdminModal>

      <Toast toast={toast} />
    </div>
  );
}
