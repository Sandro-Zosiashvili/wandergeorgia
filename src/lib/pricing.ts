import type { Tour } from '@/types/tour';
import type { IconName } from '@/components/ui/Icon/Icon';

/**
 * ────────────────────────────────────────────────────────────────────────────
 *  PRICING — single source of truth
 * ────────────────────────────────────────────────────────────────────────────
 *  All prices on the site are in USD ($). A tour's cost is driven by:
 *
 *      Total = ( Base Sedan Daily Rate + Selected Vehicle Daily Upgrade ) × N days
 *
 *  • One-day tours use N = 1, so the same formula applies.
 *  • Multi-day tours use N = tour.days.
 *  • A handful of routes override the standard daily rates (see RATE_OVERRIDES).
 *  • The 13-day Grand Tour is a fixed package price for the Jeep 4x4.
 *
 *  Edit the numbers here — nothing about pricing lives in the UI layer.
 * ────────────────────────────────────────────────────────────────────────────
 */

/** The four private vehicle classes, cheapest → most premium. */
export type VehicleId = 'sedan' | 'jeep' | 'minivan' | 'business';

export interface VehicleMeta {
  id: VehicleId;
  label: string;
  /** Maximum passengers this class carries. */
  capacity: number;
  /** Icon key resolved by components/ui/Icon. */
  icon: IconName;
  /** One-line descriptor shown on the selection card. */
  blurb: string;
  /** Flagged as the premium option (gets a "Premium" pill in the UI). */
  premium?: boolean;
}

/** Ordered cheapest → premium; the UI renders them in this order. */
export const VEHICLES: VehicleMeta[] = [
  { id: 'sedan', label: 'Sedan', capacity: 3, icon: 'car', blurb: 'Comfortable saloon car' },
  { id: 'jeep', label: 'SUV / Jeep (4x4)', capacity: 4, icon: 'suv', blurb: 'All-road 4x4 for the mountains' },
  { id: 'minivan', label: 'Minivan', capacity: 7, icon: 'minivan', blurb: 'Room for the whole group' },
  {
    id: 'business',
    label: 'Business Minivan',
    capacity: 7,
    icon: 'minivan',
    blurb: 'Premium van with extra comfort',
    premium: true,
  },
];

/** Largest private group we price online; above this, visitors contact us. */
export const MAX_PRIVATE_PAX = 7;

const vehicleById = new Map(VEHICLES.map((v) => [v.id, v]));

/** Vehicle metadata by id (throws only on a programming error). */
export function getVehicle(id: VehicleId): VehicleMeta {
  const v = vehicleById.get(id);
  if (!v) throw new Error(`Unknown vehicle: ${id}`);
  return v;
}

/** Per-day upgrade over the sedan base rate for each class. */
type Upgrades = Record<VehicleId, number>;

interface RateTable {
  /** Base sedan rate per day (USD). */
  base: number;
  upgrades: Upgrades;
}

/** Standard daily rates — all multi-day tours and any 1-day tour not overridden. */
const STANDARD_RATES: RateTable = {
  base: 120,
  upgrades: { sedan: 0, jeep: 30, minivan: 50, business: 120 },
};

/** Upgrade set shared by the specific 1-day routes below. */
const DAY_UPGRADES: Upgrades = { sedan: 0, jeep: 40, minivan: 60, business: 120 };

/** Routes whose daily rates override the standard table. Keyed by tour slug. */
const RATE_OVERRIDES: Record<string, RateTable> = {
  'kazbegi-day-tour': { base: 130, upgrades: DAY_UPGRADES },
  'martvili-prometheus-day-tour': { base: 180, upgrades: DAY_UPGRADES },
  'dashbashi-canyon-day-tour': { base: 120, upgrades: DAY_UPGRADES },
  'kakheti-wine-day-tour': { base: 120, upgrades: DAY_UPGRADES },
  'tbilisi-mtskheta-day-tour': { base: 100, upgrades: DAY_UPGRADES },
  'tbilisi-batumi-private-transfer': { base: 190, upgrades: DAY_UPGRADES },
};

interface FixedPackage {
  /** Flat total for the whole package (USD). */
  total: number;
  /** The single vehicle class the package is offered with. */
  vehicle: VehicleId;
}

/** Tours sold as a fixed package price rather than a per-day rate. */
const FIXED_PACKAGES: Record<string, FixedPackage> = {
  'best-of-georgia-13-day': { total: 2780, vehicle: 'jeep' },
};

/** The fixed package for a tour, or null if it's priced per day. */
export function getFixedPackage(tour: Tour): FixedPackage | null {
  return FIXED_PACKAGES[tour.slug] ?? null;
}

/** Number of charged days for a tour. One-day tours count as a single day. */
export function getTourDays(tour: Tour): number {
  return tour.type === 'multi-day' ? tour.days ?? 1 : 1;
}

/** The daily rate table that applies to a tour. */
function getRates(tour: Tour): RateTable {
  return RATE_OVERRIDES[tour.slug] ?? STANDARD_RATES;
}

/** The vehicle a tour defaults to: the fixed class, else the sedan base. */
export function defaultVehicle(tour: Tour): VehicleId {
  return getFixedPackage(tour)?.vehicle ?? 'sedan';
}

/** Vehicle classes that can seat `pax` people, cheapest → premium. */
export function allowedVehicles(pax: number): VehicleId[] {
  if (pax > MAX_PRIVATE_PAX) return [];
  return VEHICLES.filter((v) => pax <= v.capacity).map((v) => v.id);
}

/** True if `pax` exceeds the capacity of a given vehicle class. */
export function exceedsCapacity(vehicle: VehicleId, pax: number): boolean {
  return pax > getVehicle(vehicle).capacity;
}

export interface PriceBreakdown {
  vehicle: VehicleId;
  /** Charged days (N in the formula). */
  days: number;
  /** Base sedan rate per day. */
  baseRatePerDay: number;
  /** Selected vehicle's upgrade per day over the sedan base. */
  upgradePerDay: number;
  /** base + upgrade, i.e. the all-in daily rate for the chosen vehicle. */
  perDay: number;
  /** Grand total in USD. */
  total: number;
  /** True for a flat package price (no per-day maths applies). */
  isFixed: boolean;
}

/**
 * Full, transparent price breakdown for a tour + vehicle. This is the one
 * function the UI and the booking hook both call, so a displayed breakdown and
 * the charged total can never drift apart.
 */
export function computeBreakdown(tour: Tour, vehicle: VehicleId): PriceBreakdown {
  const days = getTourDays(tour);
  const fixed = getFixedPackage(tour);

  if (fixed) {
    return {
      vehicle: fixed.vehicle,
      days,
      baseRatePerDay: fixed.total,
      upgradePerDay: 0,
      perDay: fixed.total,
      total: fixed.total,
      isFixed: true,
    };
  }

  const rates = getRates(tour);
  const upgradePerDay = rates.upgrades[vehicle];
  const perDay = rates.base + upgradePerDay;

  return {
    vehicle,
    days,
    baseRatePerDay: rates.base,
    upgradePerDay,
    perDay,
    total: perDay * days,
    isFixed: false,
  };
}

/**
 * The "from" price shown on cards and in metadata: the cheapest way to take the
 * tour (sedan base × days), or the fixed package price.
 */
export function fromPriceUSD(tour: Tour): number {
  // DB-sourced tours carry an explicit admin-set price; honour it so edits in
  // the admin drawer drive the headline price. Static tours compute from rates.
  if (typeof tour.fromPrice === 'number') return tour.fromPrice;
  return computeBreakdown(tour, defaultVehicle(tour)).total;
}
