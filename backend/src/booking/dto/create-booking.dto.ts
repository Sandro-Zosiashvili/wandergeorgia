import {
  IsEmail,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

/**
 * Shape of a booking request coming from the frontend.
 * Every field is validated server-side — we never trust the client blindly,
 * because this endpoint is public.
 */
export class CreateBookingDto {
  // ── Tour (what they're booking) ──────────────────────────────
  @IsString()
  @MaxLength(200)
  tourTitle!: string;

  @IsString()
  @MaxLength(200)
  tourSlug!: string;

  @IsIn(['one-day', 'multi-day'])
  tourType!: 'one-day' | 'multi-day';

  // ── Trip details ─────────────────────────────────────────────
  @IsInt()
  @Min(1)
  travelers!: number;

  /** ISO date string, e.g. "2026-09-14". */
  @IsString()
  @MaxLength(40)
  arrivalDate!: string;

  @IsString()
  @MaxLength(40)
  departureDate!: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  flightDetails?: string;

  // ── Customer ─────────────────────────────────────────────────
  @IsString()
  @MaxLength(120)
  name!: string;

  @IsEmail()
  @MaxLength(200)
  email!: string;

  @IsString()
  @MaxLength(60)
  phone!: string;

  /** Total price in GEL, computed on the frontend. Informational only. */
  @IsInt()
  @Min(0)
  total!: number;

  // ── Anti-spam ────────────────────────────────────────────────
  /**
   * Honeypot: a hidden field real users never see or fill. If a bot fills it,
   * we can detect and drop the request silently. Optional and always empty.
   */
  @IsOptional()
  @IsString()
  @MaxLength(0, { message: 'Rejected.' })
  company?: string;
}
