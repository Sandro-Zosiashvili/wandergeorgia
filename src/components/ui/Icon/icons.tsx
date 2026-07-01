import type { ReactNode } from 'react';

/**
 * Icon registry. Stroke icons use `currentColor` on a 24×24 grid.
 * A few brand/marks are filled — flagged with `filled: true`.
 */
export interface IconDef {
  node: ReactNode;
  filled?: boolean;
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
    node: (
      <path d="M12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2Zm0 2a8 8 0 0 1 6.9 12l-.3.5.6 2.3-2.4-.6-.5.3A8 8 0 1 1 12 4Zm-3.3 4c-.2 0-.5 0-.8.4-.3.4-1 1-1 2.4s1 2.9 1.2 3.1c.2.2 2 3.2 5 4.4 2.5 1 3 .8 3.6.8.6-.1 1.8-.8 2-1.5.3-.7.3-1.4.2-1.5-.1-.1-.3-.2-.6-.4-.3-.2-1.8-.9-2-1-.3-.1-.5-.1-.7.1-.2.3-.7 1-.9 1.2-.2.2-.3.2-.6.1-.3-.2-1.3-.5-2.5-1.6-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6l.4-.5c.2-.2.2-.3.4-.5.1-.2.1-.4 0-.6l-.9-2.1c-.2-.5-.4-.4-.6-.4h-.6Z" />
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
} satisfies Record<string, IconDef>;

export type IconName = keyof typeof iconRegistry;

/** Type guard used when an icon key comes from data. */
export function isIconName(name: string): name is IconName {
  return name in iconRegistry;
}
