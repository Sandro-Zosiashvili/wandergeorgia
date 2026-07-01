import { iconRegistry, type IconDef, type IconName } from './icons';

export type { IconName };

interface IconProps {
  name: IconName;
  size?: number;
  /** Stroke width for line icons. Ignored by filled icons. */
  stroke?: number;
  className?: string;
  title?: string;
}

/**
 * Single inline-SVG icon component backed by the icon registry.
 * Decorative by default (aria-hidden); pass `title` to expose a label.
 */
export default function Icon({
  name,
  size = 24,
  stroke = 1.6,
  className,
  title,
}: IconProps) {
  const def: IconDef = iconRegistry[name];
  const filled = def.filled ?? false;

  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke={filled ? 'none' : 'currentColor'}
      strokeWidth={filled ? undefined : stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      role={title ? 'img' : 'presentation'}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      focusable="false"
    >
      {title ? <title>{title}</title> : null}
      {def.node}
    </svg>
  );
}
