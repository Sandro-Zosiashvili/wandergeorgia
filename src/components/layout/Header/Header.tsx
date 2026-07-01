'use client';

import { useState } from 'react';
import { useScrolled } from '@/hooks/useScrolled';
import Logo from '../Logo/Logo';
import NavLinks from '../NavLinks/NavLinks';
import MobileMenu from '../MobileMenu/MobileMenu';
import Button from '@/components/ui/Button/Button';
import Icon from '@/components/ui/Icon/Icon';
import styles from './Header.module.scss';

/** Sticky site header — transparent over the hero, frosted once scrolled. */
export default function Header() {
  const scrolled = useScrolled(40);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className={[styles.header, scrolled ? styles.scrolled : ''].filter(Boolean).join(' ')}>
        <div className={styles.bar}>
          <Logo compact={scrolled} />

          <nav className={styles.desktopNav} aria-label="Primary">
            <NavLinks />
          </nav>

          <div className={styles.actions}>
            <Button href="/#day-tours" variant="ghost" size="sm" className={styles.exploreLink}>
              Explore tours
            </Button>
            <Button href="/#packages" variant="primary" size="sm" icon="arrow-right">
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
