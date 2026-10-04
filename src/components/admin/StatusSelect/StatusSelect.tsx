'use client';

import Icon from '@/components/ui/Icon/Icon';
import styles from './StatusSelect.module.scss';

type Tone = 'gold' | 'green' | 'amber' | 'red' | 'muted';

const MAPS: Record<'payment' | 'tour', Record<string, { tone: Tone; label: string }>> = {
  payment: {
    UNPAID: { tone: 'red', label: 'Unpaid' },
    DEPOSIT_PAID: { tone: 'amber', label: 'Deposit' },
    FULL_PAID: { tone: 'green', label: 'Paid in full' },
  },
  tour: {
    PENDING: { tone: 'amber', label: 'Pending' },
    CONFIRMED: { tone: 'gold', label: 'Confirmed' },
    COMPLETED: { tone: 'green', label: 'Completed' },
    CANCELLED: { tone: 'red', label: 'Cancelled' },
  },
};

interface StatusSelectProps {
  kind: 'payment' | 'tour';
  value: string;
  onChange: (value: string) => void;
}

/** Badge-styled native <select> that recolours to match the chosen status. */
export default function StatusSelect({ kind, value, onChange }: StatusSelectProps) {
  const map = MAPS[kind];
  const tone = map[value]?.tone ?? 'muted';

  return (
    <span className={[styles.wrap, styles[tone]].join(' ')}>
      <span className={styles.dot} aria-hidden="true" />
      <select
        className={styles.select}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={kind === 'payment' ? 'Payment status' : 'Tour status'}
      >
        {Object.entries(map).map(([key, cfg]) => (
          <option key={key} value={key}>{cfg.label}</option>
        ))}
      </select>
      <Icon name="chevron-down" size={13} className={styles.chev} />
    </span>
  );
}
