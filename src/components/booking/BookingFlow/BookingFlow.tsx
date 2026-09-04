'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import type { Tour } from '@/types/tour';
import { useBooking } from '@/hooks/useBooking';
import BookingStepper from '../BookingStepper/BookingStepper';
import OrderSummary from '../OrderSummary/OrderSummary';
import TravelersStep from '../steps/TravelersStep/TravelersStep';
import DatesStep from '../steps/DatesStep/DatesStep';
import DetailsStep from '../steps/DetailsStep/DetailsStep';
import ReviewStep from '../steps/ReviewStep/ReviewStep';
import PaymentStep from '../steps/PaymentStep/PaymentStep';
import Button from '@/components/ui/Button/Button';
import styles from './BookingFlow.module.scss';

interface BookingFlowProps {
  tour: Tour;
}

/** Orchestrates the multi-step booking UI: stepper, animated steps, summary. */
export default function BookingFlow({ tour }: BookingFlowProps) {
  const booking = useBooking(tour);
  const {
    data,
    errors,
    step,
    stepIndex,
    isFirst,
    isLast,
    isComplete,
    isSubmitting,
    submitError,
    total,
    update,
  } = booking;

  const stepProps = { tour, data, errors, update };

  // When the step changes, bring the top of the form panel back under the
  // header. Without this the scroll position carried over from a long step
  // (or a scrolled-down mobile view), leaving the next step opening partway
  // down. Skip the very first render so arriving at the page doesn't yank the
  // view around.
  const panelRef = useRef<HTMLDivElement>(null);
  const mounted = useRef(false);
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    // No explicit `behavior`: it inherits the page's CSS scroll-behavior
    // (smooth), so it animates on browsers that support it and falls back to an
    // instant jump elsewhere (older iOS Safari) or when the visitor prefers
    // reduced motion — never a no-op that leaves the step mis-scrolled.
    panelRef.current?.scrollIntoView({ block: 'start' });
  }, [stepIndex, isComplete]);

  const renderStep = () => {
    switch (step) {
      case 'travelers':
        return <TravelersStep {...stepProps} />;
      case 'dates':
        return <DatesStep {...stepProps} />;
      case 'details':
        return <DetailsStep {...stepProps} />;
      case 'review':
        return <ReviewStep {...stepProps} />;
      case 'confirm':
        return (
          <PaymentStep
            total={total}
            isComplete={isComplete}
            isSubmitting={isSubmitting}
            submitError={submitError}
            onSubmit={booking.submit}
          />
        );
    }
  };

  return (
    <div className={styles.flow}>
      <div className={styles.panel} ref={panelRef}>
        {!isComplete ? (
          <BookingStepper currentIndex={stepIndex} onStepClick={booking.goTo} />
        ) : null}

        <div className={styles.stepArea}>
          {/* Keyed remount + mount animation (no AnimatePresence exit, which can
              stall under `mode="wait"`); each step slides + fades in cleanly. */}
          <motion.div
            key={step + String(isComplete)}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            {renderStep()}
          </motion.div>
        </div>

        {!isComplete ? (
          <div className={styles.nav}>
            <Button
              variant="ghost"
              onClick={booking.back}
              disabled={isFirst}
              aria-label="Previous step"
            >
              Back
            </Button>

            {!isLast ? (
              <Button onClick={booking.next} icon="arrow-right">
                Continue
              </Button>
            ) : (
              <span className={styles.navSpacer} />
            )}
          </div>
        ) : null}
      </div>

      <OrderSummary tour={tour} data={data} total={total} />
    </div>
  );
}
