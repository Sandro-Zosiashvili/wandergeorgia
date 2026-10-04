import styles from './StatusBadge.module.scss';

type Tone = 'gold' | 'green' | 'amber' | 'red' | 'blue' | 'muted';

const MAPS: Record<'tour' | 'payment' | 'driver', Record<string, { tone: Tone; label: string }>> = {
  tour: {
    PENDING: { tone: 'amber', label: 'Pending' },
    CONFIRMED: { tone: 'gold', label: 'Confirmed' },
    COMPLETED: { tone: 'green', label: 'Completed' },
    CANCELLED: { tone: 'red', label: 'Cancelled' },
  },
  payment: {
    UNPAID: { tone: 'red', label: 'Unpaid' },
    DEPOSIT_PAID: { tone: 'amber', label: 'Deposit' },
    FULL_PAID: { tone: 'green', label: 'Paid in full' },
  },
  driver: {
    ACTIVE: { tone: 'green', label: 'Active' },
    ON_TOUR: { tone: 'gold', label: 'On tour' },
    INACTIVE: { tone: 'muted', label: 'Inactive' },
  },
};

interface StatusBadgeProps {
  kind: 'tour' | 'payment' | 'driver';
  value: string;
  dot?: boolean;
}

/** Colour-coded status pill shared across the admin tables. */
export default function StatusBadge({ kind, value, dot = true }: StatusBadgeProps) {
  const cfg = MAPS[kind][value] ?? { tone: 'muted' as Tone, label: value };
  return (
    <span className={[styles.badge, styles[cfg.tone]].join(' ')}>
      {dot ? <span className={styles.dot} aria-hidden="true" /> : null}
      {cfg.label}
    </span>
  );
}
