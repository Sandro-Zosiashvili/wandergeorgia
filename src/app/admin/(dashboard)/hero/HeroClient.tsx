'use client';

/* eslint-disable @next/next/no-img-element -- admin-only external previews; next/image can't optimize arbitrary URLs here. */

import { useCallback, useEffect, useRef, useState } from 'react';
import Icon from '@/components/ui/Icon/Icon';
import Toggle from '@/components/admin/Toggle/Toggle';
import AdminModal from '@/components/admin/AdminModal/AdminModal';
import Toast, { type ToastState } from '@/components/admin/Toast/Toast';
import {
  ApiError,
  createHero,
  deleteHero,
  listHero,
  reorderHero,
  revalidateHero,
  updateHero,
  type ApiHeroImage,
} from '@/lib/heroApi';
import styles from './Hero.module.scss';

interface HeroFormState {
  imageUrl: string;
  place: string;
  alt: string;
  isActive: boolean;
}

const BLANK: HeroFormState = { imageUrl: '', place: '', alt: '', isActive: true };

export default function HeroClient() {
  const [items, setItems] = useState<ApiHeroImage[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<'create' | 'edit'>('create');
  const [editing, setEditing] = useState<ApiHeroImage | null>(null);
  const [form, setForm] = useState<HeroFormState>(BLANK);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<ApiHeroImage | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [reordering, setReordering] = useState(false);

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
      setItems(await listHero());
    } catch (err) {
      setItems([]);
      setLoadError(
        err instanceof ApiError && err.status === 401
          ? 'Your session expired. Please sign in again.'
          : err instanceof Error ? err.message : 'Could not load hero images.',
      );
    }
  }, []);
  useEffect(() => { void load(); }, [load]);

  const set = <K extends keyof HeroFormState>(k: K, v: HeroFormState[K]) => setForm((f) => ({ ...f, [k]: v }));

  const openCreate = () => { setMode('create'); setEditing(null); setForm(BLANK); setFormError(null); setOpen(true); };
  const openEdit = (h: ApiHeroImage) => {
    setMode('edit'); setEditing(h);
    setForm({ imageUrl: h.imageUrl, place: h.place, alt: h.alt, isActive: h.isActive });
    setFormError(null); setOpen(true);
  };

  const save = async () => {
    if (!form.imageUrl.trim()) {
      setFormError('An image is required — upload one or paste a URL.');
      return;
    }
    setSaving(true);
    try {
      const input = { imageUrl: form.imageUrl.trim(), place: form.place.trim(), alt: form.alt.trim(), isActive: form.isActive };
      if (mode === 'create') { await createHero(input); showToast('Image added.'); }
      else if (editing) { await updateHero(editing.id, input); showToast('Changes saved.'); }
      setOpen(false);
      await load();
      await revalidateHero();
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Save failed.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (h: ApiHeroImage, next: boolean) => {
    setBusyId(h.id);
    setItems((prev) => prev?.map((x) => (x.id === h.id ? { ...x, isActive: next } : x)) ?? prev);
    try {
      await updateHero(h.id, { isActive: next });
      await revalidateHero();
      showToast(next ? 'Shown in slideshow.' : 'Hidden from slideshow.');
    } catch (err) {
      setItems((prev) => prev?.map((x) => (x.id === h.id ? { ...x, isActive: !next } : x)) ?? prev);
      showToast(err instanceof Error ? err.message : 'Update failed.', 'error');
    } finally {
      setBusyId(null);
    }
  };

  const move = async (index: number, dir: -1 | 1) => {
    if (!items) return;
    const to = index + dir;
    if (to < 0 || to >= items.length) return;
    const next = [...items];
    const [moved] = next.splice(index, 1);
    if (!moved) return;
    next.splice(to, 0, moved);
    setItems(next); // optimistic
    setReordering(true);
    try {
      await reorderHero(next.map((x) => x.id));
      await revalidateHero();
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Reorder failed.', 'error');
      void load();
    } finally {
      setReordering(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteHero(deleteTarget.id);
      setItems((prev) => prev?.filter((x) => x.id !== deleteTarget.id) ?? prev);
      showToast('Image deleted.');
      setDeleteTarget(null);
      await revalidateHero();
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Delete failed.', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const total = items?.length ?? 0;
  const activeCount = items?.filter((x) => x.isActive).length ?? 0;

  return (
    <div className={styles.wrap}>
      <header className={styles.head}>
        <div>
          <h1 className={styles.title}>Hero slideshow</h1>
          <p className={styles.sub}>
            {items === null ? 'Loading…' : `${activeCount} of ${total} image${total === 1 ? '' : 's'} live on the homepage`}
          </p>
        </div>
        <button className={styles.addBtn} onClick={openCreate}>
          <Icon name="plus" size={17} /> Add image
        </button>
      </header>

      {items === null ? (
        <div className={styles.stateBox}><span className={styles.spinner} aria-label="Loading" /></div>
      ) : loadError ? (
        <div className={styles.stateBox}>
          <p className={styles.stateText}>{loadError}</p>
          <button className={styles.retryBtn} onClick={() => void load()}><Icon name="arrow-right" size={16} /> Try again</button>
        </div>
      ) : items.length === 0 ? (
        <div className={styles.stateBox}>
          <p className={styles.stateText}>No hero images yet. Add your first one.</p>
          <button className={styles.retryBtn} onClick={openCreate}><Icon name="plus" size={16} /> Add image</button>
        </div>
      ) : (
        <ol className={styles.list}>
          {items.map((h, i) => (
            <li key={h.id} className={styles.card}>
              <span className={styles.pos}>{i + 1}</span>
              <span className={styles.preview}>
                <img src={h.imageUrl} alt="" loading="lazy" />
              </span>
              <div className={styles.info}>
                <span className={styles.place}>
                  <Icon name="map-pin" size={14} /> {h.place || 'Untitled'}
                </span>
                <span className={styles.alt}>{h.alt || <em>No alt text</em>}</span>
              </div>
              <div className={styles.reorder}>
                <button className={styles.moveBtn} onClick={() => void move(i, -1)} disabled={i === 0 || reordering} aria-label="Move up" title="Move up">
                  <Icon name="chevron-up" size={16} />
                </button>
                <button className={styles.moveBtn} onClick={() => void move(i, 1)} disabled={i === items.length - 1 || reordering} aria-label="Move down" title="Move down">
                  <Icon name="chevron-down" size={16} />
                </button>
              </div>
              <div className={styles.activeCell}>
                <Toggle checked={h.isActive} onChange={(v) => void toggleActive(h, v)} disabled={busyId === h.id} label={`Toggle ${h.place}`} />
                <span className={h.isActive ? styles.on : styles.off}>{h.isActive ? 'Live' : 'Hidden'}</span>
              </div>
              <div className={styles.actions}>
                <button className={styles.actionBtn} onClick={() => openEdit(h)} aria-label="Edit" title="Edit"><Icon name="pencil" size={16} /></button>
                <button className={[styles.actionBtn, styles.deleteBtn].join(' ')} onClick={() => setDeleteTarget(h)} aria-label="Delete" title="Delete"><Icon name="trash" size={16} /></button>
              </div>
            </li>
          ))}
        </ol>
      )}

      {/* Add / edit */}
      <AdminModal
        open={open}
        onClose={() => (saving ? undefined : setOpen(false))}
        title={mode === 'edit' ? 'Edit hero image' : 'Add hero image'}
        subtitle={mode === 'edit' ? editing?.place : 'Shown in the homepage slideshow'}
        footer={
          <>
            <button className={styles.ghostBtn} onClick={() => setOpen(false)} disabled={saving}>Cancel</button>
            <button className={styles.primaryBtn} onClick={() => void save()} disabled={saving || !form.imageUrl.trim()}>
              {saving ? 'Saving…' : mode === 'edit' ? 'Save changes' : 'Add image'}
            </button>
          </>
        }
      >
        <div className={styles.form}>
          {formError ? <p className={styles.err}>{formError}</p> : null}

          <div className={styles.field}>
            <span className={styles.label}>Image</span>
            <div className={styles.photoRow}>
              <span className={styles.photoPreview}>
                {form.imageUrl.trim() ? <img src={form.imageUrl.trim()} alt="" /> : <Icon name="images" size={22} />}
              </span>
              <div className={styles.photoControls}>
                <input className={styles.input} value={form.imageUrl} onChange={(e) => set('imageUrl', e.target.value)} placeholder="https://… or upload" />
                <UploadButton onFile={(url) => set('imageUrl', url)} onError={(m) => showToast(m, 'error')} />
              </div>
            </div>
            <span className={styles.hint}>Landscape shots work best — they fill the screen edge-to-edge.</span>
          </div>

          <label className={styles.field}>
            <span className={styles.label}>Location tag</span>
            <input className={styles.input} value={form.place} onChange={(e) => set('place', e.target.value)} placeholder="e.g. Kazbegi" />
          </label>
          <label className={styles.field}>
            <span className={styles.label}>Alt text</span>
            <input className={styles.input} value={form.alt} onChange={(e) => set('alt', e.target.value)} placeholder="Describe the photo for accessibility" />
          </label>
          <div className={styles.field}>
            <span className={styles.label}>Show in slideshow</span>
            <div className={styles.toggleRow}>
              <Toggle checked={form.isActive} onChange={(v) => set('isActive', v)} label="Show in slideshow" />
              <span className={form.isActive ? styles.on : styles.off}>{form.isActive ? 'Live' : 'Hidden'}</span>
            </div>
          </div>
        </div>
      </AdminModal>

      <AdminModal
        open={deleteTarget !== null}
        onClose={() => (deleting ? undefined : setDeleteTarget(null))}
        title="Delete hero image"
        subtitle={deleteTarget?.place}
        footer={
          <>
            <button className={styles.ghostBtn} onClick={() => setDeleteTarget(null)} disabled={deleting}>Cancel</button>
            <button className={styles.dangerBtn} onClick={() => void confirmDelete()} disabled={deleting}>
              {deleting ? 'Deleting…' : 'Delete image'}
            </button>
          </>
        }
      >
        <p className={styles.blockText}>This removes the image from the homepage slideshow. This can’t be undone.</p>
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
