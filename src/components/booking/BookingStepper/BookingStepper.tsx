'use client';

import { bookingSteps } from '@/hooks/useBooking';
import Icon from '@/components/ui/Icon/Icon';
import styles from './BookingStepper.module.scss';

interface BookingStepperProps {
  currentIndex: number;
  onStepClick: (index: number) => void;
}

/** Horizontal progress indicator for the booking flow. */
export default function BookingStepper({ currentIndex, onStepClick }: BookingStepperProps) {
  return (
    <ol className={styles.stepper}>
      {bookingSteps.map((step, i) => {
        const state =
          i < currentIndex ? 'done' : i === currentIndex ? 'current' : 'upcoming';
        const clickable = i < currentIndex;

        return (
          <li key={step.id} className={[styles.step, styles[state]].join(' ')}>
            <button
              type="button"
              className={styles.trigger}
              onClick={() => clickable && onStepClick(i)}
              disabled={!clickable}
              aria-current={state === 'current' ? 'step' : undefined}
            >
              <span className={styles.marker}>
                {state === 'done' ? <Icon name="check" size={15} /> : i + 1}
              </span>
              <span className={styles.label}>{step.label}</span>
            </button>
            {i < bookingSteps.length - 1 ? (
              <span className={styles.connector} aria-hidden="true" />
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}
