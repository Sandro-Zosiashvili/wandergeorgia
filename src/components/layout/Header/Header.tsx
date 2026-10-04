'use client';

import { useState } from 'react';
import { useScrolled } from '@/hooks/useScrolled';
import Logo from '../Logo/Logo';
import NavLinks from '../NavLinks/NavLinks';
import MobileMenu from '../MobileMenu/MobileMenu';
import Button from '@/components/ui/Button/Button';
import Icon from '@/components/ui/Icon/Icon';
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

  return (
    <>
      <header
        className={[styles.header, scrolled ? styles.scrolled : ''].filter(Boolean).join(' ')}
        style={scrolled ? GLASS : undefined}
      >
        <div className={styles.bar}>
          <Logo compact={scrolled} />

          <nav className={styles.desktopNav} aria-label="Primary">
            <NavLinks />
          </nav>

          <div className={styles.actions}>
            <Button href="/#day-tours" variant="ghost" size="sm" className={styles.exploreLink}>
              Explore tours
            </Button>
            <Button
              href="/#packages"
              variant="primary"
              size="sm"
              icon="arrow-right"
              className={styles.bookCta}
            >
              Book a trip
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
