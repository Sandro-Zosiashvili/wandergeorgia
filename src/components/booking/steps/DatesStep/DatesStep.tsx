import type { StepProps } from '../stepProps';
import StepShell from '../../StepShell/StepShell';
import TextField from '@/components/ui/TextField/TextField';
import Icon from '@/components/ui/Icon/Icon';
import { useLocale } from '@/hooks/useLocale';
import { ui } from '@/lib/uiStrings';
import styles from './DatesStep.module.scss';

/** Step 2 — arrival & departure in Georgia (needed for airport transfers) + flight info. */
export default function DatesStep({ data, errors, update }: StepProps) {
  const t = ui(useLocale()).booking.datesStep;
  return (
    <StepShell title={t.title} description={t.description}>
      <div className={styles.dates}>
        <TextField
          label={t.arrivalLabel}
          type="date"
          icon="calendar"
          required
          placeholder={t.arrivalPlaceholder}
          value={data.arrivalDate}
          onChange={(v) => update('arrivalDate', v)}
          error={errors.arrivalDate}
        />
        <TextField
          label={t.departureLabel}
          type="date"
          icon="calendar"
          required
          placeholder={t.departurePlaceholder}
          value={data.departureDate}
          onChange={(v) => update('departureDate', v)}
          error={errors.departureDate}
          min={data.arrivalDate || undefined}
        />
      </div>

      <TextField
        label={t.flightLabel}
        multiline
        rows={3}
        required
        value={data.flightDetails}
        onChange={(v) => update('flightDetails', v)}
        placeholder={t.flightPlaceholder}
        hint={t.flightHint}
        error={errors.flightDetails}
      />

      <p className={styles.note}>
        <Icon name="plane-arrival" size={17} />
        {t.note}
      </p>
    </StepShell>
  );
}
