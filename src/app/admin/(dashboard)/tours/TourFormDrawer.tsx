'use client';

/* eslint-disable @next/next/no-img-element -- admin-only live URL previews; next/image can't optimize arbitrary external URLs here. */

import { useEffect, useState } from 'react';
import Icon from '@/components/ui/Icon/Icon';
import type { IconName } from '@/components/ui/Icon/Icon';
import AdminDrawer from '@/components/admin/AdminDrawer/AdminDrawer';
import type { ApiItineraryDay, TourInput } from '@/lib/toursApi';
import styles from './TourFormDrawer.module.scss';

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
  itinerary: ApiItineraryDay[];
  coverImage: string;
  gallery: string[];
  isActive: boolean;
}

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

/** Convert the form to the API payload. */
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
      .map((d) => ({ title: d.title.trim(), description: d.description.trim() }))
      .filter((d) => d.title || d.description),
    coverImage: f.coverImage.trim(),
    gallery: f.gallery.map((s) => s.trim()).filter(Boolean),
    isActive: f.isActive,
  };
}

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

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

  // Re-seed when a different editor target is opened (parent bumps the key too,
  // but this keeps state correct if the instance is reused).
  useEffect(() => {
    setForm(initial);
    setTab('general');
    setSlugTouched(mode === 'edit');
    setShowErrors(false);
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
  const setString = (key: StringKey, i: number, v: string) =>
    setForm((f) => ({ ...f, [key]: f[key].map((x, idx) => (idx === i ? v : x)) }));
  const removeString = (key: StringKey, i: number) =>
    setForm((f) => ({ ...f, [key]: f[key].filter((_, idx) => idx !== i) }));

  // ── Itinerary helpers ─────────────────────────────────────────────────────
  const addDay = () =>
    setForm((f) => ({ ...f, itinerary: [...f.itinerary, { title: '', description: '' }] }));
  const setDay = (i: number, field: keyof ApiItineraryDay, v: string) =>
    setForm((f) => ({
      ...f,
      itinerary: f.itinerary.map((d, idx) => (idx === i ? { ...d, [field]: v } : d)),
    }));
  const removeDay = (i: number) =>
    setForm((f) => ({ ...f, itinerary: f.itinerary.filter((_, idx) => idx !== i) }));

  const slugValid = SLUG_RE.test(form.slug.trim());
  const titleValid = form.title.trim().length > 0;
  const valid = titleValid && slugValid;

  const handleSave = () => {
    if (!valid) {
      setShowErrors(true);
      setTab('general'); // required fields live here
      return;
    }
    onSubmit(form);
  };

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
            />

            <StringList
              label="Excluded"
              addLabel="Add excluded item"
              placeholder="e.g. Lunch & entry tickets"
              items={form.excluded}
              onAdd={() => addString('excluded')}
              onChange={(i, v) => setString('excluded', i, v)}
              onRemove={(i) => removeString('excluded', i)}
            />
          </div>
        ) : null}

        {/* ── Tab 3: Itinerary ──────────────────────────────────────────── */}
        {tab === 'itinerary' ? (
          <div className={styles.fields}>
            {form.itinerary.length === 0 ? (
              <p className={styles.emptyHint}>No days yet. Build the trip day by day.</p>
            ) : null}
            {form.itinerary.map((day, i) => (
              <div key={i} className={styles.dayCard}>
                <div className={styles.dayHead}>
                  <span className={styles.dayBadge}>Day {i + 1}</span>
                  <button
                    type="button"
                    className={styles.iconBtn}
                    onClick={() => removeDay(i)}
                    aria-label={`Remove day ${i + 1}`}
                  >
                    <Icon name="trash" size={16} />
                  </button>
                </div>
                <input
                  className={styles.input}
                  value={day.title}
                  onChange={(e) => setDay(i, 'title', e.target.value)}
                  placeholder="Day title — e.g. Tbilisi to Kazbegi"
                />
                <textarea
                  className={[styles.input, styles.textarea].join(' ')}
                  rows={3}
                  value={day.description}
                  onChange={(e) => setDay(i, 'description', e.target.value)}
                  placeholder="What happens on this day…"
                />
              </div>
            ))}
            <button type="button" className={styles.addBtn} onClick={addDay}>
              <Icon name="plus" size={16} /> Add day
            </button>
          </div>
        ) : null}

        {/* ── Tab 4: Media ──────────────────────────────────────────────── */}
        {tab === 'media' ? (
          <div className={styles.fields}>
            <Field label="Cover image URL">
              <input
                className={styles.input}
                value={form.coverImage}
                onChange={(e) => set('coverImage', e.target.value)}
                placeholder="https://…"
              />
            </Field>
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
            {form.gallery.map((url, i) => (
              <div key={i} className={styles.galleryRow}>
                <ImgPreview src={url} className={styles.thumb} />
                <input
                  className={styles.input}
                  value={url}
                  onChange={(e) => setString('gallery', i, e.target.value)}
                  placeholder="https://…"
                />
                <button
                  type="button"
                  className={styles.iconBtn}
                  onClick={() => removeString('gallery', i)}
                  aria-label={`Remove gallery image ${i + 1}`}
                >
                  <Icon name="trash" size={16} />
                </button>
              </div>
            ))}
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

function StringList({
  label,
  addLabel,
  placeholder,
  items,
  onAdd,
  onChange,
  onRemove,
}: {
  label: string;
  addLabel: string;
  placeholder: string;
  items: string[];
  onAdd: () => void;
  onChange: (i: number, v: string) => void;
  onRemove: (i: number) => void;
}) {
  return (
    <div className={styles.listBlock}>
      <div className={styles.listHead}>
        <span className={styles.fieldLabel}>{label}</span>
        <button type="button" className={styles.addBtnSm} onClick={onAdd}>
          <Icon name="plus" size={15} /> {addLabel}
        </button>
      </div>
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
