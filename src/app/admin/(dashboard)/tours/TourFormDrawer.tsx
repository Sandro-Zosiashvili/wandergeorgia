'use client';

/* eslint-disable @next/next/no-img-element -- admin-only live URL previews; next/image can't optimize arbitrary external URLs here. */

import { useEffect, useRef, useState } from 'react';
import Icon from '@/components/ui/Icon/Icon';
import type { IconName } from '@/components/ui/Icon/Icon';
import AdminDrawer from '@/components/admin/AdminDrawer/AdminDrawer';
import type { TourInput, TourI18nFields } from '@/lib/toursApi';
import styles from './TourFormDrawer.module.scss';

/**
 * An itinerary day in the editor. `uid` is a stable key for reorder/collapse.
 * The `ru*` fields hold the Russian translation, kept index-aligned with the
 * English `highlights` so nothing is dropped on the public RU site.
 */
export interface ItineraryFormDay {
  uid: string;
  title: string;
  description: string;
  highlights: string[];
  ruTitle: string;
  ruDescription: string;
  ruHighlights: string[];
}

/** Russian overrides for the translatable scalar + list fields. Arrays are
 *  index-aligned with their English counterparts. */
export interface TourRuFields {
  title: string;
  location: string;
  duration: string;
  overview: string;
  highlights: string[];
  included: string[];
  excluded: string[];
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
  /** Russian content overrides (English lives in the base fields above). */
  ru: TourRuFields;
}

/** Which language the translatable content inputs are currently editing. */
export type EditLang = 'en' | 'ru';

const uid = () =>
  typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `d${Date.now()}${Math.random().toString(36).slice(2, 8)}`;

/**
 * Wrap a plain itinerary day (from the API) with a stable editor uid, merging
 * the matching Russian day (`ruDay`, same index) so its translation prefills.
 */
export const toFormDay = (
  d: { title: string; description: string; highlights?: string[] },
  ruDay?: { title?: string; description?: string; highlights?: string[] },
): ItineraryFormDay => {
  const highlights = d.highlights ?? [];
  const ruHl = ruDay?.highlights ?? [];
  return {
    uid: uid(),
    title: d.title,
    description: d.description,
    highlights,
    ruTitle: ruDay?.title ?? '',
    ruDescription: ruDay?.description ?? '',
    // Keep RU highlights index-aligned with the English ones.
    ruHighlights: highlights.map((_, i) => ruHl[i] ?? ''),
  };
};

const blankRu = (): TourRuFields => ({
  title: '',
  location: '',
  duration: '',
  overview: '',
  highlights: [],
  included: [],
  excluded: [],
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
  ru: blankRu(),
});

/**
 * Build the Russian override payload. Arrays fall back to English per item so a
 * partially-translated list never drops entries on the public RU site; a field
 * is only included when the admin actually translated something, otherwise the
 * public resolver falls back to the English base field.
 */
function toRuFields(f: TourFormState): TourI18nFields | undefined {
  const ru: TourI18nFields = {};
  const t = (s: string) => s.trim();

  if (t(f.ru.title)) ru.title = t(f.ru.title);
  if (t(f.ru.location)) ru.location = t(f.ru.location);
  if (t(f.ru.duration)) ru.duration = t(f.ru.duration);
  if (t(f.ru.overview)) ru.overview = t(f.ru.overview);

  const list = (en: string[], rus: string[]): string[] | undefined => {
    const enTrim = en.map(t).filter(Boolean);
    const translated = enTrim.some((_, i) => t(rus[i] ?? ''));
    if (!translated) return undefined;
    // Full-length, English-filled where a translation is missing.
    return enTrim.map((e, i) => t(rus[i] ?? '') || e);
  };
  const h = list(f.highlights, f.ru.highlights);
  const inc = list(f.included, f.ru.included);
  const exc = list(f.excluded, f.ru.excluded);
  if (h) ru.highlights = h;
  if (inc) ru.included = inc;
  if (exc) ru.excluded = exc;

  const enDays = f.itinerary.filter((d) => d.title.trim() || d.description.trim() || d.highlights.length);
  const anyRuDay = enDays.some(
    (d) => d.ruTitle.trim() || d.ruDescription.trim() || d.ruHighlights.some((x) => t(x)),
  );
  if (anyRuDay) {
    ru.itinerary = enDays.map((d) => {
      const enHl = d.highlights.map(t).filter(Boolean);
      return {
        title: t(d.ruTitle) || t(d.title),
        description: t(d.ruDescription) || t(d.description),
        highlights: enHl.map((e, i) => t(d.ruHighlights[i] ?? '') || e),
      };
    });
  }

  return Object.keys(ru).length ? ru : undefined;
}

/** Convert the form to the API payload (strips editor-only `uid`). */
export function toTourInput(f: TourFormState): TourInput {
  const ru = toRuFields(f);
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
    // Only send i18n when there's a translation — keeps PATCH from wiping it.
    ...(ru ? { i18n: { ru } } : {}),
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

/** Translatable string-array fields (kept index-aligned between EN and RU). */
type TransListKey = 'highlights' | 'included' | 'excluded';

/** Guarantee the RU sub-object and per-day RU fields exist, so a form coming
 *  from older data (or preserved across HMR) never crashes the editor. */
function normalizeForm(f: TourFormState): TourFormState {
  return {
    ...f,
    ru: f.ru ?? blankRu(),
    itinerary: (f.itinerary ?? []).map((d) => ({
      ...d,
      ruTitle: d.ruTitle ?? '',
      ruDescription: d.ruDescription ?? '',
      ruHighlights: d.ruHighlights ?? [],
    })),
  };
}

export default function TourFormDrawer({ open, mode, initial, saving, onCancel, onSubmit }: Props) {
  const [form, setForm] = useState<TourFormState>(() => normalizeForm(initial));
  const [tab, setTab] = useState<TabId>('general');
  const [editLang, setEditLang] = useState<EditLang>('en');
  const [slugTouched, setSlugTouched] = useState(mode === 'edit');
  const [showErrors, setShowErrors] = useState(false);
  const [openDays, setOpenDays] = useState<Set<string>>(new Set());
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    setForm(normalizeForm(initial));
    setTab('general');
    setEditLang('en');
    setSlugTouched(mode === 'edit');
    setShowErrors(false);
    setOpenDays(new Set()); // long itineraries start collapsed
  }, [initial, mode]);

  const set = <K extends keyof TourFormState>(key: K, value: TourFormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  /** Set a Russian scalar override (title/location/duration/overview). */
  const setRu = <K extends keyof TourRuFields>(key: K, value: TourRuFields[K]) =>
    setForm((f) => ({ ...f, ru: { ...f.ru, [key]: value } }));

  const onTitleChange = (value: string) =>
    setForm((f) => ({
      ...f,
      title: value,
      slug: !slugTouched && mode === 'create' ? slugify(value) : f.slug,
    }));

  // ── Dynamic string-array helpers ──────────────────────────────────────────
  // Translatable lists keep a parallel RU array the same length as the English
  // one, so row N in RU always lines up with row N in English.
  const isTrans = (key: StringKey): key is TransListKey =>
    key === 'highlights' || key === 'included' || key === 'excluded';

  const addString = (key: StringKey) =>
    setForm((f) =>
      isTrans(key)
        ? { ...f, [key]: [...f[key], ''], ru: { ...f.ru, [key]: [...f.ru[key], ''] } }
        : { ...f, [key]: [...f[key], ''] },
    );
  const addStringValue = (key: StringKey, value: string) =>
    setForm((f) => {
      if (f[key].includes(value)) return f;
      return isTrans(key)
        ? { ...f, [key]: [...f[key], value], ru: { ...f.ru, [key]: [...f.ru[key], ''] } }
        : { ...f, [key]: [...f[key], value] };
    });
  const setString = (key: StringKey, i: number, v: string) =>
    setForm((f) => ({ ...f, [key]: f[key].map((x, idx) => (idx === i ? v : x)) }));
  /** Edit a RU translation-list value at row `i`. */
  const setRuString = (key: TransListKey, i: number, v: string) =>
    setForm((f) => ({ ...f, ru: { ...f.ru, [key]: f.ru[key].map((x, idx) => (idx === i ? v : x)) } }));
  const removeString = (key: StringKey, i: number) =>
    setForm((f) =>
      isTrans(key)
        ? {
            ...f,
            [key]: f[key].filter((_, idx) => idx !== i),
            ru: { ...f.ru, [key]: f.ru[key].filter((_, idx) => idx !== i) },
          }
        : { ...f, [key]: f[key].filter((_, idx) => idx !== i) },
    );

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
    const day: ItineraryFormDay = {
      uid: uid(),
      title: '',
      description: '',
      highlights: [],
      ruTitle: '',
      ruDescription: '',
      ruHighlights: [],
    };
    setForm((f) => ({ ...f, itinerary: [...f.itinerary, day] }));
    setOpenDays((prev) => new Set(prev).add(day.uid)); // open the new day
  };
  const setDay = (
    i: number,
    field: 'title' | 'description' | 'ruTitle' | 'ruDescription',
    v: string,
  ) =>
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
        i === dayIdx
          ? { ...d, highlights: [...(d.highlights ?? []), value], ruHighlights: [...(d.ruHighlights ?? []), ''] }
          : d,
      ),
    }));
  const removeDayHighlight = (dayIdx: number, hi: number) =>
    setForm((f) => ({
      ...f,
      itinerary: f.itinerary.map((d, i) =>
        i === dayIdx
          ? {
              ...d,
              highlights: (d.highlights ?? []).filter((_, j) => j !== hi),
              ruHighlights: (d.ruHighlights ?? []).filter((_, j) => j !== hi),
            }
          : d,
      ),
    }));
  /** Edit a RU day highlight at index `hi`. */
  const setRuDayHighlight = (dayIdx: number, hi: number, v: string) =>
    setForm((f) => ({
      ...f,
      itinerary: f.itinerary.map((d, i) =>
        i === dayIdx
          ? { ...d, ruHighlights: (d.ruHighlights ?? []).map((x, j) => (j === hi ? v : x)) }
          : d,
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
        {/* Content-language switch — admin chrome stays English; this only
            changes which language the translatable fields below are editing.
            Hidden on Media (images aren't translated). */}
        {tab !== 'media' ? (
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
                Optional — any field left blank falls back to English on the site.
              </span>
            ) : null}
          </div>
        ) : null}

        {/* ── Tab 1: General ────────────────────────────────────────────── */}
        {tab === 'general' ? (
          <div className={styles.fields}>
            <Field label={editLang === 'en' ? 'Title' : 'Title (Russian)'} required={editLang === 'en'}>
              {editLang === 'en' ? (
                <>
                  <input
                    className={[styles.input, showErrors && !titleValid ? styles.inputError : '']
                      .filter(Boolean)
                      .join(' ')}
                    value={form.title}
                    onChange={(e) => onTitleChange(e.target.value)}
                    placeholder="Svaneti Highlands Tour"
                  />
                  {showErrors && !titleValid ? <span className={styles.err}>Title is required.</span> : null}
                </>
              ) : (
                <input
                  className={styles.input}
                  value={form.ru.title}
                  onChange={(e) => setRu('title', e.target.value)}
                  placeholder={form.title || 'Русское название'}
                />
              )}
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
              <Field label={editLang === 'en' ? 'Location / region' : 'Location / region (Russian)'}>
                {editLang === 'en' ? (
                  <input
                    className={styles.input}
                    value={form.location}
                    onChange={(e) => set('location', e.target.value)}
                    placeholder="Mestia"
                  />
                ) : (
                  <input
                    className={styles.input}
                    value={form.ru.location}
                    onChange={(e) => setRu('location', e.target.value)}
                    placeholder={form.location || 'Местия'}
                  />
                )}
              </Field>
              <Field label={editLang === 'en' ? 'Duration' : 'Duration (Russian)'}>
                {editLang === 'en' ? (
                  <input
                    className={styles.input}
                    value={form.duration}
                    onChange={(e) => set('duration', e.target.value)}
                    placeholder="8 hours / 4 days"
                  />
                ) : (
                  <input
                    className={styles.input}
                    value={form.ru.duration}
                    onChange={(e) => setRu('duration', e.target.value)}
                    placeholder={form.duration || '8 часов / 4 дня'}
                  />
                )}
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
            <Field label={editLang === 'en' ? 'Overview' : 'Overview (Russian)'}>
              {editLang === 'en' ? (
                <textarea
                  className={[styles.input, styles.textarea].join(' ')}
                  rows={5}
                  value={form.overview}
                  onChange={(e) => set('overview', e.target.value)}
                  placeholder="A longer introduction shown on the tour detail page…"
                />
              ) : (
                <textarea
                  className={[styles.input, styles.textarea].join(' ')}
                  rows={5}
                  value={form.ru.overview}
                  onChange={(e) => setRu('overview', e.target.value)}
                  placeholder={form.overview || 'Русское описание тура…'}
                />
              )}
            </Field>

            <TranslatableStringList
              lang={editLang}
              label="Highlights"
              addLabel="Add highlight"
              placeholder="e.g. Gergeti Trinity Church"
              items={form.highlights}
              ruItems={form.ru.highlights}
              onAdd={() => addString('highlights')}
              onChange={(i, v) => setString('highlights', i, v)}
              onChangeRu={(i, v) => setRuString('highlights', i, v)}
              onRemove={(i) => removeString('highlights', i)}
            />

            <TranslatableStringList
              lang={editLang}
              label="Included"
              addLabel="Add included item"
              placeholder="e.g. Private driver & fuel"
              items={form.included}
              ruItems={form.ru.included}
              onAdd={() => addString('included')}
              onChange={(i, v) => setString('included', i, v)}
              onChangeRu={(i, v) => setRuString('included', i, v)}
              onRemove={(i) => removeString('included', i)}
              presets={INCLUDED_PRESETS}
              onAddPreset={(v) => addStringValue('included', v)}
            />

            <TranslatableStringList
              lang={editLang}
              label="Excluded"
              addLabel="Add excluded item"
              placeholder="e.g. Lunch & entry tickets"
              items={form.excluded}
              ruItems={form.ru.excluded}
              onAdd={() => addString('excluded')}
              onChange={(i, v) => setString('excluded', i, v)}
              onChangeRu={(i, v) => setRuString('excluded', i, v)}
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
                        value={editLang === 'en' ? day.title : day.ruTitle}
                        onChange={(e) => setDay(i, editLang === 'en' ? 'title' : 'ruTitle', e.target.value)}
                        placeholder={
                          editLang === 'en'
                            ? 'Day title — e.g. Tbilisi to Kazbegi'
                            : day.title || 'Название дня (рус.)'
                        }
                      />
                      <DayHighlights
                        lang={editLang}
                        highlights={day.highlights ?? []}
                        ruHighlights={day.ruHighlights ?? []}
                        onAdd={(v) => addDayHighlight(i, v)}
                        onRemove={(hi) => removeDayHighlight(i, hi)}
                        onChangeRu={(hi, v) => setRuDayHighlight(i, hi, v)}
                      />
                      <textarea
                        className={[styles.input, styles.textarea].join(' ')}
                        rows={3}
                        value={editLang === 'en' ? day.description : day.ruDescription}
                        onChange={(e) =>
                          setDay(i, editLang === 'en' ? 'description' : 'ruDescription', e.target.value)
                        }
                        placeholder={
                          editLang === 'en' ? 'What happens on this day…' : day.description || 'Описание дня…'
                        }
                      />
                    </div>
                  ) : null}
                </div>
              );
            })}
            {editLang === 'en' ? (
              <button type="button" className={styles.addBtn} onClick={addDay}>
                <Icon name="plus" size={16} /> Add day
              </button>
            ) : (
              <p className={styles.emptyHint}>
                Switch to English to add or reorder days — Russian only translates them.
              </p>
            )}
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
  lang,
  highlights,
  ruHighlights,
  onAdd,
  onRemove,
  onChangeRu,
}: {
  lang: EditLang;
  highlights: string[];
  ruHighlights: string[];
  onAdd: (value: string) => void;
  onRemove: (index: number) => void;
  onChangeRu: (index: number, value: string) => void;
}) {
  const [draft, setDraft] = useState('');
  const commit = () => {
    const v = draft.trim();
    if (!v) return;
    onAdd(v);
    setDraft('');
  };

  // Russian: translate each existing English highlight in place (no add/remove).
  if (lang === 'ru') {
    return (
      <div className={styles.dayHl}>
        <span className={styles.dayHlLabel}>Day highlights (Russian)</span>
        {highlights.length === 0 ? (
          <p className={styles.emptyHint}>Add highlights in English first.</p>
        ) : (
          highlights.map((h, i) => (
            <div key={i} className={styles.transRow}>
              <span className={styles.transEn}>{h.trim() || '—'}</span>
              <input
                className={styles.input}
                value={ruHighlights[i] ?? ''}
                onChange={(e) => onChangeRu(i, e.target.value)}
                placeholder="Перевод"
              />
            </div>
          ))
        )}
      </div>
    );
  }

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

/**
 * A list of short strings that can be edited in English (add / remove / presets)
 * or translated into Russian. In RU mode the English item is shown beside a
 * Russian input, kept index-aligned, with no structural edits — so translations
 * line up and are never dropped.
 */
function TranslatableStringList({
  lang,
  label,
  addLabel,
  placeholder,
  items,
  ruItems,
  onAdd,
  onChange,
  onChangeRu,
  onRemove,
  presets,
  onAddPreset,
}: {
  lang: EditLang;
  label: string;
  addLabel: string;
  placeholder: string;
  items: string[];
  ruItems: string[];
  onAdd: () => void;
  onChange: (i: number, v: string) => void;
  onChangeRu: (i: number, v: string) => void;
  onRemove: (i: number) => void;
  presets?: string[];
  onAddPreset?: (value: string) => void;
}) {
  if (lang === 'ru') {
    return (
      <div className={styles.listBlock}>
        <div className={styles.listHead}>
          <span className={styles.fieldLabel}>{label} (Russian)</span>
        </div>
        {items.length === 0 ? (
          <p className={styles.emptyHint}>Add {label.toLowerCase()} in English first.</p>
        ) : (
          items.map((item, i) => (
            <div key={i} className={styles.transRow}>
              <span className={styles.transEn}>{item.trim() || '—'}</span>
              <input
                className={styles.input}
                value={ruItems[i] ?? ''}
                onChange={(e) => onChangeRu(i, e.target.value)}
                placeholder="Перевод"
              />
            </div>
          ))
        )}
      </div>
    );
  }

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
