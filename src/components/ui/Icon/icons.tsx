import type { ReactNode } from 'react';

/**
 * Icon registry. Stroke icons use `currentColor` on a 24×24 grid.
 * A few brand/marks are filled — flagged with `filled: true`.
 */
export interface IconDef {
  node: ReactNode;
  filled?: boolean;
  /** Override the default 24×24 grid for marks authored on another viewBox. */
  viewBox?: string;
}

export const iconRegistry = {
  'plane-arrival': {
    node: (
      <>
        <path d="M2 22h20" />
        <path d="M3.5 15.5 6 16.2l3.2.9 8.2 2.2a2 2 0 0 0 2.4-1.4 2 2 0 0 0-1.4-2.4l-3-.8-2.7-6.2-2-.5.8 5-3.7-1L6 9.9l-2-.5Z" />
      </>
    ),
  },
  'plane-departure': {
    node: (
      <>
        <path d="M2 22h20" />
        <path d="M6.4 5.5 8.3 6l1.9 4.7 5.6 1.5 3 .8a2 2 0 0 1 1.4 2.4 2 2 0 0 1-2.4 1.4L4.6 13.3l-2.6-.7.6-2 2 .5 3.7 1-1.9-6Z" />
      </>
    ),
  },
  guide: {
    node: (
      <>
        <circle cx="12" cy="7" r="3.2" />
        <path d="M5.5 20a6.5 6.5 0 0 1 13 0" />
      </>
    ),
  },
  car: {
    node: (
      <>
        <path d="M5 17H3v-4l2-5h14l2 5v4h-2" />
        <circle cx="7.5" cy="17" r="1.8" />
        <circle cx="16.5" cy="17" r="1.8" />
        <path d="M5 12h14" />
      </>
    ),
  },
  'map-pin': {
    node: (
      <>
        <path d="M12 21s-6.5-5.5-6.5-10a6.5 6.5 0 0 1 13 0c0 4.5-6.5 10-6.5 10Z" />
        <circle cx="12" cy="11" r="2.3" />
      </>
    ),
  },
  wine: {
    node: (
      <>
        <path d="M8 3h8l-.5 6a3.5 3.5 0 0 1-7 0Z" />
        <path d="M12 12.5V19" />
        <path d="M8.5 21h7" />
      </>
    ),
  },
  meal: {
    node: (
      <>
        <path d="M5 3v7a2 2 0 0 0 2 2 2 2 0 0 0 2-2V3" />
        <path d="M7 12v9" />
        <path d="M16 3c-1.5 0-2.5 1.8-2.5 4.5S14.5 12 16 12v9" />
      </>
    ),
  },
  bed: {
    node: (
      <>
        <path d="M3 7v11" />
        <path d="M3 12h18v6" />
        <path d="M21 18v-4a3 3 0 0 0-3-3H9v3" />
        <circle cx="6.5" cy="10.5" r="1.4" />
      </>
    ),
  },
  star: {
    filled: true,
    node: (
      <path d="M12 2.5l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 17.9 6.2 20.9l1.1-6.5L2.6 9.8l6.5-.9L12 2.5Z" />
    ),
  },
  shield: {
    node: (
      <>
        <path d="M12 3 5 6v5.5c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6Z" />
        <path d="M9 12l2 2 4-4" />
      </>
    ),
  },
  check: {
    node: <path d="M5 12.5 10 17.5 19.5 7" />,
  },
  'arrow-right': {
    node: (
      <>
        <path d="M4 12h16" />
        <path d="M14 6l6 6-6 6" />
      </>
    ),
  },
  'arrow-up-right': {
    node: (
      <>
        <path d="M7 17 17 7" />
        <path d="M8 7h9v9" />
      </>
    ),
  },
  'chevron-down': {
    node: <path d="M6 9l6 6 6-6" />,
  },
  'chevron-right': {
    node: <path d="M9 6l6 6-6 6" />,
  },
  clock: {
    node: (
      <>
        <circle cx="12" cy="12" r="8.5" />
        <path d="M12 7.5V12l3 2" />
      </>
    ),
  },
  users: {
    node: (
      <>
        <circle cx="9" cy="8" r="3" />
        <path d="M3.5 20a5.5 5.5 0 0 1 11 0" />
        <path d="M16 5.2a3 3 0 0 1 0 5.6" />
        <path d="M17.5 14.4A5.5 5.5 0 0 1 20.5 20" />
      </>
    ),
  },
  calendar: {
    node: (
      <>
        <rect x="3.5" y="5" width="17" height="15" rx="2" />
        <path d="M3.5 9.5h17" />
        <path d="M8 3v4M16 3v4" />
      </>
    ),
  },
  phone: {
    node: (
      <path d="M6.6 3.5 4 4.2C3.3 8.7 5 13 8 16s7.3 4.7 11.8 4l.7-2.6-3.6-1.6-1.6 1.8a12 12 0 0 1-5-5l1.8-1.6L10.5 7Z" />
    ),
  },
  mail: {
    node: (
      <>
        <rect x="3" y="5.5" width="18" height="13" rx="2" />
        <path d="M4 7l8 6 8-6" />
      </>
    ),
  },
  whatsapp: {
    filled: true,
    // Authored on a 32×32 grid (SVG Repo). Fill follows currentColor so it
    // reads white on the green pill and gold/maroon inside outline buttons.
    viewBox: '0 0 32 32',
    node: (
      <path d="M26.576 5.363c-2.69-2.69-6.406-4.354-10.511-4.354-8.209 0-14.865 6.655-14.865 14.865 0 2.732 0.737 5.291 2.022 7.491l-0.038-0.070-2.109 7.702 7.879-2.067c2.051 1.139 4.498 1.809 7.102 1.809h0.006c8.209-0.003 14.862-6.659 14.862-14.868 0-4.103-1.662-7.817-4.349-10.507l0 0zM16.062 28.228h-0.005c-0 0-0.001 0-0.001 0-2.319 0-4.489-0.64-6.342-1.753l0.056 0.031-0.451-0.267-4.675 1.227 1.247-4.559-0.294-0.467c-1.185-1.862-1.889-4.131-1.889-6.565 0-6.822 5.531-12.353 12.353-12.353s12.353 5.531 12.353 12.353c0 6.822-5.53 12.353-12.353 12.353h-0zM22.838 18.977c-0.371-0.186-2.197-1.083-2.537-1.208-0.341-0.124-0.589-0.185-0.837 0.187-0.246 0.371-0.958 1.207-1.175 1.455-0.216 0.249-0.434 0.279-0.805 0.094-1.15-0.466-2.138-1.087-2.997-1.852l0.010 0.009c-0.799-0.74-1.484-1.587-2.037-2.521l-0.028-0.052c-0.216-0.371-0.023-0.572 0.162-0.757 0.167-0.166 0.372-0.434 0.557-0.65 0.146-0.179 0.271-0.384 0.366-0.604l0.006-0.017c0.043-0.087 0.068-0.188 0.068-0.296 0-0.131-0.037-0.253-0.101-0.357l0.002 0.003c-0.094-0.186-0.836-2.014-1.145-2.758-0.302-0.724-0.609-0.625-0.836-0.637-0.216-0.010-0.464-0.012-0.712-0.012-0.395 0.010-0.746 0.188-0.988 0.463l-0.001 0.002c-0.802 0.761-1.3 1.834-1.3 3.023 0 0.026 0 0.053 0.001 0.079l-0-0.004c0.131 1.467 0.681 2.784 1.527 3.857l-0.012-0.015c1.604 2.379 3.742 4.282 6.251 5.564l0.094 0.043c0.548 0.248 1.25 0.513 1.968 0.74l0.149 0.041c0.442 0.14 0.951 0.221 1.479 0.221 0.303 0 0.601-0.027 0.889-0.078l-0.031 0.004c1.069-0.223 1.956-0.868 2.497-1.749l0.009-0.017c0.165-0.366 0.261-0.793 0.261-1.242 0-0.185-0.016-0.366-0.047-0.542l0.003 0.019c-0.092-0.155-0.34-0.247-0.712-0.434z" />
    ),
  },
  instagram: {
    node: (
      <>
        <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17" cy="7" r="1" fill="currentColor" stroke="none" />
      </>
    ),
  },
  facebook: {
    node: (
      <path d="M14 8.5V7c0-.8.4-1 1-1h1.5V3H14c-2.2 0-3.5 1.4-3.5 3.7v1.8H8.5v3h2V21h3.5v-9.5H16l.5-3H14Z" />
    ),
    filled: true,
  },
  youtube: {
    node: (
      <>
        <rect x="2.5" y="6" width="19" height="12" rx="3.5" />
        <path d="M10.5 9.3v5.4l4.5-2.7Z" fill="currentColor" stroke="none" />
      </>
    ),
  },
  globe: {
    node: (
      <>
        <circle cx="12" cy="12" r="8.5" />
        <path d="M3.5 12h17" />
        <path d="M12 3.5c2.5 2.3 3.8 5.3 3.8 8.5S14.5 18.2 12 20.5c-2.5-2.3-3.8-5.3-3.8-8.5S9.5 5.8 12 3.5Z" />
      </>
    ),
  },
  menu: {
    node: (
      <>
        <path d="M4 7h16" />
        <path d="M4 12h16" />
        <path d="M4 17h16" />
      </>
    ),
  },
  close: {
    node: (
      <>
        <path d="M6 6l12 12" />
        <path d="M18 6 6 18" />
      </>
    ),
  },
  plus: {
    node: (
      <>
        <path d="M12 5v14" />
        <path d="M5 12h14" />
      </>
    ),
  },
  minus: {
    node: <path d="M5 12h14" />,
  },
  quote: {
    filled: true,
    node: (
      <path d="M9 6c-3 1-5 3.6-5 7v5h6v-6H7.2C7.5 9.9 8.6 8.4 10.5 7.6L9 6Zm10 0c-3 1-5 3.6-5 7v5h6v-6h-2.8c.3-2.1 1.4-3.6 3.3-4.4L19 6Z" />
    ),
  },
  sparkle: {
    filled: true,
    node: (
      <path d="M12 2l1.6 5.4L19 9l-5.4 1.6L12 16l-1.6-5.4L5 9l5.4-1.6L12 2Z" />
    ),
  },
  compass: {
    node: (
      <>
        <circle cx="12" cy="12" r="8.5" />
        <path d="M15.5 8.5 13 13l-4.5 2.5L11 11Z" fill="currentColor" stroke="none" />
      </>
    ),
  },
  route: {
    node: (
      <>
        <circle cx="6" cy="18" r="2.2" />
        <circle cx="18" cy="6" r="2.2" />
        <path d="M8 18h6a3 3 0 0 0 0-6H10a3 3 0 0 1 0-6h6" />
      </>
    ),
  },
  images: {
    node: (
      <>
        <path d="M7 7V5.5A1.5 1.5 0 0 1 8.5 4H19a1.5 1.5 0 0 1 1.5 1.5V16a1.5 1.5 0 0 1-1.5 1.5h-1.5" />
        <rect x="3" y="7" width="14" height="13" rx="1.8" />
        <circle cx="7.7" cy="11.3" r="1.4" />
        <path d="M3.8 17.3 8 13l2.5 2.5L14 12l2.9 3.8" />
      </>
    ),
  },
} satisfies Record<string, IconDef>;

export type IconName = keyof typeof iconRegistry;

/** Type guard used when an icon key comes from data. */
export function isIconName(name: string): name is IconName {
  return name in iconRegistry;
}
