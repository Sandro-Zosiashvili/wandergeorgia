'use client';

import { type ReactNode, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll';
import Icon from '@/components/ui/Icon/Icon';
import styles from './AdminDrawer.module.scss';

interface AdminDrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}

const EASE = [0.22, 1, 0.36, 1] as const;

/** Right-side slide-in drawer for rich admin forms (sticky header + footer). */
export default function AdminDrawer({ open, onClose, title, subtitle, children, footer }: AdminDrawerProps) {
  useLockBodyScroll(open);

  // Close on Escape.
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
        <div className={styles.root}>
          <motion.div
            className={styles.backdrop}
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            aria-hidden="true"
          />
          <motion.aside
            className={styles.panel}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.34, ease: EASE }}
          >
            <header className={styles.head}>
              <div className={styles.headText}>
                <h2 className={styles.title}>{title}</h2>
                {subtitle ? <p className={styles.subtitle}>{subtitle}</p> : null}
              </div>
              <button className={styles.close} onClick={onClose} aria-label="Close">
                <Icon name="close" size={20} />
              </button>
            </header>

            <div className={styles.body}>{children}</div>

            {footer ? <footer className={styles.footer}>{footer}</footer> : null}
          </motion.aside>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
