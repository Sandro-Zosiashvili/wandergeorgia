'use client';

/* eslint-disable @next/next/no-img-element -- admin-only live URL previews; next/image can't optimize arbitrary external URLs here. */

import { useEffect, useRef, useState } from 'react';
import Icon from '@/components/ui/Icon/Icon';
import type { IconName } from '@/components/ui/Icon/Icon';
import AdminDrawer from '@/components/admin/AdminDrawer/AdminDrawer';
import type { TourInput } from '@/lib/toursApi';
import styles from './TourFormDrawer.module.scss';

/** An itinerary day in the editor. `uid` is a stable key for reorder/collapse. */
export interface ItineraryFormDay {
  uid: string;
  title: string;
  description: string;
  highlights: string[];
}

export interface TourFormState {
  title: string;
  slug: string;
  type: 'one-day' | 'multi-day';
  location: string;
  duration: string;
  basePrice: number;
  overview: string;
  highlights: string[];
  included: string[];
  excluded: string[];
  itinerary: ItineraryFormDay[];
  coverImage: string;
  gallery: string[];
  isActive: boolean;
}

const uid = () =>
  typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `d${Date.now()}${Math.random().toString(36).slice(2, 8)}`;

/** Wrap a plain itinerary day (from the API) with a stable editor uid. */
export const toFormDay = (d: { title: string; description: string; highlights?: string[] }): ItineraryFormDay => ({
  uid: uid(),
  title: d.title,
  description: d.description,
  highlights: d.highlights ?? [],
});

export const blankTourForm = (): TourFormState => ({
  title: '',
  slug: '',
  type: 'one-day',
  location: '',
  duration: '',
  basePrice: 120,
  overview: '',
  highlights: [],
  included: [],
  excluded: [],
  itinerary: [],
  coverImage: '',
  gallery: [],
  isActive: true,
});

/** Convert the form to the API payload (strips editor-only `uid`). */
export function toTourInput(f: TourFormState): TourInput {
  return {
    title: f.title.trim(),
    slug: f.slug.trim(),
    type: f.type,
    location: f.location.trim(),
    duration: f.duration.trim(),
    basePrice: Number(f.basePrice) || 0,
    overview: f.overview.trim(),
    highlights: f.highlights.map((s) => s.trim()).filter(Boolean),
    included: f.included.map((s) => s.trim()).filter(Boolean),
    excluded: f.excluded.map((s) => s.trim()).filter(Boolean),
    itinerary: f.itinerary
      .map((d) => ({
        title: d.title.trim(),
        description: d.description.trim(),
        highlights: (d.highlights ?? []).map((h) => h.trim()).filter(Boolean),
      }))
      .filter((d) => d.title || d.description || d.highlights.length),
    coverImage: f.coverImage.trim(),
    gallery: f.gallery.map((s) => s.trim()).filter(Boolean),
    isActive: f.isActive,
  };
}

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

// Common presets so admins can one-click the usual Included / Excluded items.
const INCLUDED_PRESETS = [
  'English-speaking driver-guide',
  'Comfortable private vehicle',
  'Fuel',
  'Parking fees',
  'Bottled water',
  'Hotel pick-up & drop-off',
  'Drone photography (weather permitting)',
];
const EXCLUDED_PRESETS = ['Entrance fees', 'Meals', 'Personal expenses', 'Accommodation', 'Flights', 'Travel insurance'];

type TabId = 'general' | 'details' | 'itinerary' | 'media';
const TABS: { id: TabId; label: string; icon: IconName }[] = [
  { id: 'general', label: 'General', icon: 'clipboard' },
  { id: 'details', label: 'Details', icon: 'sparkle' },
  { id: 'itinerary', label: 'Itinerary', icon: 'route' },
  { id: 'media', label: 'Media', icon: 'images' },
];

type StringKey = 'highlights' | 'included' | 'excluded' | 'gallery';

interface Props {
  open: boolean;
  mode: 'create' | 'edit';
  initial: TourFormState;
  saving: boolean;
  onCancel: () => void;
  onSubmit: (data: TourFormState) => void;
}

export default function TourFormDrawer({ open, mode, initial, saving, onCancel, onSubmit }: Props) {
  const [form, setForm] = useState<TourFormState>(initial);
  const [tab, setTab] = useState<TabId>('general');
  const [slugTouched, setSlugTouched] = useState(mode === 'edit');
  const [showErrors, setShowErrors] = useState(false);
  const [openDays, setOpenDays] = useState<Set<string>>(new Set());
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    setForm(initial);
    setTab('general');
    setSlugTouched(mode === 'edit');
    setShowErrors(false);
    setOpenDays(new Set()); // long itineraries start collapsed
  }, [initial, mode]);

  const set = <K extends keyof TourFormState>(key: K, value: TourFormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const onTitleChange = (value: string) =>
    setForm((f) => ({
      ...f,
      title: value,
      slug: !slugTouched && mode === 'create' ? slugify(value) : f.slug,
    }));

  // ── Dynamic string-array helpers ──────────────────────────────────────────
  const addString = (key: StringKey) => setForm((f) => ({ ...f, [key]: [...f[key], ''] }));
  const addStringValue = (key: StringKey, value: string) =>
    setForm((f) => (f[key].includes(value) ? f : { ...f, [key]: [...f[key], value] }));
  const setString = (key: StringKey, i: number, v: string) =>
    setForm((f) => ({ ...f, [key]: f[key].map((x, idx) => (idx === i ? v : x)) }));
  const removeString = (key: StringKey, i: number) =>
    setForm((f) => ({ ...f, [key]: f[key].filter((_, idx) => idx !== i) }));

  const moveGallery = (from: number, dir: -1 | 1) =>
    setForm((f) => {
      const to = from + dir;
      if (to < 0 || to >= f.gallery.length) return f;
      const arr = [...f.gallery];
      const tmp = arr[from]!;
      arr[from] = arr[to]!;
      arr[to] = tmp;
      return { ...f, gallery: arr };
    });

  // ── Itinerary helpers ─────────────────────────────────────────────────────
  const addDay = () => {
    const day: ItineraryFormDay = { uid: uid(), title: '', description: '', highlights: [] };
    setForm((f) => ({ ...f, itinerary: [...f.itinerary, day] }));
    setOpenDays((prev) => new Set(prev).add(day.uid)); // open the new day
  };
  const setDay = (i: number, field: 'title' | 'description', v: string) =>
    setForm((f) => ({
      ...f,
      itinerary: f.itinerary.map((d, idx) => (idx === i ? { ...d, [field]: v } : d)),
    }));
  const removeDay = (i: number) =>
    setForm((f) => ({ ...f, itinerary: f.itinerary.filter((_, idx) => idx !== i) }));
  const moveDay = (from: number, dir: -1 | 1) =>
    setForm((f) => {
      const to = from + dir;
      if (to < 0 || to >= f.itinerary.length) return f;
      const arr = [...f.itinerary];
      const tmp = arr[from]!;
      arr[from] = arr[to]!;
      arr[to] = tmp;
      return { ...f, itinerary: arr };
    });
  const toggleDayOpen = (dayUid: string) =>
    setOpenDays((prev) => {
      const next = new Set(prev);
      if (next.has(dayUid)) next.delete(dayUid);
      else next.add(dayUid);
      return next;
    });

  const addDayHighlight = (dayIdx: number, value: string) =>
    setForm((f) => ({
      ...f,
      itinerary: f.itinerary.map((d, i) =>
        i === dayIdx ? { ...d, highlights: [...(d.highlights ?? []), value] } : d,
      ),
    }));
  const removeDayHighlight = (dayIdx: number, hi: number) =>
    setForm((f) => ({
      ...f,
      itinerary: f.itinerary.map((d, i) =>
        i === dayIdx ? { ...d, highlights: (d.highlights ?? []).filter((_, j) => j !== hi) } : d,
      ),
    }));

  const slugValid = SLUG_RE.test(form.slug.trim());
  const titleValid = form.title.trim().length > 0;
  const valid = titleValid && slugValid;

  const handleSave = () => {
    if (!valid) {
      setShowErrors(true);
      setTab('general');
      return;
    }
    onSubmit(form);
  };

  const coverTrim = form.coverImage.trim();

  return (
    <AdminDrawer
      open={open}
      onClose={onCancel}
      title={mode === 'create' ? 'New tour' : 'Edit tour'}
      subtitle={mode === 'create' ? 'Add a tour to the catalog' : form.title || undefined}
      footer={
        <>
          <button type="button" className={styles.ghostBtn} onClick={onCancel} disabled={saving}>
            Cancel
          </button>
          <button type="button" className={styles.primaryBtn} onClick={handleSave} disabled={saving}>
            {saving ? (
              <>
                <span className={styles.btnSpinner} aria-hidden="true" /> Saving…
              </>
            ) : (
              <>
                <Icon name="check" size={16} /> Save changes
              </>
            )}
          </button>
        </>
      }
    >
      <div className={styles.tabBar} role="tablist" aria-label="Tour sections">
        {TABS.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            className={[styles.tab, tab === t.id ? styles.tabActive : ''].filter(Boolean).join(' ')}
            onClick={() => setTab(t.id)}
          >
            <Icon name={t.icon} size={16} />
            {t.label}
          </button>
        ))}
      </div>

      <div className={styles.panel}>
        {/* ── Tab 1: General ────────────────────────────────────────────── */}
        {tab === 'general' ? (
          <div className={styles.fields}>
            <Field label="Title" required>
              <input
                className={[styles.input, showErrors && !titleValid ? styles.inputError : ''].filter(Boolean).join(' ')}
                value={form.title}
                onChange={(e) => onTitleChange(e.target.value)}
                placeholder="Svaneti Highlands Tour"
              />
              {showErrors && !titleValid ? <span className={styles.err}>Title is required.</span> : null}
            </Field>

            <Field label="Slug" required hint="Lowercase, hyphenated — used in the tour URL.">
              <input
                className={[styles.input, showErrors && !slugValid ? styles.inputError : ''].filter(Boolean).join(' ')}
                value={form.slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  set('slug', e.target.value);
                }}
                placeholder="svaneti-highlands-tour"
              />
              {showErrors && !slugValid ? (
                <span className={styles.err}>Use lowercase letters, numbers and single hyphens.</span>
              ) : null}
            </Field>

            <div className={styles.row2}>
              <Field label="Tour type">
                <select
                  className={[styles.input, styles.select].join(' ')}
                  value={form.type}
                  onChange={(e) => set('type', e.target.value as TourFormState['type'])}
                >
                  <option value="one-day">Day tour</option>
                  <option value="multi-day">Multi-day</option>
                </select>
              </Field>
              <Field label="Base price (USD)">
                <div className={styles.priceWrap}>
                  <span className={styles.currency}>$</span>
                  <input
                    className={styles.input}
                    type="number"
                    min={0}
                    step={10}
                    value={form.basePrice}
                    onChange={(e) => set('basePrice', Number(e.target.value) || 0)}
                  />
                </div>
              </Field>
            </div>

            <div className={styles.row2}>
              <Field label="Location / region">
                <input
                  className={styles.input}
                  value={form.location}
                  onChange={(e) => set('location', e.target.value)}
                  placeholder="Mestia"
                />
              </Field>
              <Field label="Duration">
                <input
                  className={styles.input}
                  value={form.duration}
                  onChange={(e) => set('duration', e.target.value)}
                  placeholder="8 hours / 4 days"
                />
              </Field>
            </div>

            <label className={styles.toggleField}>
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => set('isActive', e.target.checked)}
              />
              <span>Active on the website</span>
            </label>
          </div>
        ) : null}

        {/* ── Tab 2: Details & Content ──────────────────────────────────── */}
        {tab === 'details' ? (
          <div className={styles.fields}>
            <Field label="Overview">
              <textarea
                className={[styles.input, styles.textarea].join(' ')}
                rows={5}
                value={form.overview}
                onChange={(e) => set('overview', e.target.value)}
                placeholder="A longer introduction shown on the tour detail page…"
              />
            </Field>

            <StringList
              label="Highlights"
              addLabel="Add highlight"
              placeholder="e.g. Gergeti Trinity Church"
              items={form.highlights}
              onAdd={() => addString('highlights')}
              onChange={(i, v) => setString('highlights', i, v)}
              onRemove={(i) => removeString('highlights', i)}
            />

            <StringList
              label="Included"
              addLabel="Add included item"
              placeholder="e.g. Private driver & fuel"
              items={form.included}
              onAdd={() => addString('included')}
              onChange={(i, v) => setString('included', i, v)}
              onRemove={(i) => removeString('included', i)}
              presets={INCLUDED_PRESETS}
              onAddPreset={(v) => addStringValue('included', v)}
            />

            <StringList
              label="Excluded"
              addLabel="Add excluded item"
              placeholder="e.g. Lunch & entry tickets"
              items={form.excluded}
              onAdd={() => addString('excluded')}
              onChange={(i, v) => setString('excluded', i, v)}
              onRemove={(i) => removeString('excluded', i)}
              presets={EXCLUDED_PRESETS}
              onAddPreset={(v) => addStringValue('excluded', v)}
            />
          </div>
        ) : null}

        {/* ── Tab 3: Itinerary ──────────────────────────────────────────── */}
        {tab === 'itinerary' ? (
          <div className={styles.fields}>
            {form.itinerary.length === 0 ? (
              <p className={styles.emptyHint}>No days yet. Build the trip day by day.</p>
            ) : null}
            {form.itinerary.map((day, i) => {
              const isOpen = openDays.has(day.uid);
              return (
                <div key={day.uid} className={styles.dayCard}>
                  <div className={styles.dayHead}>
                    <button
                      type="button"
                      className={styles.dayToggle}
                      onClick={() => toggleDayOpen(day.uid)}
                      aria-expanded={isOpen}
                    >
                      <Icon
                        name="chevron-down"
                        size={16}
                        className={[styles.chev, isOpen ? styles.chevOpen : ''].filter(Boolean).join(' ')}
                      />
                      <span className={styles.dayBadge}>Day {i + 1}</span>
                      <span className={styles.dayTitlePreview}>{day.title.trim() || 'Untitled day'}</span>
                    </button>
                    <div className={styles.dayControls}>
                      <button
                        type="button"
                        className={styles.iconBtnSm}
                        onClick={() => moveDay(i, -1)}
                        disabled={i === 0}
                        aria-label={`Move day ${i + 1} up`}
                      >
                        <Icon name="chevron-up" size={16} />
                      </button>
                      <button
                        type="button"
                        className={styles.iconBtnSm}
                        onClick={() => moveDay(i, 1)}
                        disabled={i === form.itinerary.length - 1}
                        aria-label={`Move day ${i + 1} down`}
                      >
                        <Icon name="chevron-down" size={16} />
                      </button>
                      <button
                        type="button"
                        className={[styles.iconBtnSm, styles.iconBtnDanger].join(' ')}
                        onClick={() => removeDay(i)}
                        aria-label={`Remove day ${i + 1}`}
                      >
                        <Icon name="trash" size={16} />
                      </button>
                    </div>
                  </div>

                  {isOpen ? (
                    <div className={styles.dayBody}>
                      <input
                        className={styles.input}
                        value={day.title}
                        onChange={(e) => setDay(i, 'title', e.target.value)}
                        placeholder="Day title — e.g. Tbilisi to Kazbegi"
                      />
                      <DayHighlights
                        highlights={day.highlights ?? []}
                        onAdd={(v) => addDayHighlight(i, v)}
                        onRemove={(hi) => removeDayHighlight(i, hi)}
                      />
                      <textarea
                        className={[styles.input, styles.textarea].join(' ')}
                        rows={3}
                        value={day.description}
                        onChange={(e) => setDay(i, 'description', e.target.value)}
                        placeholder="What happens on this day…"
                      />
                    </div>
                  ) : null}
                </div>
              );
            })}
            <button type="button" className={styles.addBtn} onClick={addDay}>
              <Icon name="plus" size={16} /> Add day
            </button>
          </div>
        ) : null}

        {/* ── Tab 4: Media ──────────────────────────────────────────────── */}
        {tab === 'media' ? (
          <div className={styles.fields}>
            {uploadError ? <p className={styles.err}>{uploadError}</p> : null}
            <div className={styles.field}>
              <span className={styles.fieldLabel}>Cover image</span>
              <div className={styles.inputRow}>
                <input
                  className={styles.input}
                  value={form.coverImage}
                  onChange={(e) => set('coverImage', e.target.value)}
                  placeholder="https://…"
                />
                <UploadButton
                  label="Upload image or video"
                  onFile={(url) => { setUploadError(null); set('coverImage', url); }}
                  onError={setUploadError}
                />
              </div>
              <span className={styles.hint}>
                Paste a hosted URL, or upload an image/video — it&apos;s stored on Neon and the URL is filled in automatically.
              </span>
            </div>
            <ImgPreview src={form.coverImage} className={styles.coverPreview} />

            <div className={styles.listHead}>
              <span className={styles.fieldLabel}>Gallery</span>
              <button type="button" className={styles.addBtnSm} onClick={() => addString('gallery')}>
                <Icon name="plus" size={15} /> Add image
              </button>
            </div>
            {form.gallery.length === 0 ? (
              <p className={styles.emptyHint}>No gallery images yet.</p>
            ) : null}
            {form.gallery.map((url, i) => {
              const isCover = url.trim() !== '' && url.trim() === coverTrim;
              return (
                <div key={i} className={styles.galleryRow}>
                  <div className={styles.thumbWrap}>
                    <ImgPreview src={url} className={styles.thumb} />
                    {isCover ? <span className={styles.coverBadge}>Cover</span> : null}
                  </div>
                  <input
                    className={styles.input}
                    value={url}
                    onChange={(e) => setString('gallery', i, e.target.value)}
                    placeholder="https://…"
                  />
                  <div className={styles.galleryControls}>
                    <button
                      type="button"
                      className={styles.iconBtnSm}
                      onClick={() => moveGallery(i, -1)}
                      disabled={i === 0}
                      aria-label={`Move image ${i + 1} up`}
                    >
                      <Icon name="chevron-up" size={16} />
                    </button>
                    <button
                      type="button"
                      className={styles.iconBtnSm}
                      onClick={() => moveGallery(i, 1)}
                      disabled={i === form.gallery.length - 1}
                      aria-label={`Move image ${i + 1} down`}
                    >
                      <Icon name="chevron-down" size={16} />
                    </button>
                    <button
                      type="button"
                      className={[styles.iconBtnSm, isCover ? styles.iconBtnActive : ''].filter(Boolean).join(' ')}
                      onClick={() => set('coverImage', url)}
                      disabled={isCover || !url.trim()}
                      aria-label="Set as cover image"
                      title={isCover ? 'Current cover' : 'Set as cover'}
                    >
                      <Icon name="star" size={16} />
                    </button>
                    <UploadButton
                      compact
                      label="Upload image or video"
                      onFile={(url) => { setUploadError(null); setString('gallery', i, url); }}
                      onError={setUploadError}
                    />
                    <button
                      type="button"
                      className={[styles.iconBtnSm, styles.iconBtnDanger].join(' ')}
                      onClick={() => removeString('gallery', i)}
                      aria-label={`Remove gallery image ${i + 1}`}
                    >
                      <Icon name="trash" size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : null}
      </div>
    </AdminDrawer>
  );
}

// ── Small building blocks ────────────────────────────────────────────────────

function Field({
  label,
  required,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={styles.field}>
      <span className={styles.fieldLabel}>
        {label}
        {required ? <i className={styles.reqStar}>*</i> : null}
      </span>
      {children}
      {hint ? <span className={styles.hint}>{hint}</span> : null}
    </label>
  );
}

function UploadButton({
  onFile,
  onError,
  label,
  compact,
}: {
  onFile: (url: string) => void;
  onError?: (message: string) => void;
  label: string;
  compact?: boolean;
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
      onFile(data.url); // populate the field with the permanent Neon URL
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
        className={compact ? styles.iconBtnSm : styles.uploadBtn}
        onClick={() => ref.current?.click()}
        aria-label={label}
        title={label}
        disabled={uploading}
      >
        {uploading ? <span className={styles.uploadSpinner} aria-hidden="true" /> : <Icon name="upload" size={compact ? 16 : 15} />}
        {compact ? null : <span>{uploading ? 'Uploading…' : 'Upload'}</span>}
      </button>
    </>
  );
}

function DayHighlights({
  highlights,
  onAdd,
  onRemove,
}: {
  highlights: string[];
  onAdd: (value: string) => void;
  onRemove: (index: number) => void;
}) {
  const [draft, setDraft] = useState('');
  const commit = () => {
    const v = draft.trim();
    if (!v) return;
    onAdd(v);
    setDraft('');
  };
  return (
    <div className={styles.dayHl}>
      <span className={styles.dayHlLabel}>Day highlights</span>
      {highlights.length > 0 ? (
        <div className={styles.pills}>
          {highlights.map((h, i) => (
            <span key={i} className={styles.pill}>
              {h}
              <button
                type="button"
                className={styles.pillX}
                onClick={() => onRemove(i)}
                aria-label={`Remove highlight ${h}`}
              >
                <Icon name="close" size={12} />
              </button>
            </span>
          ))}
        </div>
      ) : null}
      <div className={styles.pillAdd}>
        <input
          className={styles.input}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              commit();
            }
          }}
          placeholder="e.g. Bridge of Peace"
        />
        <button type="button" className={styles.addBtnSm} onClick={commit}>
          <Icon name="plus" size={15} /> Add highlight
        </button>
      </div>
    </div>
  );
}

function StringList({
  label,
  addLabel,
  placeholder,
  items,
  onAdd,
  onChange,
  onRemove,
  presets,
  onAddPreset,
}: {
  label: string;
  addLabel: string;
  placeholder: string;
  items: string[];
  onAdd: () => void;
  onChange: (i: number, v: string) => void;
  onRemove: (i: number) => void;
  presets?: string[];
  onAddPreset?: (value: string) => void;
}) {
  const trimmed = items.map((x) => x.trim());
  const available = presets?.filter((p) => !trimmed.includes(p)) ?? [];
  return (
    <div className={styles.listBlock}>
      <div className={styles.listHead}>
        <span className={styles.fieldLabel}>{label}</span>
        <button type="button" className={styles.addBtnSm} onClick={onAdd}>
          <Icon name="plus" size={15} /> {addLabel}
        </button>
      </div>

      {onAddPreset && available.length > 0 ? (
        <div className={styles.presetRow}>
          <span className={styles.presetLabel}>Quick add:</span>
          {available.map((p) => (
            <button key={p} type="button" className={styles.presetChip} onClick={() => onAddPreset(p)}>
              <Icon name="plus" size={12} /> {p}
            </button>
          ))}
        </div>
      ) : null}

      {items.length === 0 ? <p className={styles.emptyHint}>None added yet.</p> : null}
      {items.map((item, i) => (
        <div key={i} className={styles.listRow}>
          <input
            className={styles.input}
            value={item}
            onChange={(e) => onChange(i, e.target.value)}
            placeholder={placeholder}
          />
          <button
            type="button"
            className={styles.iconBtn}
            onClick={() => onRemove(i)}
            aria-label={`Remove ${label} item ${i + 1}`}
          >
            <Icon name="trash" size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}

function ImgPreview({ src, className }: { src: string; className?: string }) {
  const [error, setError] = useState(false);
  const trimmed = src.trim();
  useEffect(() => setError(false), [trimmed]);

  if (!trimmed || error) {
    return (
      <div className={[className, styles.imgEmpty].filter(Boolean).join(' ')}>
        <Icon name="images" size={20} />
        <span>{error ? 'Can’t load image' : 'No image'}</span>
      </div>
    );
  }
  return (
    <img
      className={className}
      src={trimmed}
      alt=""
      loading="lazy"
      onError={() => setError(true)}
    />
  );
}
