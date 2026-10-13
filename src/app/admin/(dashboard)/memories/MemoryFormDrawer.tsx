'use client';

/* eslint-disable @next/next/no-img-element -- admin-only live URL previews; next/image can't optimize arbitrary external URLs here. */

import { useEffect, useRef, useState } from 'react';
import Icon from '@/components/ui/Icon/Icon';
import AdminDrawer from '@/components/admin/AdminDrawer/AdminDrawer';
import Toggle from '@/components/admin/Toggle/Toggle';
import type { MemoryInput, MemoryType, MemoryI18nFields } from '@/lib/memoriesApi';
import styles from './MemoryFormDrawer.module.scss';

/** Which language the translatable content inputs are currently editing. */
export type EditLang = 'en' | 'ru';

export interface MemoryFormState {
  type: MemoryType;
  mediaUrl: string;
  thumbnailUrl: string;
  tourTitle: string;
  caption: string;
  travelerName: string;
  country: string;
  date: string;
  isActive: boolean;
  /** Russian overrides for the translatable fields (English lives above). */
  ru: { tourTitle: string; caption: string };
}

/** A sensible blank form — a photo, visible, dated today. */
export const blankMemoryForm = (): MemoryFormState => ({
  type: 'image',
  mediaUrl: '',
  thumbnailUrl: '',
  tourTitle: '',
  caption: '',
  travelerName: '',
  country: '',
  date: new Date().toISOString().slice(0, 10),
  isActive: true,
  ru: { tourTitle: '', caption: '' },
});

/** Map the editor state to the API payload (trimmed). Photos never carry a
 *  separate thumbnail — the grid reuses the image itself. The Russian override
 *  is only sent when something was translated, so an edit never wipes it. */
export const toMemoryInput = (f: MemoryFormState): MemoryInput => {
  const ru: MemoryI18nFields = {};
  if (f.ru.tourTitle.trim()) ru.tourTitle = f.ru.tourTitle.trim();
  if (f.ru.caption.trim()) ru.caption = f.ru.caption.trim();
  return {
    type: f.type,
    mediaUrl: f.mediaUrl.trim(),
    thumbnailUrl: f.type === 'video' ? f.thumbnailUrl.trim() : '',
    tourTitle: f.tourTitle.trim(),
    caption: f.caption.trim(),
    travelerName: f.travelerName.trim(),
    country: f.country.trim(),
    date: f.date,
    isActive: f.isActive,
    ...(Object.keys(ru).length ? { i18n: { ru } } : {}),
  };
};

/** Guarantee the RU sub-object exists so older/HMR-preserved forms never crash. */
function normalizeForm(f: MemoryFormState): MemoryFormState {
  return { ...f, ru: f.ru ?? { tourTitle: '', caption: '' } };
}

/** Common traveler countries for the quick-pick datalist. */
const COUNTRIES = [
  'United Kingdom', 'United States', 'Germany', 'France', 'Italy', 'Spain',
  'Poland', 'Sweden', 'Japan', 'Australia', 'Canada', 'Singapore',
  'United Arab Emirates', 'Netherlands', 'Switzerland', 'Israel',
];

interface MemoryFormDrawerProps {
  open: boolean;
  mode: 'create' | 'edit';
  initial: MemoryFormState;
  saving: boolean;
  /** Existing tour titles, for the tour datalist. */
  tourTitles: string[];
  onCancel: () => void;
  onSubmit: (form: MemoryFormState) => void;
}

export default function MemoryFormDrawer({
  open,
  mode,
  initial,
  saving,
  tourTitles,
  onCancel,
  onSubmit,
}: MemoryFormDrawerProps) {
  const [form, setForm] = useState<MemoryFormState>(() => normalizeForm(initial));
  const [editLang, setEditLang] = useState<EditLang>('en');
  const [error, setError] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Re-seed whenever the drawer is (re)opened with a new record.
  useEffect(() => {
    if (open) {
      setForm(normalizeForm(initial));
      setEditLang('en');
      setError(null);
      setUploadError(null);
    }
  }, [open, initial]);

  const set = <K extends keyof MemoryFormState>(key: K, value: MemoryFormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  /** Set a Russian override (tourTitle / caption). */
  const setRu = (key: keyof MemoryFormState['ru'], value: string) =>
    setForm((f) => ({ ...f, ru: { ...f.ru, [key]: value } }));

  // Photos preview the image itself; videos preview their poster/thumbnail.
  const previewSrc = form.type === 'video' ? form.thumbnailUrl.trim() : form.mediaUrl.trim();

  const submit = () => {
    if (!form.mediaUrl.trim()) {
      setError('A media URL is required — paste one or upload a file.');
      return;
    }
    if (form.type === 'video' && !form.thumbnailUrl.trim()) {
      setError('Videos need a thumbnail / poster image (paste a URL or upload one).');
      return;
    }
    setError(null);
    onSubmit(form);
  };

  return (
    <AdminDrawer
      open={open}
      onClose={onCancel}
      title={mode === 'create' ? 'Add moment' : 'Edit moment'}
      subtitle={mode === 'edit' ? form.tourTitle || form.travelerName : undefined}
      footer={
        <>
          <button className={styles.ghostBtn} onClick={onCancel} disabled={saving}>
            Cancel
          </button>
          <button className={styles.saveBtn} onClick={submit} disabled={saving}>
            {saving ? 'Saving…' : mode === 'create' ? 'Create moment' : 'Save changes'}
          </button>
        </>
      }
    >
      <div className={styles.form}>
        {error ? <p className={styles.err}>{error}</p> : null}

        {/* Content-language switch — admin chrome stays English; this only
            changes which language the Tour and Caption fields are editing. */}
        <div className={styles.langBar}>
          <span className={styles.langBarLabel}>Content language</span>
          <div className={styles.langToggle} role="tablist" aria-label="Content language">
            {(['en', 'ru'] as const).map((lng) => (
              <button
                key={lng}
                type="button"
                role="tab"
                aria-selected={editLang === lng}
                className={[styles.langOpt, editLang === lng ? styles.langOptActive : '']
                  .filter(Boolean)
                  .join(' ')}
                onClick={() => setEditLang(lng)}
              >
                {lng === 'en' ? 'English' : 'Русский'}
              </button>
            ))}
          </div>
          {editLang === 'ru' ? (
            <span className={styles.langHint}>
              Optional — a blank field falls back to English on the site.
            </span>
          ) : null}
        </div>

        {/* Media type — editable on create, fixed on edit (can't change type). */}
        <div className={styles.field}>
          <span className={styles.fieldLabel}>Media type</span>
          {mode === 'edit' ? (
            <span className={styles.typeFixed}>
              <Icon name={form.type === 'video' ? 'play' : 'images'} size={15} />
              Type: {form.type === 'video' ? 'Video' : 'Photo'}
            </span>
          ) : (
            <div className={styles.segmented} role="radiogroup" aria-label="Media type">
              {(['image', 'video'] as MemoryType[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  role="radio"
                  aria-checked={form.type === t}
                  className={[styles.segment, form.type === t ? styles.segmentOn : '']
                    .filter(Boolean)
                    .join(' ')}
                  onClick={() => set('type', t)}
                >
                  <Icon name={t === 'video' ? 'play' : 'images'} size={15} />
                  {t === 'video' ? 'Video' : 'Photo'}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Media URL — dual input */}
        <label className={styles.field}>
          <span className={styles.fieldLabel}>
            {form.type === 'video' ? 'Video URL' : 'Image URL'}
            <i className={styles.reqStar}>*</i>
          </span>
          <div className={styles.inputRow}>
            <input
              className={styles.input}
              value={form.mediaUrl}
              onChange={(e) => set('mediaUrl', e.target.value)}
              placeholder="https://…"
            />
            <UploadButton
              label="Upload file"
              onFile={(url) => {
                setUploadError(null);
                set('mediaUrl', url);
              }}
              onError={setUploadError}
            />
          </div>
          <span className={styles.hint}>
            Paste a hosted URL, or upload a file — it’s stored on Neon and filled in automatically.
          </span>
        </label>

        {/* Thumbnail / poster — videos only (photos reuse the image itself) */}
        {form.type === 'video' ? (
          <label className={styles.field}>
            <span className={styles.fieldLabel}>
              Thumbnail / poster
              <i className={styles.reqStar}>*</i>
            </span>
            <div className={styles.inputRow}>
              <input
                className={styles.input}
                value={form.thumbnailUrl}
                onChange={(e) => set('thumbnailUrl', e.target.value)}
                placeholder="https://…"
              />
              <UploadButton
                label="Upload thumbnail"
                onFile={(url) => {
                  setUploadError(null);
                  set('thumbnailUrl', url);
                }}
                onError={setUploadError}
              />
            </div>
            <span className={styles.hint}>Shown in the grid and as the video poster.</span>
          </label>
        ) : null}

        {uploadError ? <p className={styles.err}>{uploadError}</p> : null}

        {/* Live preview */}
        <div className={styles.previewWrap}>
          <ImgPreview src={previewSrc} className={styles.preview} />
          {form.type === 'video' && previewSrc ? (
            <span className={styles.previewPlay} aria-hidden="true">
              <span className={styles.playDot}>
                <Icon name="play" size={18} />
              </span>
            </span>
          ) : null}
        </div>

        {/* Tour / location — translatable */}
        <label className={styles.field}>
          <span className={styles.fieldLabel}>
            {editLang === 'en' ? 'Tour / location' : 'Tour / location (Russian)'}
          </span>
          {editLang === 'en' ? (
            <>
              <input
                className={styles.input}
                list="memory-tour-titles"
                value={form.tourTitle}
                onChange={(e) => set('tourTitle', e.target.value)}
                placeholder="e.g. Kazbegi & Gergeti Trinity"
              />
              <datalist id="memory-tour-titles">
                {tourTitles.map((t) => (
                  <option key={t} value={t} />
                ))}
              </datalist>
            </>
          ) : (
            <input
              className={styles.input}
              value={form.ru.tourTitle}
              onChange={(e) => setRu('tourTitle', e.target.value)}
              placeholder={form.tourTitle || 'Казбеги и Гергетская Троица'}
            />
          )}
        </label>

        {/* Caption — translatable */}
        <label className={styles.field}>
          <span className={styles.fieldLabel}>{editLang === 'en' ? 'Caption' : 'Caption (Russian)'}</span>
          <textarea
            className={styles.textarea}
            rows={3}
            value={editLang === 'en' ? form.caption : form.ru.caption}
            onChange={(e) => (editLang === 'en' ? set('caption', e.target.value) : setRu('caption', e.target.value))}
            placeholder={editLang === 'en' ? 'A short traveler quote…' : form.caption || 'Короткая цитата путешественника…'}
            maxLength={500}
          />
        </label>

        {/* Traveler + country */}
        <div className={styles.grid2}>
          <label className={styles.field}>
            <span className={styles.fieldLabel}>Traveler name</span>
            <input
              className={styles.input}
              value={form.travelerName}
              onChange={(e) => set('travelerName', e.target.value)}
              placeholder="e.g. Emily R."
            />
          </label>
          <label className={styles.field}>
            <span className={styles.fieldLabel}>Country</span>
            <input
              className={styles.input}
              list="memory-countries"
              value={form.country}
              onChange={(e) => set('country', e.target.value)}
              placeholder="e.g. United Kingdom"
            />
            <datalist id="memory-countries">
              {COUNTRIES.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </label>
        </div>

        {/* Date + visibility */}
        <div className={styles.grid2}>
          <label className={styles.field}>
            <span className={styles.fieldLabel}>Date</span>
            <input
              className={styles.input}
              type="date"
              value={form.date}
              onChange={(e) => set('date', e.target.value)}
            />
          </label>
          <div className={styles.field}>
            <span className={styles.fieldLabel}>Visible on website</span>
            <div className={styles.toggleRow}>
              <Toggle
                checked={form.isActive}
                onChange={(v) => set('isActive', v)}
                label="Visible on website"
              />
              <span className={form.isActive ? styles.on : styles.off}>
                {form.isActive ? 'Visible' : 'Hidden'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </AdminDrawer>
  );
}

function UploadButton({
  onFile,
  onError,
  label,
}: {
  onFile: (url: string) => void;
  onError?: (message: string) => void;
  label: string;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const onChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ''; // let the same file be picked again
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
      <input
        ref={ref}
        type="file"
        accept="image/*,video/*"
        className={styles.hiddenFile}
        onChange={onChange}
        disabled={uploading}
      />
      <button
        type="button"
        className={styles.uploadBtn}
        onClick={() => ref.current?.click()}
        aria-label={label}
        title={label}
        disabled={uploading}
      >
        {uploading ? (
          <span className={styles.uploadSpinner} aria-hidden="true" />
        ) : (
          <Icon name="upload" size={15} />
        )}
        <span>{uploading ? 'Uploading…' : 'Upload'}</span>
      </button>
    </>
  );
}

function ImgPreview({ src, className }: { src: string; className?: string }) {
  const [error, setError] = useState(false);
  const trimmed = src.trim();
  useEffect(() => setError(false), [trimmed]);

  if (!trimmed || error) {
    return (
      <div className={[className, styles.imgEmpty].filter(Boolean).join(' ')}>
        <Icon name="images" size={22} />
        <span>{error ? 'Can’t load preview' : 'No media yet'}</span>
      </div>
    );
  }
  return <img className={className} src={trimmed} alt="" loading="lazy" onError={() => setError(true)} />;
}
