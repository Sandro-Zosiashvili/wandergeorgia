import type { StepProps } from '../stepProps';
import StepShell from '../../StepShell/StepShell';
import TextField from '@/components/ui/TextField/TextField';
import styles from './DetailsStep.module.scss';

/** Step 3 — contact details. */
export default function DetailsStep({ data, errors, update }: StepProps) {
  return (
    <StepShell
      title="Your details"
      description="Just so we can confirm your booking and reach you before the trip."
    >
      <TextField
        label="Full name"
        icon="guide"
        required
        value={data.name}
        onChange={(v) => update('name', v)}
        error={errors.name}
        placeholder="Jane Doe"
      />

      <div className={styles.row}>
        <TextField
          label="Email"
          type="email"
          icon="mail"
          required
          value={data.email}
          onChange={(v) => update('email', v)}
          error={errors.email}
          placeholder="jane@example.com"
        />
        <TextField
          label="Phone"
          type="tel"
          icon="phone"
          required
          value={data.phone}
          onChange={(v) => update('phone', v)}
          error={errors.phone}
          placeholder="+1 555 123 4567"
        />
      </div>
    </StepShell>
  );
}
