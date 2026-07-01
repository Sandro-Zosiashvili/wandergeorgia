/**
 * Central brand configuration for WanderGeorgia.
 * Edit contact details, socials and the WhatsApp number here.
 */

export const site = {
  name: 'WanderGeorgia',
  tagline: 'Private journeys through the Caucasus',
  description:
    'Premium private tours across Georgia — hand-crafted itineraries, expert local guides, and airport transfers included with every trip.',
  url: 'https://wandergeorgia.com',

  contact: {
    phone: '+995 591 90 69 05',
    email: 'hello@wandergeorgia.com',
    address: 'Rustaveli Ave, Tbilisi, Georgia',
  },

  // WhatsApp deep link — number in international format, no spaces or symbols.
  whatsapp: {
    number: '995591906905',
    href: 'https://wa.me/995591906905',
    prefill: "Hello WanderGeorgia, I'd like to plan a private tour.",
  },

  socials: {
    instagram: 'https://instagram.com/wandergeorgia',
    facebook: 'https://facebook.com/wandergeorgia',
    tripadvisor: 'https://tripadvisor.com',
    youtube: 'https://youtube.com',
  },

  /** Design tokens mirrored from styles/_tokens.scss for use in TS/JS. */
  brand: {
    ink: '#0c0b0a',
    champagne: '#c9a24b',
    emerald: '#1f5f52',
  },
} as const;

/** Build a WhatsApp link, optionally with a custom prefilled message. */
export function whatsappLink(message?: string): string {
  const text = encodeURIComponent(message ?? site.whatsapp.prefill);
  return `${site.whatsapp.href}?text=${text}`;
}
