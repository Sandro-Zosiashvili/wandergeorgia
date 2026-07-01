import type { BookingData, BookingErrors } from '@/hooks/useBooking';
import type { Tour } from '@/types/tour';

/** Props shared by every booking step. */
export interface StepProps {
  tour: Tour;
  data: BookingData;
  errors: BookingErrors;
  update: <K extends keyof BookingData>(key: K, value: BookingData[K]) => void;
}
