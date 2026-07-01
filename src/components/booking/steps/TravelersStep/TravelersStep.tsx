import type { StepProps } from '../stepProps';
import StepShell from '../../StepShell/StepShell';
import NumberStepper from '@/components/ui/NumberStepper/NumberStepper';
import Icon from '@/components/ui/Icon/Icon';
import styles from './TravelersStep.module.scss';

/** Step 1 — how many travelers. */
export default function TravelersStep({ data, update }: StepProps) {
  return (
    <StepShell
      title="How many travelers?"
      description="Your tour is entirely private — the group is only ever you and yours."
    >
      <NumberStepper
        label="Travelers"
        value={data.travelers}
        onChange={(v) => update('travelers', v)}
        min={1}
        max={16}
        hint="Traveling with a larger group? Let us know and we'll tailor the vehicle."
      />

      <p className={styles.note}>
        <Icon name="users" size={17} />
        Infants and children are welcome — just add them to the count and mention
        ages later.
      </p>
    </StepShell>
  );
}
