'use client';

import { useState } from 'react';
import Icon from '@/components/ui/Icon/Icon';
import StatusBadge from '@/components/admin/StatusBadge/StatusBadge';
import AdminModal from '@/components/admin/AdminModal/AdminModal';
import { mockDrivers, waLink, type Driver, type DriverStatus } from '@/data/adminMock';
import styles from './Drivers.module.scss';

type DriverForm = Omit<Driver, 'id'>;

const BLANK: DriverForm = {
  name: '',
  phone: '',
  vehicleModel: '',
  plate: '',
  capacity: 4,
  status: 'ACTIVE',
};

const STATUSES: DriverStatus[] = ['ACTIVE', 'ON_TOUR', 'INACTIVE'];

export default function DriversClient() {
  const [drivers, setDrivers] = useState<Driver[]>(mockDrivers);
  const [editing, setEditing] = useState<Driver | null>(null);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<DriverForm>(BLANK);

  const startAdd = () => {
    setEditing(null);
    setForm(BLANK);
    setOpen(true);
  };

  const startEdit = (d: Driver) => {
    setEditing(d);
    setForm({ name: d.name, phone: d.phone, vehicleModel: d.vehicleModel, plate: d.plate, capacity: d.capacity, status: d.status });
    setOpen(true);
  };

  const save = () => {
    if (!form.name.trim()) return;
    if (editing) {
      setDrivers((prev) => prev.map((d) => (d.id === editing.id ? { ...editing, ...form } : d)));
    } else {
      setDrivers((prev) => [{ id: `d${Date.now()}`, ...form }, ...prev]);
    }
    setOpen(false);
  };

  const set = <K extends keyof DriverForm>(key: K, value: DriverForm[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  return (
    <div className={styles.wrap}>
      <header className={styles.head}>
        <div>
          <h1 className={styles.title}>Drivers</h1>
          <p className={styles.sub}>{drivers.length} drivers in the fleet</p>
        </div>
        <button className={styles.addBtn} onClick={startAdd}>
          <Icon name="plus" size={17} />
          Add driver
        </button>
      </header>

      <div className={styles.grid}>
        {drivers.map((d) => (
          <article key={d.id} className={styles.card}>
            <div className={styles.cardTop}>
              <span className={styles.avatar} aria-hidden="true">
                {d.name.split(' ').map((p) => p[0]).slice(0, 2).join('')}
              </span>
              <div className={styles.who}>
                <span className={styles.name}>{d.name}</span>
                <StatusBadge kind="driver" value={d.status} />
              </div>
              <button className={styles.edit} onClick={() => startEdit(d)} aria-label={`Edit ${d.name}`}>
                <Icon name="pencil" size={16} />
              </button>
            </div>

            <dl className={styles.specs}>
              <div><dt>Vehicle</dt><dd>{d.vehicleModel}</dd></div>
              <div><dt>Plate</dt><dd className={styles.plate}>{d.plate}</dd></div>
              <div><dt>Capacity</dt><dd>{d.capacity} pax</dd></div>
            </dl>

            <a className={styles.wa} href={waLink(d.phone)} target="_blank" rel="noopener noreferrer">
              <Icon name="whatsapp" size={16} />
              {d.phone}
            </a>
          </article>
        ))}
      </div>

      <AdminModal
        open={open}
        onClose={() => setOpen(false)}
        title={editing ? 'Edit driver' : 'Add driver'}
        subtitle={editing ? editing.name : 'Add a new driver to the fleet'}
        footer={
          <>
            <button className={styles.ghostBtn} onClick={() => setOpen(false)}>Cancel</button>
            <button className={styles.primaryBtn} onClick={save} disabled={!form.name.trim()}>
              {editing ? 'Save changes' : 'Add driver'}
            </button>
          </>
        }
      >
        <div className={styles.form}>
          <label className={styles.field}>
            <span>Full name</span>
            <input className={styles.input} value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Giorgi Beridze" />
          </label>
          <label className={styles.field}>
            <span>Phone</span>
            <input className={styles.input} value={form.phone} onChange={(e) => set('phone', e.target.value)} placeholder="+995 599 00 00 00" />
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
          <label className={styles.field}>
            <span>Status</span>
            <select className={styles.input} value={form.status} onChange={(e) => set('status', e.target.value as DriverStatus)}>
              {STATUSES.map((s) => (
                <option key={s} value={s}>{s.replace('_', ' ')}</option>
              ))}
            </select>
          </label>
        </div>
      </AdminModal>
    </div>
  );
}
