'use client';

/* eslint-disable @next/next/no-img-element -- admin-only external media previews; next/image can't optimize arbitrary URLs here. */

import { useCallback, useEffect, useRef, useState } from 'react';
import Icon from '@/components/ui/Icon/Icon';
import Toggle from '@/components/admin/Toggle/Toggle';
import AdminModal from '@/components/admin/AdminModal/AdminModal';
import Toast, { type ToastState } from '@/components/admin/Toast/Toast';
import {
  ApiError,
  createMemory,
  deleteMemory,
  listMemories,
  revalidateMemories,
  updateMemory,
  type ApiMemory,
} from '@/lib/memoriesApi';
import MemoryFormDrawer, {
  blankMemoryForm,
  toMemoryInput,
  type MemoryFormState,
} from './MemoryFormDrawer';
import styles from './Memories.module.scss';

const formFromMemory = (m: ApiMemory): MemoryFormState => ({
  type: m.type,
  mediaUrl: m.mediaUrl,
  thumbnailUrl: m.thumbnailUrl,
  tourTitle: m.tourTitle,
  caption: m.caption,
  travelerName: m.travelerName,
  country: m.country,
  date: m.date || new Date().toISOString().slice(0, 10),
  isActive: m.isActive,
});

const dateFmt = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
const fmtDate = (iso: string) => {
  if (!iso) return '—';
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso : dateFmt.format(d);
};

export default function MemoriesClient() {
  const [memories, setMemories] = useState<ApiMemory[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [tourTitles, setTourTitles] = useState<string[]>([]);

  // Editor drawer
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mode, setMode] = useState<'create' | 'edit'>('create');
  const [editing, setEditing] = useState<ApiMemory | null>(null);
  const [seed, setSeed] = useState<MemoryFormState>(blankMemoryForm);
  const [seedKey, setSeedKey] = useState(0);
  const [saving, setSaving] = useState(false);

  // Delete confirm
  const [deleteTarget, setDeleteTarget] = useState<ApiMemory | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Inline toggle guard
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
      const data = await listMemories();
      setMemories(data);
    } catch (err) {
      setMemories([]);
      setLoadError(
        err instanceof ApiError && err.status === 401
          ? 'Your session expired. Please sign in again.'
          : err instanceof Error
            ? err.message
            : 'Could not load memories.',
      );
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  // Tour titles for the form's datalist (best-effort, from the public API).
  useEffect(() => {
    let active = true;
    fetch('/api/public/tours')
      .then((r) => (r.ok ? r.json() : []))
      .then((tours: { title?: string }[]) => {
        if (active) setTourTitles(tours.map((t) => t.title ?? '').filter(Boolean));
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const openCreate = () => {
    setMode('create');
    setEditing(null);
    setSeed(blankMemoryForm());
    setSeedKey((k) => k + 1);
    setDrawerOpen(true);
  };

  const openEdit = (m: ApiMemory) => {
    setMode('edit');
    setEditing(m);
    setSeed(formFromMemory(m));
    setSeedKey((k) => k + 1);
    setDrawerOpen(true);
  };

  const handleSubmit = async (form: MemoryFormState) => {
    setSaving(true);
    try {
      const input = toMemoryInput(form);
      if (mode === 'create') {
        await createMemory(input);
        showToast('Moment created.');
      } else if (editing) {
        await updateMemory(editing.id, input);
        showToast('Changes saved.');
      }
      setDrawerOpen(false);
      await load();
      await revalidateMemories();
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Save failed.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (m: ApiMemory, next: boolean) => {
    setTogglingId(m.id);
    setMemories((prev) => prev?.map((x) => (x.id === m.id ? { ...x, isActive: next } : x)) ?? prev);
    try {
      await updateMemory(m.id, { isActive: next });
      await revalidateMemories();
      showToast(next ? 'Moment shown.' : 'Moment hidden.');
    } catch (err) {
      setMemories((prev) => prev?.map((x) => (x.id === m.id ? { ...x, isActive: !next } : x)) ?? prev);
      showToast(err instanceof Error ? err.message : 'Update failed.', 'error');
    } finally {
      setTogglingId(null);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteMemory(deleteTarget.id);
      showToast('Moment deleted.');
      setDeleteTarget(null);
      await load();
      await revalidateMemories();
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Delete failed.', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const total = memories?.length ?? 0;
  const activeCount = memories?.filter((m) => m.isActive).length ?? 0;

  const renderRow = (m: ApiMemory) => {
    const preview = m.thumbnailUrl || m.mediaUrl;
    return (
      <div key={m.id} className={styles.row}>
        <div className={styles.media}>
          {preview ? (
            <img className={styles.thumb} src={preview} alt="" loading="lazy" />
          ) : (
            <span className={styles.thumbEmpty}>
              <Icon name="images" size={18} />
            </span>
          )}
          {m.type === 'video' ? (
            <span className={styles.playBadge} aria-hidden="true">
              <Icon name="play" size={13} />
            </span>
          ) : null}
        </div>

        <div className={styles.info}>
          <span className={styles.tour}>
            <Icon name="map-pin" size={13} /> {m.tourTitle || '—'}
          </span>
          <span className={styles.caption}>{m.caption || '—'}</span>
          <span className={styles.traveler}>
            {m.travelerName || '—'}
            {m.country ? <span className={styles.country}> · {m.country}</span> : null}
          </span>
        </div>

        <span className={[styles.typeBadge, styles.colType, m.type === 'video' ? styles.video : ''].filter(Boolean).join(' ')}>
          <Icon name={m.type === 'video' ? 'play' : 'images'} size={12} />
          {m.type === 'video' ? 'Video' : 'Photo'}
        </span>

        <span className={[styles.date, styles.colDate].join(' ')}>{fmtDate(m.date)}</span>

        <div className={[styles.toggleCell, styles.colActive].join(' ')}>
          <Toggle
            checked={m.isActive}
            onChange={(v) => void handleToggleActive(m, v)}
            disabled={togglingId === m.id}
            label={`Toggle ${m.tourTitle || 'moment'}`}
          />
          <span className={m.isActive ? styles.on : styles.off}>{m.isActive ? 'Visible' : 'Hidden'}</span>
        </div>

        <div className={[styles.actions, styles.colActions].join(' ')}>
          <button className={styles.actionBtn} onClick={() => openEdit(m)} aria-label="Edit moment" title="Edit">
            <Icon name="pencil" size={16} />
          </button>
          <button
            className={[styles.actionBtn, styles.deleteBtn].join(' ')}
            onClick={() => setDeleteTarget(m)}
            aria-label="Delete moment"
            title="Delete"
          >
            <Icon name="trash" size={16} />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.wrap}>
      <header className={styles.head}>
        <div>
          <h1 className={styles.title}>Memories</h1>
          <p className={styles.sub}>
            {memories === null
              ? 'Loading…'
              : `${activeCount} of ${total} moment${total === 1 ? '' : 's'} visible on the website`}
          </p>
        </div>
        <button className={styles.addBtn} onClick={openCreate}>
          <Icon name="plus" size={17} />
          Add moment
        </button>
      </header>

      {memories === null ? (
        <div className={styles.stateBox}>
          <span className={styles.spinner} aria-label="Loading memories" />
        </div>
      ) : loadError ? (
        <div className={styles.stateBox}>
          <p className={styles.stateText}>{loadError}</p>
          <button className={styles.retryBtn} onClick={() => void load()}>
            <Icon name="arrow-right" size={16} /> Try again
          </button>
        </div>
      ) : memories.length === 0 ? (
        <div className={styles.stateBox}>
          <p className={styles.stateText}>No moments yet. Add your first one.</p>
          <button className={styles.retryBtn} onClick={openCreate}>
            <Icon name="plus" size={16} /> Add moment
          </button>
        </div>
      ) : (
        <div className={styles.list}>
          <div className={[styles.row, styles.headerRow].join(' ')}>
            <span>Media</span>
            <span>Moment</span>
            <span className={styles.colType}>Type</span>
            <span className={styles.colDate}>Date</span>
            <span className={styles.colActive}>Visible</span>
            <span className={styles.colActions}>Actions</span>
          </div>
          {memories.map(renderRow)}
        </div>
      )}

      <MemoryFormDrawer
        key={seedKey}
        open={drawerOpen}
        mode={mode}
        initial={seed}
        saving={saving}
        tourTitles={tourTitles}
        onCancel={() => setDrawerOpen(false)}
        onSubmit={(form) => void handleSubmit(form)}
      />

      <AdminModal
        open={deleteTarget !== null}
        onClose={() => (deleting ? undefined : setDeleteTarget(null))}
        title="Delete moment"
        subtitle={deleteTarget ? deleteTarget.tourTitle || deleteTarget.travelerName : undefined}
        footer={
          <>
            <button className={styles.ghostBtn} onClick={() => setDeleteTarget(null)} disabled={deleting}>
              Cancel
            </button>
            <button className={styles.dangerBtn} onClick={() => void confirmDelete()} disabled={deleting}>
              {deleting ? 'Deleting…' : 'Delete moment'}
            </button>
          </>
        }
      >
        <p className={styles.confirmText}>
          This permanently removes this moment from the gallery. This can’t be undone.
        </p>
      </AdminModal>

      <Toast toast={toast} />
    </div>
  );
}
