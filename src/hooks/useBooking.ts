'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Tour } from '@/types/tour';
import {
  type PriceBreakdown,
  type VehicleId,
  allowedVehicles,
  computeBreakdown,
  defaultVehicle,
  exceedsCapacity,
  getFixedPackage,
  getVehicle,
  MAX_PRIVATE_PAX,
} from '@/lib/pricing';

export type BookingStepId = 'travelers' | 'dates' | 'details' | 'review' | 'confirm';

export const bookingSteps: { id: BookingStepId; label: string }[] = [
  { id: 'travelers', label: 'Travelers' },
  { id: 'dates', label: 'Dates' },
  { id: 'details', label: 'Your details' },
  { id: 'review', label: 'Review' },
  { id: 'confirm', label: 'Confirm' },
];

/** Base URL of the NestJS booking API. Override per environment. */
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

export interface BookingData {
  travelers: number;
  vehicle: VehicleId;
  arrivalDate: string;
  departureDate: string;
  flightDetails: string;
  name: string;
  email: string;
  phone: string;
}

export type BookingErrors = Partial<Record<keyof BookingData, string>>;

/** Tour-independent defaults; `vehicle` is seeded per-tour in the hook. */
const baseInitialData: Omit<BookingData, 'vehicle'> = {
  travelers: 2,
  arrivalDate: '',
  departureDate: '',
  flightDetails: '',
  name: '',
  email: '',
  phone: '',
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Validate only the fields owned by a given step. */
function validateStep(step: BookingStepId, data: BookingData): BookingErrors {
  const errors: BookingErrors = {};

  if (step === 'travelers') {
    if (data.travelers < 1) {
      errors.travelers = 'At least one traveler is required.';
    } else if (data.travelers > MAX_PRIVATE_PAX) {
      errors.travelers = `For groups larger than ${MAX_PRIVATE_PAX}, please contact us directly.`;
    } else if (exceedsCapacity(data.vehicle, data.travelers)) {
      errors.vehicle = 'Please choose a vehicle that fits your group.';
    }
  }

  if (step === 'dates') {
    if (!data.arrivalDate) errors.arrivalDate = 'Please choose your arrival date.';
    if (!data.departureDate) errors.departureDate = 'Please choose your departure date.';
    if (
      data.arrivalDate &&
      data.departureDate &&
      new Date(data.departureDate) < new Date(data.arrivalDate)
    ) {
      errors.departureDate = 'Departure must be on or after arrival.';
    }
    if (!data.flightDetails.trim()) {
      errors.flightDetails = 'Please share your flight details.';
    }
  }

  if (step === 'details') {
    if (!data.name.trim()) errors.name = 'Please enter your full name.';
    if (!data.email.trim()) errors.email = 'Please enter your email.';
    else if (!EMAIL_RE.test(data.email)) errors.email = 'Please enter a valid email.';
    if (!data.phone.trim()) errors.phone = 'Please enter a phone number.';
  }

  return errors;
}

export interface UseBookingResult {
  data: BookingData;
  errors: BookingErrors;
  stepIndex: number;
  step: BookingStepId;
  isFirst: boolean;
  isLast: boolean;
  isComplete: boolean;
  /** True while the request is in flight to the backend. */
  isSubmitting: boolean;
  /** User-facing error message if the submission failed, else null. */
  submitError: string | null;
  total: number;
  /** Live, transparent price breakdown for the current vehicle selection. */
  breakdown: PriceBreakdown;
  update: <K extends keyof BookingData>(key: K, value: BookingData[K]) => void;
  next: () => void;
  back: () => void;
  goTo: (index: number) => void;
  /** Send the booking to the backend, which emails the admin + customer. */
  submit: () => Promise<void>;
}

/**
 * Encapsulates the multi-step booking flow: field state, per-step validation,
 * navigation and total price. UI-only — stops at the payment step.
 */
export function useBooking(tour: Tour): UseBookingResult {
  const [data, setData] = useState<BookingData>(() => ({
    ...baseInitialData,
    vehicle: defaultVehicle(tour),
  }));
  const [stepIndex, setStepIndex] = useState(0);
  const [errors, setErrors] = useState<BookingErrors>({});
  const [isComplete, setIsComplete] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const step = bookingSteps[stepIndex]!.id;

  const update = useCallback<UseBookingResult['update']>((key, value) => {
    setData((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }, []);

  // Keep the vehicle valid for the group size. Fixed-package tours (e.g. the
  // 13-day Jeep tour) are locked to their vehicle and never auto-switched.
  // When the current vehicle can't seat the group, fall back to the cheapest
  // that can; if none can (group > max), leave the choice as-is so the
  // "contact us" notice is what the traveler sees.
  const isFixedTour = getFixedPackage(tour) !== null;
  useEffect(() => {
    if (isFixedTour) return;
    if (!exceedsCapacity(data.vehicle, data.travelers)) return;
    const [fallback] = allowedVehicles(data.travelers);
    if (fallback) {
      setData((prev) => ({ ...prev, vehicle: fallback }));
      setErrors((prev) => ({ ...prev, vehicle: undefined }));
    }
  }, [data.travelers, data.vehicle, isFixedTour]);

  const next = useCallback(() => {
    const currentStep = bookingSteps[stepIndex]!.id;
    const stepErrors = validateStep(currentStep, data);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }
    setErrors({});
    setStepIndex((i) => Math.min(i + 1, bookingSteps.length - 1));
  }, [stepIndex, data]);

  const back = useCallback(() => {
    setErrors({});
    setStepIndex((i) => Math.max(i - 1, 0));
  }, []);

  const goTo = useCallback(
    (index: number) => {
      // Only allow jumping backwards to already-valid steps.
      if (index < stepIndex) {
        setErrors({});
        setStepIndex(index);
      }
    },
    [stepIndex],
  );

  // Price is driven by the chosen vehicle and the tour's day count:
  //   total = (sedan base/day + vehicle upgrade/day) × days
  // (or a flat package price for fixed tours). See lib/pricing.
  const breakdown = useMemo(
    () => computeBreakdown(tour, data.vehicle),
    [tour, data.vehicle],
  );
  const total = breakdown.total;

  const submit = useCallback(async () => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch(`${API_URL}/booking`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tourTitle: tour.title,
          tourSlug: tour.slug,
          tourType: tour.type,
          travelers: data.travelers,
          vehicle: getVehicle(data.vehicle).label,
          days: breakdown.days,
          currency: 'USD',
          arrivalDate: data.arrivalDate,
          departureDate: data.departureDate,
          flightDetails: data.flightDetails,
          name: data.name,
          email: data.email,
          phone: data.phone,
          total,
        }),
      });
      if (!res.ok) throw new Error(`Request failed (${res.status})`);
      setIsComplete(true);
    } catch {
      setSubmitError(
        'We couldn’t send your request just now. Please try again, or reach us on WhatsApp.',
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [tour, data, total, breakdown.days]);

  return {
    data,
    errors,
    stepIndex,
    step,
    isFirst: stepIndex === 0,
    isLast: stepIndex === bookingSteps.length - 1,
    isComplete,
    isSubmitting,
    submitError,
    total,
    breakdown,
    update,
    next,
    back,
    goTo,
    submit,
  };
}
