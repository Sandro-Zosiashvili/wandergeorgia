'use client';

import Link from 'next/link';
import { navItems } from '@/config/navigation';
import { useActiveNav } from '@/hooks/useActiveNav';
import { useLocale } from '@/hooks/useLocale';
import { localePath } from '@/lib/locale';
import { ui } from '@/lib/uiStrings';
import styles from './NavLinks.module.scss';

interface NavLinksProps {
  /** Vertical layout for the mobile drawer. */
  variant?: 'inline' | 'stacked';
  onNavigate?: () => void;
}

/** Primary navigation link list, shared by the header and mobile menu. */
export default function NavLinks({ variant = 'inline', onNavigate }: NavLinksProps) {
  const active = useActiveNav();
  const locale = useLocale();
  const labels = ui(locale).nav;

  return (
    <ul className={[styles.list, styles[variant]].join(' ')}>
      {navItems.map((item, index) => {
        const isActive = item.href === active;
        return (
          <li key={item.href} className={styles.item} style={{ '--i': index } as React.CSSProperties}>
            <Link
              href={localePath(locale, item.href)}
              className={[styles.link, isActive ? styles.active : ''].filter(Boolean).join(' ')}
              aria-current={isActive ? 'page' : undefined}
              onClick={onNavigate}
            >
              <span className={styles.linkText}>{labels[item.key] ?? item.label}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
