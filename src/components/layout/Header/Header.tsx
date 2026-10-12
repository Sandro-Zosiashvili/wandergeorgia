'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useScrolled } from '@/hooks/useScrolled';
import Logo from '../Logo/Logo';
import NavLinks from '../NavLinks/NavLinks';
import MobileMenu from '../MobileMenu/MobileMenu';
import LanguageSwitcher from '../LanguageSwitcher/LanguageSwitcher';
import Button from '@/components/ui/Button/Button';
import Icon from '@/components/ui/Icon/Icon';
import { useLocale } from '@/hooks/useLocale';
import { localePath } from '@/lib/locale';
import { ui } from '@/lib/uiStrings';
import styles from './Header.module.scss';

// Applied inline (not via CSS) so the minifier can't strip the standard
// property and leave only the -webkit- form that Chrome/Android ignore.
const GLASS = {
  backdropFilter: 'blur(16px) saturate(150%)',
  WebkitBackdropFilter: 'blur(16px) saturate(150%)',
} as const;

/** Sticky site header — transparent over the hero, frosted once scrolled. */
export default function Header() {
  const scrolled = useScrolled(40);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const locale = useLocale();
  const t = ui(locale).actions;

  // The /admin area has its own chrome — hide the public site header there.
  if (pathname?.startsWith('/admin')) return null;

  return (
    <>
      <header
        className={[styles.header, scrolled ? styles.scrolled : ''].filter(Boolean).join(' ')}
        style={scrolled ? GLASS : undefined}
      >
        <div className={styles.bar}>
          <Logo />

          <nav className={styles.desktopNav} aria-label="Primary">
            <NavLinks />
          </nav>

          <div className={styles.actions}>
            <LanguageSwitcher className={styles.langSwitch} />
            <Button href={localePath(locale, '/#day-tours')} variant="ghost" size="sm" className={styles.exploreLink}>
              {t.exploreTours}
            </Button>
            <Button
              href={localePath(locale, '/#packages')}
              variant="primary"
              size="sm"
              icon="arrow-right"
              className={styles.bookCta}
            >
              {t.bookTrip}
            </Button>
            <button
              className={styles.burger}
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              aria-expanded={menuOpen}
            >
              <Icon name="menu" size={26} />
            </button>
          </div>
        </div>
      </header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
