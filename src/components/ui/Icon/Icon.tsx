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
      // Most icons live on a 24×24 grid; a few brand marks ship on their own
      // grid and declare it via `viewBox`.
      // Inline style, not just the width/height attributes below: SVG
      // presentation attributes carry almost no cascade weight, so any
      // unrelated class-based CSS rule can silently override them and the
      // `size` prop stops having any visible effect. Inline style always
      // wins short of `!important`, so this can't happen again.
      style={{
        flexShrink: 0,
        width: size,
        height: size,
        minWidth: size,
        minHeight: size,
        maxWidth: 'none',
      }}
      width={size}
      height={size}
      viewBox={def.viewBox ?? '0 0 24 24'}
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
