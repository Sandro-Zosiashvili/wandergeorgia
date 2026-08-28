import { useEffect, useId, useRef } from 'react';
import Icon, { type IconName } from '../Icon/Icon';
import styles from './TextField.module.scss';

interface BaseProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  icon?: IconName;
  required?: boolean;
  placeholder?: string;
  hint?: string;
}

type TextFieldProps = BaseProps & {
  type?: 'text' | 'email' | 'tel' | 'date';
  multiline?: false;
  min?: string;
};

type TextAreaProps = BaseProps & {
  multiline: true;
  rows?: number;
};

type Props = TextFieldProps | TextAreaProps;

/** Labelled text/date/email input (or textarea) with error + icon states. */
export default function TextField(props: Props) {
  const { label, value, onChange, error, icon, required, placeholder, hint } = props;
  const id = useId();
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;

  // Auto-grow the textarea to fit its content (no manual resize handle).
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    if (!props.multiline) return;
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }, [value, props.multiline]);

  const describedBy = [error ? errorId : null, hint ? hintId : null]
    .filter(Boolean)
    .join(' ') || undefined;

  return (
    <div className={[styles.field, error ? styles.hasError : ''].filter(Boolean).join(' ')}>
      <label htmlFor={id} className={styles.label}>
        {label}
        {required ? <span className={styles.req} aria-hidden="true"> *</span> : null}
      </label>

      <div className={styles.inputWrap}>
        {icon && !props.multiline ? (
          <Icon name={icon} size={18} className={styles.icon} />
        ) : null}

        {props.multiline ? (
          <textarea
            id={id}
            ref={textareaRef}
            className={[styles.input, styles.textarea].join(' ')}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            rows={props.rows ?? 3}
            required={required}
            aria-invalid={!!error}
            aria-describedby={describedBy}
          />
        ) : (
          <input
            id={id}
            type={props.type ?? 'text'}
            className={[styles.input, icon ? styles.withIcon : ''].filter(Boolean).join(' ')}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            min={props.type === 'date' ? props.min : undefined}
            required={required}
            aria-invalid={!!error}
            aria-describedby={describedBy}
          />
        )}
      </div>

      {hint && !error ? (
        <p id={hintId} className={styles.hint}>
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} className={styles.error} role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
