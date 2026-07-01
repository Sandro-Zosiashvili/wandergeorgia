import type { ElementType, ReactNode } from 'react';
import styles from './Container.module.scss';

interface ContainerProps {
  children: ReactNode;
  /** Render as a different element, e.g. `section` or `header`. */
  as?: ElementType;
  /** Narrower measure for text-heavy content. */
  size?: 'default' | 'narrow' | 'wide';
  className?: string;
  id?: string;
}

/** Centred page gutter with a consistent editorial max-width. */
export default function Container({
  children,
  as: Tag = 'div',
  size = 'default',
  className,
  id,
}: ContainerProps) {
  return (
    <Tag
      id={id}
      className={[styles.container, styles[size], className]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </Tag>
  );
}
