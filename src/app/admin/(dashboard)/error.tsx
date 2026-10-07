'use client';

import { useEffect } from 'react';
import Icon from '@/components/ui/Icon/Icon';
import styles from './AdminShell.module.scss';

/**
 * Error boundary for the admin dashboard. Any client-side error in an admin
 * page renders this recoverable fallback instead of a blank screen.
 */
export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surface the real cause in the console for debugging.
    // eslint-disable-next-line no-console
    console.error('[admin] render error:', error);
  }, [error]);

  return (
    <div className={styles.loading}>
      <div className={styles.errorBox}>
        <Icon name="shield" size={28} />
        <p className={styles.errorText}>Something went wrong loading the admin panel.</p>
        <p className={styles.errorDetail}>{error.message || 'Unexpected error.'}</p>
        <button className={styles.errorBtn} onClick={reset}>
          <Icon name="arrow-right" size={16} /> Try again
        </button>
      </div>
    </div>
  );
}
