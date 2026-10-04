'use client';

import { type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll';
import Icon from '@/components/ui/Icon/Icon';
import styles from './AdminModal.module.scss';

interface AdminModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
  wide?: boolean;
}

const EASE = [0.22, 1, 0.36, 1] as const;

/** Centered modal / drawer used for booking details and admin forms. */
export default function AdminModal({
  open,
  onClose,
  title,
  subtitle,
  children,
  footer,
  wide = false,
}: AdminModalProps) {
  useLockBodyScroll(open);

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
          <motion.div
            className={[styles.panel, wide ? styles.wide : ''].filter(Boolean).join(' ')}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.28, ease: EASE }}
          >
            <header className={styles.head}>
              <div>
                <h2 className={styles.title}>{title}</h2>
                {subtitle ? <p className={styles.subtitle}>{subtitle}</p> : null}
              </div>
              <button className={styles.close} onClick={onClose} aria-label="Close">
                <Icon name="close" size={20} />
              </button>
            </header>

            <div className={styles.body}>{children}</div>

            {footer ? <footer className={styles.footer}>{footer}</footer> : null}
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
