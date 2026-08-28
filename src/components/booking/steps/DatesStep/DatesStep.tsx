import type { StepProps } from '../stepProps';
import StepShell from '../../StepShell/StepShell';
import TextField from '@/components/ui/TextField/TextField';
import Icon from '@/components/ui/Icon/Icon';
import styles from './DatesStep.module.scss';

/** Step 2 — arrival & departure in Georgia (needed for airport transfers) + flight info. */
export default function DatesStep({ data, errors, update }: StepProps) {
  return (
    <StepShell
      title="When are you in Georgia?"
      description="Because every tour includes airport pickup and drop-off, we need your arrival and departure dates to arrange your transfers."
    >
      <div className={styles.dates}>
        <TextField
          label="Arrival in Georgia"
          type="date"
          icon="calendar"
          required
          placeholder="Select arrival date"
          value={data.arrivalDate}
          onChange={(v) => update('arrivalDate', v)}
          error={errors.arrivalDate}
        />
        <TextField
          label="Departure from Georgia"
          type="date"
          icon="calendar"
          required
          placeholder="Select departure date"
          value={data.departureDate}
          onChange={(v) => update('departureDate', v)}
          error={errors.departureDate}
          min={data.arrivalDate || undefined}
        />
      </div>

      <TextField
        label="Flight details"
        multiline
        rows={3}
        required
        value={data.flightDetails}
        onChange={(v) => update('flightDetails', v)}
        placeholder="e.g. TK378 arriving 14:20, departing TK379 06:40"
        hint="Share your flight numbers and times so we can be at the gate."
        error={errors.flightDetails}
      />

      <p className={styles.note}>
        <Icon name="plane-arrival" size={17} />
        A driver will meet you in the arrivals hall with a name sign, included in
        your price.
      </p>
    </StepShell>
  );
}
