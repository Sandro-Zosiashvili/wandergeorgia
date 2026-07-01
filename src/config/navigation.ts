/** Primary navigation links. Hash targets resolve to home-page sections. */

export interface NavItem {
  label: string;
  href: string;
}

export const navItems: readonly NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Day Tours', href: '/#day-tours' },
  { label: 'Packages', href: '/#packages' },
  { label: 'Why Us', href: '/#why-us' },
  { label: 'Contact', href: '/#contact' },
] as const;
