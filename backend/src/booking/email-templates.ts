import type { CreateBookingDto } from './dto/create-booking.dto';

/** Brand palette, mirrored from the frontend (site.brand). */
const BRAND = {
  ink: '#0c0b0a',
  champagne: '#c9a24b',
  emerald: '#1f5f52',
  paper: '#faf8f4',
  line: '#e7e2d8',
};

const CONTACT = {
  name: 'WanderGeorgia',
  phone: '+995 591 90 69 05',
  whatsapp: 'https://wa.me/995591906905',
};

/** GEL formatter — e.g. 1200 -> "₾1,200". */
function gel(amount: number): string {
  return '₾' + amount.toLocaleString('en-US');
}

/** Nice human date — e.g. "2026-09-14" -> "14 Sep 2026". Falls back to raw. */
function niceDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso || '—';
  return d.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

/** Whole nights between two ISO dates (0 if invalid). */
function nights(arrival: string, departure: string): number {
  const a = new Date(arrival).getTime();
  const b = new Date(departure).getTime();
  if (Number.isNaN(a) || Number.isNaN(b) || b < a) return 0;
  return Math.round((b - a) / 86_400_000);
}

/** One label/value row used inside the admin email table. */
function row(label: string, value: string): string {
  return `
    <tr>
      <td style="padding:10px 0;border-bottom:1px solid ${BRAND.line};color:${BRAND.emerald};font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:.04em;width:38%;vertical-align:top;">${label}</td>
      <td style="padding:10px 0;border-bottom:1px solid ${BRAND.line};color:${BRAND.ink};font-size:15px;vertical-align:top;">${value || '—'}</td>
    </tr>`;
}

function shell(inner: string): string {
  return `
  <div style="margin:0;padding:24px;background:${BRAND.paper};font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
    <div style="max-width:600px;margin:0 auto;background:#ffffff;border:1px solid ${BRAND.line};border-radius:14px;overflow:hidden;">
      <div style="background:${BRAND.ink};padding:22px 28px;">
        <span style="color:${BRAND.champagne};font-size:18px;font-weight:700;letter-spacing:.02em;">WanderGeorgia</span>
      </div>
      <div style="padding:28px;">
        ${inner}
      </div>
    </div>
    <p style="max-width:600px;margin:16px auto 0;color:#9a938a;font-size:12px;text-align:center;">
      Private journeys through the Caucasus · ${CONTACT.phone}
    </p>
  </div>`;
}

/**
 * Email #1 — to the ADMIN. Everything, in full detail, so the team can act.
 * Reply-To is set (in the service) to the customer's email.
 */
export function buildAdminEmail(dto: CreateBookingDto): {
  subject: string;
  html: string;
  text: string;
} {
  const n = nights(dto.arrivalDate, dto.departureDate);
  const dateSpan =
    `${niceDate(dto.arrivalDate)} → ${niceDate(dto.departureDate)}` +
    (n ? ` · ${n} night${n === 1 ? '' : 's'}` : '');

  const inner = `
    <p style="margin:0 0 4px;color:${BRAND.champagne};font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;">New booking request</p>
    <h1 style="margin:0 0 20px;color:${BRAND.ink};font-size:22px;line-height:1.3;">${dto.tourTitle}</h1>
    <table style="width:100%;border-collapse:collapse;">
      ${row('Tour', `${dto.tourTitle} <span style="color:#9a938a;">(${dto.tourType})</span>`)}
      ${row('Travelers', String(dto.travelers))}
      ${row('Dates', dateSpan)}
      ${row('Flight details', dto.flightDetails || '—')}
      ${row('Name', dto.name)}
      ${row('Email', `<a href="mailto:${dto.email}" style="color:${BRAND.emerald};">${dto.email}</a>`)}
      ${row('Phone', `<a href="tel:${dto.phone}" style="color:${BRAND.emerald};">${dto.phone}</a>`)}
      ${row('Estimated total', `<strong>${gel(dto.total)}</strong>`)}
    </table>
    <p style="margin:22px 0 0;padding:14px 16px;background:${BRAND.paper};border-radius:10px;color:${BRAND.ink};font-size:14px;">
      Reply directly to this email to reach ${dto.name}.
    </p>`;

  const text = [
    `NEW BOOKING REQUEST — ${dto.tourTitle} (${dto.tourType})`,
    ``,
    `Travelers:      ${dto.travelers}`,
    `Dates:          ${dateSpan}`,
    `Flight details: ${dto.flightDetails || '—'}`,
    `Name:           ${dto.name}`,
    `Email:          ${dto.email}`,
    `Phone:          ${dto.phone}`,
    `Estimated total:${gel(dto.total)}`,
  ].join('\n');

  return {
    subject: `New booking: ${dto.tourTitle} — ${dto.name}`,
    html: shell(inner),
    text,
  };
}

/**
 * Email #2 — to the CUSTOMER. A clean, friendly confirmation. No internal
 * notes; just what they booked and what happens next.
 */
export function buildCustomerEmail(dto: CreateBookingDto): {
  subject: string;
  html: string;
  text: string;
} {
  const n = nights(dto.arrivalDate, dto.departureDate);
  const dateSpan =
    `${niceDate(dto.arrivalDate)} → ${niceDate(dto.departureDate)}` +
    (n ? ` · ${n} night${n === 1 ? '' : 's'}` : '');

  const inner = `
    <p style="margin:0 0 4px;color:${BRAND.champagne};font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;">Request received</p>
    <h1 style="margin:0 0 14px;color:${BRAND.ink};font-size:22px;line-height:1.3;">Thank you, ${dto.name.split(' ')[0] || dto.name}!</h1>
    <p style="margin:0 0 22px;color:#4a463f;font-size:15px;line-height:1.6;">
      We've received your request for the tour below and our team will get back to
      you within 24 hours to confirm the details. No payment has been taken yet.
    </p>
    <table style="width:100%;border-collapse:collapse;">
      ${row('Tour', dto.tourTitle)}
      ${row('Travelers', String(dto.travelers))}
      ${row('Dates', dateSpan)}
    </table>
    <p style="margin:24px 0 0;color:#4a463f;font-size:15px;line-height:1.6;">
      Need to reach us sooner? Message us on
      <a href="${CONTACT.whatsapp}" style="color:${BRAND.emerald};font-weight:600;">WhatsApp</a>
      or call <a href="tel:${CONTACT.phone.replace(/\s/g, '')}" style="color:${BRAND.emerald};font-weight:600;">${CONTACT.phone}</a>.
    </p>
    <p style="margin:18px 0 0;color:#9a938a;font-size:13px;">— The WanderGeorgia team</p>`;

  const text = [
    `Thank you, ${dto.name}!`,
    ``,
    `We've received your booking request and will confirm within 24 hours.`,
    `No payment has been taken yet.`,
    ``,
    `Tour:      ${dto.tourTitle}`,
    `Travelers: ${dto.travelers}`,
    `Dates:     ${dateSpan}`,
    ``,
    `WhatsApp: ${CONTACT.whatsapp}`,
    `Phone:    ${CONTACT.phone}`,
    `— The WanderGeorgia team`,
  ].join('\n');

  return {
    subject: `We received your request — ${dto.tourTitle}`,
    html: shell(inner),
    text,
  };
}
