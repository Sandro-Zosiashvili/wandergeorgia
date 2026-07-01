import type { StepProps } from '../stepProps';
import StepShell from '../../StepShell/StepShell';
import { formatDate, nightsBetween } from '@/lib/format';
import Icon from '@/components/ui/Icon/Icon';
import styles from './ReviewStep.module.scss';

/** Step 4 — confirm everything before the payment step. */
export default function ReviewStep({ tour, data }: StepProps) {
  const nights = nightsBetween(data.arrivalDate, data.departureDate);

  const rows: { icon: Parameters<typeof Icon>[0]['name']; label: string; value: string }[] = [
    { icon: 'compass', label: 'Tour', value: tour.title },
    { icon: 'users', label: 'Travelers', value: `${data.travelers}` },
    {
      icon: 'calendar',
      label: 'In Georgia',
      value:
        data.arrivalDate && data.departureDate
          ? `${formatDate(data.arrivalDate)} → ${formatDate(data.departureDate)}${
              nights ? ` · ${nights} night${nights === 1 ? '' : 's'}` : ''
            }`
          : '—',
    },
    { icon: 'guide', label: 'Name', value: data.name || '—' },
    { icon: 'mail', label: 'Email', value: data.email || '—' },
    { icon: 'phone', label: 'Phone', value: data.phone || '—' },
  ];

  return (
    <StepShell
      title="Review your booking"
      description="Please check the details below. You won't be charged yet — the next step is payment."
    >
      <dl className={styles.list}>
        {rows.map((row) => (
          <div key={row.label} className={styles.row}>
            <dt className={styles.term}>
              <Icon name={row.icon} size={17} />
              {row.label}
            </dt>
            <dd className={styles.desc}>{row.value}</dd>
          </div>
        ))}
        {data.flightDetails ? (
          <div className={styles.row}>
            <dt className={styles.term}>
              <Icon name="plane-arrival" size={17} />
              Flights
            </dt>
            <dd className={styles.desc}>{data.flightDetails}</dd>
          </div>
        ) : null}
      </dl>

      <p className={styles.note}>
        <Icon name="check" size={17} />
        Airport pickup on arrival and drop-off on departure are included.
      </p>
    </StepShell>
  );
}
