import type { StepProps } from '../stepProps';
import StepShell from '../../StepShell/StepShell';
import TextField from '@/components/ui/TextField/TextField';
import { useLocale } from '@/hooks/useLocale';
import { ui } from '@/lib/uiStrings';
import styles from './DetailsStep.module.scss';

/** Step 3 — contact details. */
export default function DetailsStep({ data, errors, update }: StepProps) {
  const t = ui(useLocale()).booking.detailsStep;
  return (
    <StepShell title={t.title} description={t.description}>
      <TextField
        label={t.nameLabel}
        icon="guide"
        required
        value={data.name}
        onChange={(v) => update('name', v)}
        error={errors.name}
        placeholder={t.namePlaceholder}
      />

      <div className={styles.row}>
        <TextField
          label={t.emailLabel}
          type="email"
          icon="mail"
          required
          value={data.email}
          onChange={(v) => update('email', v)}
          error={errors.email}
          placeholder={t.emailPlaceholder}
        />
        <TextField
          label={t.phoneLabel}
          type="tel"
          icon="phone"
          required
          value={data.phone}
          onChange={(v) => update('phone', v)}
          error={errors.phone}
          placeholder={t.phonePlaceholder}
        />
      </div>
    </StepShell>
  );
}
