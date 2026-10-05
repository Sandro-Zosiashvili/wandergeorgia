'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Icon from '@/components/ui/Icon/Icon';
import type { IconName } from '@/components/ui/Icon/Icon';
import styles from './Toast.module.scss';

export interface ToastState {
  message: string;
  variant?: 'success' | 'error';
}

interface ToastProps {
  toast: ToastState | null;
}

const ICONS: Record<NonNullable<ToastState['variant']>, IconName> = {
  success: 'check',
  error: 'close',
};

/** Fixed, auto-dismissing toast. The parent controls its lifetime. */
export default function Toast({ toast }: ToastProps) {
  const variant = toast?.variant ?? 'success';
  return (
    <AnimatePresence>
      {toast ? (
        <motion.div
          className={[styles.toast, styles[variant]].join(' ')}
          role="status"
          aria-live="polite"
          initial={{ opacity: 0, y: 16, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.96 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className={styles.icon}>
            <Icon name={ICONS[variant]} size={16} />
          </span>
          {toast.message}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
