'use client';

/* eslint-disable @next/next/no-img-element -- admin-only external photo previews; next/image can't optimize arbitrary URLs here. */

import { useCallback, useEffect, useRef, useState } from 'react';
import Icon from '@/components/ui/Icon/Icon';
import StatusBadge from '@/components/admin/StatusBadge/StatusBadge';
import AdminDrawer from '@/components/admin/AdminDrawer/AdminDrawer';
import AdminModal from '@/components/admin/AdminModal/AdminModal';
import Toggle from '@/components/admin/Toggle/Toggle';
import Toast, { type ToastState } from '@/components/admin/Toast/Toast';
import {
  ApiError,
  createDriver,
  deleteDriver,
  listDrivers,
  updateDriver,
  type ApiDriver,
  type DriverStatus,
} from '@/lib/driversApi';
import styles from './Drivers.module.scss';

const STATUSES: DriverStatus[] = ['ACTIVE', 'ON_TOUR', 'INACTIVE'];
const waLink = (phone: string) => `https://wa.me/${phone.replace(/[^\d]/g, '')}`;

interface TourOption {
  id: string;
  title: string;
  type: 'one-day' | 'multi-day';
}

interface DriverFormState {
  name: string;
  phone: string;
  photo: string;
  bio: string;
  vehicleModel: string;
  plate: string;
  capacity: number;
  status: DriverStatus;
  isActive: boolean;
  tourIds: string[];
}

const BLANK: DriverFormState = {
  name: '', phone: '', photo: '', bio: '', vehicleModel: '', plate: '',
  capacity: 4, status: 'ACTIVE', isActive: true, tourIds: [],
};

const formFromDriver = (d: ApiDriver): DriverFormState => ({
  name: d.name, phone: d.phone, photo: d.photo, bio: d.bio,
  vehicleModel: d.vehicleModel, plate: d.plate, capacity: d.capacity,
  status: d.status, isActive: d.isActive, tourIds: d.tours.map((t) => t.id),
});

const initials = (name: string) => name.split(' ').map((p) => p[0]).slice(0, 2).join('');

export default function DriversClient() {
  const [drivers, setDrivers] = useState<ApiDriver[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [tourOptions, setTourOptions] = useState<TourOption[]>([]);

  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<'create' | 'edit'>('create');
  const [editing, setEditing] = useState<ApiDriver | null>(null);
  const [form, setForm] = useState<DriverFormState>(BLANK);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<ApiDriver | null>(null);
  const [deleting, setDeleting] = useState(false);

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
      setDrivers(await listDrivers());
    } catch (err) {
      setDrivers([]);
      setLoadError(
        err instanceof ApiError && err.status === 401
          ? 'Your session expired. Please sign in again.'
          : err instanceof Error ? err.message : 'Could not load drivers.',
      );
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  // Tour options for assignment (all tours, admin view).
  useEffect(() => {
    let active = true;
    fetch('/api/tours', { credentials: 'include' })
      .then((r) => (r.ok ? r.json() : []))
      .then((tours: { id: string; title: string; type: 'one-day' | 'multi-day' }[]) => {
        if (active) setTourOptions(tours.map((t) => ({ id: t.id, title: t.title, type: t.type })));
      })
      .catch(() => {});
    return () => { active = false; };
  }, []);

  const set = <K extends keyof DriverFormState>(key: K, value: DriverFormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const toggleTour = (id: string) =>
    setForm((f) => ({
      ...f,
      tourIds: f.tourIds.includes(id) ? f.tourIds.filter((x) => x !== id) : [...f.tourIds, id],
    }));

  const openCreate = () => {
    setMode('create'); setEditing(null); setForm(BLANK); setFormError(null); setOpen(true);
  };
  const openEdit = (d: ApiDriver) => {
    setMode('edit'); setEditing(d); setForm(formFromDriver(d)); setFormError(null); setOpen(true);
  };

  const save = async () => {
    if (!form.name.trim()) {
      setFormError('A driver name is required.');
      return;
    }
    setSaving(true);
    try {
      const input = {
        name: form.name.trim(), phone: form.phone.trim(), photo: form.photo.trim(),
        bio: form.bio.trim(), vehicleModel: form.vehicleModel.trim(), plate: form.plate.trim(),
        capacity: form.capacity, status: form.status, isActive: form.isActive, tourIds: form.tourIds,
      };
      if (mode === 'create') { await createDriver(input); showToast('Driver added.'); }
      else if (editing) { await updateDriver(editing.id, input); showToast('Changes saved.'); }
      setOpen(false);
      await load();
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Save failed.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteDriver(deleteTarget.id);
      setDrivers((prev) => prev?.filter((x) => x.id !== deleteTarget.id) ?? prev);
      showToast('Driver deleted.');
      setDeleteTarget(null);
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Delete failed.', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const total = drivers?.length ?? 0;

  return (
    <div className={styles.wrap}>
      <header className={styles.head}>
        <div>
          <h1 className={styles.title}>Drivers</h1>
          <p className={styles.sub}>
            {drivers === null ? 'Loading…' : `${total} driver${total === 1 ? '' : 's'} in the fleet`}
          </p>
        </div>
        <button className={styles.addBtn} onClick={openCreate}>
          <Icon name="plus" size={17} />
          Add driver
        </button>
      </header>

      {drivers === null ? (
        <div className={styles.stateBox}><span className={styles.spinner} aria-label="Loading drivers" /></div>
      ) : loadError ? (
        <div className={styles.stateBox}>
          <p className={styles.stateText}>{loadError}</p>
          <button className={styles.retryBtn} onClick={() => void load()}>
            <Icon name="arrow-right" size={16} /> Try again
          </button>
        </div>
      ) : drivers.length === 0 ? (
        <div className={styles.stateBox}>
          <p className={styles.stateText}>No drivers yet. Add your first one.</p>
          <button className={styles.retryBtn} onClick={openCreate}><Icon name="plus" size={16} /> Add driver</button>
        </div>
      ) : (
        <div className={styles.grid}>
          {drivers.map((d) => (
            <article key={d.id} className={styles.card}>
              <div className={styles.cardTop}>
                <span className={styles.avatar} aria-hidden="true">
                  {d.photo ? <img src={d.photo} alt="" className={styles.avatarImg} /> : initials(d.name)}
                </span>
                <div className={styles.who}>
                  <span className={styles.name}>{d.name}</span>
                  <StatusBadge kind="driver" value={d.status} />
                </div>
                <div className={styles.cardActions}>
                  <button className={styles.edit} onClick={() => openEdit(d)} aria-label={`Edit ${d.name}`} title="Edit">
                    <Icon name="pencil" size={16} />
                  </button>
                  <button className={styles.deleteBtn} onClick={() => setDeleteTarget(d)} aria-label={`Delete ${d.name}`} title="Delete">
                    <Icon name="trash" size={16} />
                  </button>
                </div>
              </div>

              <dl className={styles.specs}>
                <div><dt>Vehicle</dt><dd>{d.vehicleModel || '—'}</dd></div>
                <div><dt>Plate</dt><dd className={styles.plate}>{d.plate || '—'}</dd></div>
                <div><dt>Capacity</dt><dd>{d.capacity} pax</dd></div>
              </dl>

              <div className={styles.tours}>
                <span className={styles.toursLabel}>Assigned tours ({d.tours.length})</span>
                {d.tours.length > 0 ? (
                  <div className={styles.tourChips}>
                    {d.tours.map((t) => (
                      <span key={t.id} className={styles.tourChip} title={t.title}>{t.title}</span>
                    ))}
                  </div>
                ) : (
                  <span className={styles.noTours}>None assigned</span>
                )}
              </div>

              {d.phone ? (
                <a className={styles.wa} href={waLink(d.phone)} target="_blank" rel="noopener noreferrer">
                  <Icon name="whatsapp" size={16} />
                  {d.phone}
                </a>
              ) : null}
              {!d.isActive ? <span className={styles.hiddenTag}>Hidden on website</span> : null}
            </article>
          ))}
        </div>
      )}

      <AdminDrawer
        open={open}
        onClose={() => setOpen(false)}
        title={mode === 'edit' ? 'Edit driver' : 'Add driver'}
        subtitle={mode === 'edit' ? editing?.name : 'Add a new driver to the fleet'}
        footer={
          <>
            <button className={styles.ghostBtn} onClick={() => setOpen(false)} disabled={saving}>Cancel</button>
            <button className={styles.primaryBtn} onClick={() => void save()} disabled={saving || !form.name.trim()}>
              {saving ? 'Saving…' : mode === 'edit' ? 'Save changes' : 'Add driver'}
            </button>
          </>
        }
      >
        <div className={styles.form}>
          {formError ? <p className={styles.err}>{formError}</p> : null}

          {/* Photo */}
          <div className={styles.field}>
            <span>Photo</span>
            <div className={styles.photoRow}>
              <span className={styles.photoPreview}>
                {form.photo.trim() ? <img src={form.photo.trim()} alt="" /> : <Icon name="guide" size={24} />}
              </span>
              <div className={styles.photoControls}>
                <input className={styles.input} value={form.photo} onChange={(e) => set('photo', e.target.value)} placeholder="https://… or upload" />
                <UploadButton onFile={(url) => set('photo', url)} onError={(m) => showToast(m, 'error')} />
              </div>
            </div>
          </div>

          <label className={styles.field}>
            <span>Full name *</span>
            <input className={styles.input} value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Giorgi Beridze" />
          </label>
          <label className={styles.field}>
            <span>Phone</span>
            <input className={styles.input} value={form.phone} onChange={(e) => set('phone', e.target.value)} placeholder="+995 599 00 00 00" />
          </label>
          <label className={styles.field}>
            <span>Bio</span>
            <textarea className={[styles.input, styles.textarea].join(' ')} rows={3} value={form.bio} onChange={(e) => set('bio', e.target.value)} placeholder="Short bio shown on the public driver profile…" />
          </label>
          <label className={styles.field}>
            <span>Vehicle model</span>
            <input className={styles.input} value={form.vehicleModel} onChange={(e) => set('vehicleModel', e.target.value)} placeholder="Toyota Land Cruiser" />
          </label>
          <div className={styles.row2}>
            <label className={styles.field}>
              <span>License plate</span>
              <input className={styles.input} value={form.plate} onChange={(e) => set('plate', e.target.value)} placeholder="AA-123-BB" />
            </label>
            <label className={styles.field}>
              <span>Capacity</span>
              <input className={styles.input} type="number" min={1} max={20} value={form.capacity} onChange={(e) => set('capacity', Number(e.target.value) || 1)} />
            </label>
          </div>
          <div className={styles.row2}>
            <label className={styles.field}>
              <span>Status</span>
              <select className={[styles.input, styles.selectField].join(' ')} value={form.status} onChange={(e) => set('status', e.target.value as DriverStatus)}>
                {STATUSES.map((s) => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
              </select>
            </label>
            <div className={styles.field}>
              <span>Show on website</span>
              <div className={styles.toggleRow}>
                <Toggle checked={form.isActive} onChange={(v) => set('isActive', v)} label="Show on website" />
                <span className={form.isActive ? styles.on : styles.off}>{form.isActive ? 'Visible' : 'Hidden'}</span>
              </div>
            </div>
          </div>

          {/* Tour assignment */}
          <div className={styles.field}>
            <span>Assigned tours {form.tourIds.length > 0 ? `(${form.tourIds.length})` : ''}</span>
            {tourOptions.length === 0 ? (
              <p className={styles.noTours}>No tours available.</p>
            ) : (
              <div className={styles.tourPicker}>
                {tourOptions.map((t) => (
                  <label key={t.id} className={styles.tourOption}>
                    <input type="checkbox" checked={form.tourIds.includes(t.id)} onChange={() => toggleTour(t.id)} />
                    <span className={styles.tourOptName}>{t.title}</span>
                    <span className={styles.tourOptType}>{t.type === 'multi-day' ? 'Multi-day' : 'Day'}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>
      </AdminDrawer>

      <AdminModal
        open={deleteTarget !== null}
        onClose={() => (deleting ? undefined : setDeleteTarget(null))}
        title="Delete driver"
        subtitle={deleteTarget?.name}
        footer={
          <>
            <button className={styles.ghostBtn} onClick={() => setDeleteTarget(null)} disabled={deleting}>Cancel</button>
            <button className={styles.dangerBtn} onClick={() => void confirmDelete()} disabled={deleting}>
              {deleting ? 'Deleting…' : 'Delete driver'}
            </button>
          </>
        }
      >
        <p className={styles.blockText}>
          This permanently removes <strong>{deleteTarget?.name}</strong> and their tour assignments. This can’t be undone.
        </p>
      </AdminModal>

      <Toast toast={toast} />
    </div>
  );
}

function UploadButton({ onFile, onError }: { onFile: (url: string) => void; onError?: (m: string) => void }) {
  const ref = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const onChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setUploading(true);
    try {
      const body = new FormData();
      body.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body, credentials: 'include' });
      const data = (await res.json().catch(() => ({}))) as { url?: string; error?: string };
      if (!res.ok || !data.url) throw new Error(data.error ?? `Upload failed (${res.status})`);
      onFile(data.url);
    } catch (err) {
      onError?.(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };
  return (
    <>
      <input ref={ref} type="file" accept="image/*" className={styles.hiddenFile} onChange={onChange} disabled={uploading} />
      <button type="button" className={styles.uploadBtn} onClick={() => ref.current?.click()} disabled={uploading}>
        {uploading ? <span className={styles.uploadSpinner} aria-hidden="true" /> : <Icon name="upload" size={15} />}
        <span>{uploading ? 'Uploading…' : 'Upload'}</span>
      </button>
    </>
  );
}
