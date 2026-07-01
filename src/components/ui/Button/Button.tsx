import Link from 'next/link';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import Icon, { type IconName } from '../Icon/Icon';
import styles from './Button.module.scss';

type Variant = 'primary' | 'outline' | 'ghost' | 'light';
type Size = 'sm' | 'md' | 'lg';

interface CommonProps {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  icon?: IconName;
  /** Place the icon before the label instead of after. */
  iconLeading?: boolean;
  fullWidth?: boolean;
  className?: string;
}

type AsLink = CommonProps & {
  href: string;
  external?: boolean;
  type?: never;
  onClick?: never;
  disabled?: never;
};

type AsButton = CommonProps &
  Pick<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick' | 'type' | 'disabled' | 'aria-label'> & {
    href?: never;
    external?: never;
  };

type ButtonProps = AsLink | AsButton;

/**
 * The one button in the system. Renders a next/link, a plain anchor for
 * external URLs, or a native button — with consistent premium styling.
 */
export default function Button(props: ButtonProps) {
  const {
    children,
    variant = 'primary',
    size = 'md',
    icon,
    iconLeading = false,
    fullWidth = false,
    className,
  } = props;

  const classes = [
    styles.button,
    styles[variant],
    styles[size],
    fullWidth ? styles.full : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const iconSize = size === 'lg' ? 20 : size === 'sm' ? 16 : 18;
  const content = (
    <span className={styles.inner}>
      {icon && iconLeading ? <Icon name={icon} size={iconSize} /> : null}
      <span className={styles.label}>{children}</span>
      {icon && !iconLeading ? (
        <Icon name={icon} size={iconSize} className={styles.trailingIcon} />
      ) : null}
    </span>
  );

  if ('href' in props && props.href !== undefined) {
    if (props.external) {
      return (
        <a
          href={props.href}
          target="_blank"
          rel="noopener noreferrer"
          className={classes}
        >
          {content}
        </a>
      );
    }
    return (
      <Link href={props.href} className={classes}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type={props.type ?? 'button'}
      onClick={props.onClick}
      disabled={props.disabled}
      aria-label={props['aria-label']}
      className={classes}
    >
      {content}
    </button>
  );
}
