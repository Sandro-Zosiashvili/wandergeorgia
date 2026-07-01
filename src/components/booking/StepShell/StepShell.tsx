import type { ReactNode } from 'react';
import styles from './StepShell.module.scss';

interface StepShellProps {
  title: string;
  description?: string;
  children: ReactNode;
}

/** Consistent heading + body wrapper for each booking step. */
export default function StepShell({ title, description, children }: StepShellProps) {
  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
        {description ? <p className={styles.description}>{description}</p> : null}
      </header>
      <div className={styles.body}>{children}</div>
    </div>
  );
}
