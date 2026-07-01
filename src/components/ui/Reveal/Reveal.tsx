'use client';

import { useEffect, useState, type CSSProperties, type ReactNode } from 'react';
import { useInView } from '@/hooks/useInView';

type Direction = 'up' | 'down' | 'left' | 'right' | 'none';
type Tag = 'div' | 'li' | 'span' | 'section';

interface RevealProps {
  children: ReactNode;
  /** Entry direction of the slide. */
  from?: Direction;
  /** Seconds of delay before the reveal starts. */
  delay?: number;
  /** Travel distance in px. */
  distance?: number;
  once?: boolean;
  className?: string;
  as?: Tag;
}

const axisOffset = (dir: Direction, d: number): { x: number; y: number } => {
  switch (dir) {
    case 'up':
      return { x: 0, y: d };
    case 'down':
      return { x: 0, y: -d };
    case 'left':
      return { x: d, y: 0 };
    case 'right':
      return { x: -d, y: 0 };
    default:
      return { x: 0, y: 0 };
  }
};

/**
 * Scroll-triggered reveal — a short rise + fade as content enters the viewport.
 * State is applied via inline styles (rather than a toggled class) so it can
 * never be lost to a stylesheet cascade/ordering quirk. Uses a scroll-position
 * check (see useInView) and respects prefers-reduced-motion.
 */
export default function Reveal({
  children,
  from = 'up',
  delay = 0,
  distance = 28,
  once = true,
  className,
  as: Tag = 'div',
}: RevealProps) {
  const [ref, inView] = useInView<HTMLElement>({ once });
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  const { x, y } = axisOffset(from, distance);
  const shown = inView || reduced;

  const style: CSSProperties = {
    opacity: shown ? 1 : 0,
    transform: shown ? 'translate3d(0, 0, 0)' : `translate3d(${x}px, ${y}px, 0)`,
    transition: reduced
      ? 'none'
      : `opacity 0.75s cubic-bezier(0.22, 1, 0.36, 1) ${delay}s, transform 0.75s cubic-bezier(0.22, 1, 0.36, 1) ${delay}s`,
    willChange: 'opacity, transform',
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Component = Tag as any;

  return (
    <Component ref={ref} className={className} style={style}>
      {children}
    </Component>
  );
}
