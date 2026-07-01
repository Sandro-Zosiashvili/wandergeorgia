import type { ReactNode } from 'react';
import Reveal from '../Reveal/Reveal';
import styles from './SectionHeading.module.scss';

interface SectionHeadingProps {
  /** Small gold label above the title. */
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: 'left' | 'center';
  /** Heading level for correct document outline. */
  as?: 'h2' | 'h3';
  className?: string;
}

/** Reusable premium section header: eyebrow · title · lead paragraph. */
export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  as: Tag = 'h2',
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={[styles.heading, styles[align], className]
        .filter(Boolean)
        .join(' ')}
    >
      {eyebrow ? (
        <Reveal from="up" distance={16}>
          <span className={styles.eyebrow}>
            <span className={styles.eyebrowMark} aria-hidden="true" />
            {eyebrow}
          </span>
        </Reveal>
      ) : null}

      <Reveal from="up" delay={0.05}>
        <Tag className={styles.title}>{title}</Tag>
      </Reveal>

      {description ? (
        <Reveal from="up" delay={0.12}>
          <p className={styles.description}>{description}</p>
        </Reveal>
      ) : null}
    </div>
  );
}
