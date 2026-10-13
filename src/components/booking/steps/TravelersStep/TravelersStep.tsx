import type { StepProps } from '../stepProps';
import StepShell from '../../StepShell/StepShell';
import NumberStepper from '@/components/ui/NumberStepper/NumberStepper';
import VehicleSelector from '../../VehicleSelector/VehicleSelector';
import Icon from '@/components/ui/Icon/Icon';
import { useLocale } from '@/hooks/useLocale';
import { ui } from '@/lib/uiStrings';
import styles from './TravelersStep.module.scss';

/** Step 1 — group size and the vehicle that carries them. */
export default function TravelersStep({ tour, data, errors, update }: StepProps) {
  const t = ui(useLocale()).booking.travelersStep;
  return (
    <StepShell title={t.title} description={t.description}>
      <NumberStepper
        label={t.travelersLabel}
        value={data.travelers}
        onChange={(v) => update('travelers', v)}
        min={1}
        max={16}
        hint={t.travelersHint}
      />
      {errors.travelers ? (
        <p className={styles.fieldError} role="alert">
          <Icon name="shield" size={15} />
          {errors.travelers}
        </p>
      ) : null}

      <VehicleSelector
        tour={tour}
        pax={data.travelers}
        value={data.vehicle}
        onChange={(v) => update('vehicle', v)}
        error={errors.vehicle}
      />
    </StepShell>
  );
}
