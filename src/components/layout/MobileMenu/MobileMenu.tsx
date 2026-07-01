'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect } from 'react';
import { site, whatsappLink } from '@/config/site';
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll';
import NavLinks from '../NavLinks/NavLinks';
import Button from '@/components/ui/Button/Button';
import Icon from '@/components/ui/Icon/Icon';
import styles from './MobileMenu.module.scss';

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
}

const panel = {
  hidden: { x: '100%' },
  visible: { x: 0, transition: { type: 'spring', stiffness: 260, damping: 30 } },
  exit: { x: '100%', transition: { duration: 0.35, ease: [0.65, 0, 0.35, 1] } },
} as const;

/** Full-height slide-in navigation drawer for small screens. */
export default function MobileMenu({ open, onClose }: MobileMenuProps) {
  useLockBodyScroll(open);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className={styles.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
        >
          <motion.nav
            className={styles.panel}
            variants={panel}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            <button className={styles.close} onClick={onClose} aria-label="Close menu">
              <Icon name="close" size={26} />
            </button>

            <div className={styles.body}>
              <NavLinks variant="stacked" onNavigate={onClose} />
            </div>

            <div className={styles.footer}>
              <Button
                href={whatsappLink()}
                external
                variant="primary"
                icon="whatsapp"
                iconLeading
                fullWidth
              >
                Chat on WhatsApp
              </Button>
              <a href={`tel:${site.contact.phone.replace(/\s/g, '')}`} className={styles.phone}>
                <Icon name="phone" size={17} />
                {site.contact.phone}
              </a>
            </div>
          </motion.nav>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
