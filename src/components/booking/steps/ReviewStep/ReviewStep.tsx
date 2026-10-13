import type { StepProps } from '../stepProps';
import StepShell from '../../StepShell/StepShell';
import { getVehicle } from '@/lib/pricing';
import { formatDate, nightsBetween } from '@/lib/format';
import { plural } from '@/lib/plural';
import { useLocale } from '@/hooks/useLocale';
import { ui } from '@/lib/uiStrings';
import Icon from '@/components/ui/Icon/Icon';
import styles from './ReviewStep.module.scss';

/** Step 4 — confirm everything before the payment step. */
export default function ReviewStep({ tour, data }: StepProps) {
  const locale = useLocale();
  const t = ui(locale).booking;
  const r = t.reviewStep;
  const nights = nightsBetween(data.arrivalDate, data.departureDate);
  const vehicle = getVehicle(data.vehicle);

  const rows: { icon: Parameters<typeof Icon>[0]['name']; label: string; value: string }[] = [
    { icon: 'compass', label: r.tour, value: tour.title },
    { icon: 'users', label: r.travelers, value: `${data.travelers}` },
    { icon: vehicle.icon, label: r.vehicle, value: t.vehicleNames[data.vehicle] },
    {
      icon: 'calendar',
      label: r.inGeorgia,
      value:
        data.arrivalDate && data.departureDate
          ? `${formatDate(data.arrivalDate, locale)} → ${formatDate(data.departureDate, locale)}${
              nights ? ` · ${nights} ${plural(locale, nights, t.units.night)}` : ''
            }`
          : '—',
    },
    { icon: 'guide', label: r.name, value: data.name || '—' },
    { icon: 'mail', label: r.email, value: data.email || '—' },
    { icon: 'phone', label: r.phone, value: data.phone || '—' },
  ];

  return (
    <StepShell title={r.title} description={r.description}>
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
              {r.flights}
            </dt>
            <dd className={styles.desc}>{data.flightDetails}</dd>
          </div>
        ) : null}
      </dl>

      <p className={styles.note}>
        <Icon name="check" size={17} />
        {r.note}
      </p>
    </StepShell>
  );
}
