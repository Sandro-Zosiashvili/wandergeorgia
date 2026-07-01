'use client';

import Link from 'next/link';
import { navItems } from '@/config/navigation';
import styles from './NavLinks.module.scss';

interface NavLinksProps {
  /** Vertical layout for the mobile drawer. */
  variant?: 'inline' | 'stacked';
  onNavigate?: () => void;
}

/** Primary navigation link list, shared by the header and mobile menu. */
export default function NavLinks({ variant = 'inline', onNavigate }: NavLinksProps) {
  return (
    <ul className={[styles.list, styles[variant]].join(' ')}>
      {navItems.map((item, index) => (
        <li key={item.href} className={styles.item} style={{ '--i': index } as React.CSSProperties}>
          <Link href={item.href} className={styles.link} onClick={onNavigate}>
            <span className={styles.linkText}>{item.label}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
