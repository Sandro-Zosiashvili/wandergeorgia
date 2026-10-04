'use client';

import { useState } from 'react';
import Icon from '@/components/ui/Icon/Icon';
import Toggle from '@/components/admin/Toggle/Toggle';
import AdminModal from '@/components/admin/AdminModal/AdminModal';
import { mockTours, type AdminTour } from '@/data/adminMock';
import styles from './Tours.module.scss';

type TourForm = { name: string; city: string; type: AdminTour['type']; price: number };
const BLANK: TourForm = { name: '', city: '', type: 'one-day', price: 120 };

export default function ToursClient() {
  const [tours, setTours] = useState<AdminTour[]>(mockTours);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<TourForm>(BLANK);

  const activeCount = tours.filter((t) => t.active).length;

  const setActive = (id: string, active: boolean) =>
    setTours((prev) => prev.map((t) => (t.id === id ? { ...t, active } : t)));

  const setPrice = (id: string, price: number) =>
    setTours((prev) => prev.map((t) => (t.id === id ? { ...t, price } : t)));

  const addTour = () => {
    if (!form.name.trim()) return;
    setTours((prev) => [
      {
        id: `t${Date.now()}`,
        slug: form.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
        name: form.name.trim(),
        city: form.city.trim() || '—',
        type: form.type,
        price: form.price,
        active: true,
      },
      ...prev,
    ]);
    setOpen(false);
    setForm(BLANK);
  };

  return (
    <div className={styles.wrap}>
      <header className={styles.head}>
        <div>
          <h1 className={styles.title}>Tours</h1>
          <p className={styles.sub}>{activeCount} of {tours.length} tours active on the website</p>
        </div>
        <button className={styles.addBtn} onClick={() => { setForm(BLANK); setOpen(true); }}>
          <Icon name="plus" size={17} />
          Add new tour
        </button>
      </header>

      <div className={styles.list}>
        <div className={[styles.row, styles.headerRow].join(' ')}>
          <span>Tour</span>
          <span className={styles.colType}>Type</span>
          <span className={styles.colPrice}>Base price</span>
          <span className={styles.colActive}>Active</span>
        </div>

        {tours.map((t) => (
          <div key={t.id} className={styles.row}>
            <div className={styles.tourInfo}>
              <span className={styles.tourName}>{t.name}</span>
              <span className={styles.tourCity}>
                <Icon name="map-pin" size={13} /> {t.city}
              </span>
            </div>

            <span className={[styles.typeBadge, styles.colType].join(' ')}>
              {t.type === 'multi-day' ? 'Multi-day' : 'Day tour'}
            </span>

            <label className={[styles.priceEditor, styles.colPrice].join(' ')}>
              <span className={styles.currency}>$</span>
              <input
                type="number"
                min={0}
                step={10}
                value={t.price}
                onChange={(e) => setPrice(t.id, Number(e.target.value) || 0)}
                className={styles.priceInput}
                aria-label={`Base price for ${t.name}`}
              />
            </label>

            <div className={[styles.toggleCell, styles.colActive].join(' ')}>
              <Toggle checked={t.active} onChange={(v) => setActive(t.id, v)} label={`Toggle ${t.name}`} />
              <span className={t.active ? styles.on : styles.off}>{t.active ? 'Active' : 'Disabled'}</span>
            </div>
          </div>
        ))}
      </div>

      <AdminModal
        open={open}
        onClose={() => setOpen(false)}
        title="Add new tour"
        subtitle="Add a tour to the catalog"
        footer={
          <>
            <button className={styles.ghostBtn} onClick={() => setOpen(false)}>Cancel</button>
            <button className={styles.primaryBtn} onClick={addTour} disabled={!form.name.trim()}>Add tour</button>
          </>
        }
      >
        <div className={styles.form}>
          <label className={styles.field}>
            <span>Tour name</span>
            <input className={styles.input} value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Svaneti Highlands Tour" />
          </label>
          <label className={styles.field}>
            <span>City / region</span>
            <input className={styles.input} value={form.city} onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))} placeholder="Mestia" />
          </label>
          <div className={styles.row2}>
            <label className={styles.field}>
              <span>Type</span>
              <select className={styles.input} value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as AdminTour['type'] }))}>
                <option value="one-day">Day tour</option>
                <option value="multi-day">Multi-day</option>
              </select>
            </label>
            <label className={styles.field}>
              <span>Base price (USD)</span>
              <input className={styles.input} type="number" min={0} step={10} value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: Number(e.target.value) || 0 }))} />
            </label>
          </div>
        </div>
      </AdminModal>
    </div>
  );
}
