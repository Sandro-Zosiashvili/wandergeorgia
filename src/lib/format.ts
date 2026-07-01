/** Formatting helpers. */

const gelFormatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 0,
});

/** Format a GEL price with the lari symbol, e.g. "₾1,450". */
export function formatGEL(amount: number): string {
  return `₾${gelFormatter.format(amount)}`;
}

/** Human date, e.g. "12 Aug 2026". Returns "" for empty input. */
export function formatDate(iso: string): string {
  if (!iso) return '';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/** Inclusive night count between two ISO dates, or null if invalid. */
export function nightsBetween(arrival: string, departure: string): number | null {
  if (!arrival || !departure) return null;
  const a = new Date(arrival).getTime();
  const d = new Date(departure).getTime();
  if (Number.isNaN(a) || Number.isNaN(d) || d < a) return null;
  return Math.round((d - a) / (1000 * 60 * 60 * 24));
}
