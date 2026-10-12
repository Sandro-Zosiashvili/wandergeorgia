/** Primary navigation links. Hash targets resolve to home-page sections. */

export interface NavItem {
  /** Dictionary key under `nav` for the label. */
  key: 'home' | 'dayTours' | 'packages' | 'memories' | 'whyUs' | 'contact';
  label: string;
  href: string;
}

export const navItems: readonly NavItem[] = [
  { key: 'home', label: 'Home', href: '/' },
  { key: 'dayTours', label: 'Day Tours', href: '/#day-tours' },
  { key: 'packages', label: 'Packages', href: '/#packages' },
  { key: 'memories', label: 'Memories', href: '/memories' },
  { key: 'whyUs', label: 'Why Us', href: '/#why-us' },
  { key: 'contact', label: 'Contact', href: '/#contact' },
] as const;
