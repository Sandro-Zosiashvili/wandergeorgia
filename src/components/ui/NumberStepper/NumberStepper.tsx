import { useId } from 'react';
import Icon from '../Icon/Icon';
import styles from './NumberStepper.module.scss';

interface NumberStepperProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  hint?: string;
}

/** Accessible +/− stepper for small integer quantities (e.g. travelers). */
export default function NumberStepper({
  label,
  value,
  onChange,
  min = 1,
  max = 20,
  hint,
}: NumberStepperProps) {
  const id = useId();
  const clamp = (n: number) => Math.min(max, Math.max(min, n));

  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>

      <div className={styles.stepper}>
        <button
          type="button"
          className={styles.btn}
          onClick={() => onChange(clamp(value - 1))}
          disabled={value <= min}
          aria-label={`Decrease ${label}`}
        >
          <Icon name="minus" size={18} />
        </button>

        <input
          id={id}
          type="number"
          className={styles.value}
          value={value}
          min={min}
          max={max}
          onChange={(e) => {
            const n = Number(e.target.value);
            if (!Number.isNaN(n)) onChange(clamp(n));
          }}
          aria-live="polite"
        />

        <button
          type="button"
          className={styles.btn}
          onClick={() => onChange(clamp(value + 1))}
          disabled={value >= max}
          aria-label={`Increase ${label}`}
        >
          <Icon name="plus" size={18} />
        </button>
      </div>

      {hint ? <p className={styles.hint}>{hint}</p> : null}
    </div>
  );
}
