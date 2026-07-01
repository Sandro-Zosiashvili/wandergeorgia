import type { TourInclusion } from '@/types/tour';

/**
 * Reusable inclusion presets. Airport pickup & drop-off are part of every tour,
 * so they live here and are spread into each tour's `included` list.
 */

export const airportPickup: TourInclusion = {
  label: 'Airport pickup on arrival',
  icon: 'plane-arrival',
};

export const airportDropoff: TourInclusion = {
  label: 'Airport drop-off on departure',
  icon: 'plane-departure',
};

export const privateGuide: TourInclusion = {
  label: 'Private English-speaking guide',
  icon: 'guide',
};

export const privateVehicle: TourInclusion = {
  label: 'Private air-conditioned vehicle',
  icon: 'car',
};

export const hotelPickup: TourInclusion = {
  label: 'Hotel pickup & return',
  icon: 'map-pin',
};

export const wineTasting: TourInclusion = {
  label: 'Wine tasting at a family cellar',
  icon: 'wine',
};

export const meals: TourInclusion = {
  label: 'Traditional Georgian lunch',
  icon: 'meal',
};

export const accommodation: TourInclusion = {
  label: 'Boutique accommodation each night',
  icon: 'bed',
};

/** Every tour bundles the airport transfers. */
export const airportTransfers: TourInclusion[] = [airportPickup, airportDropoff];
