import { Fragment, type ReactNode } from 'react';

/**
 * Render a heading string where the emphasised word is wrapped in `*asterisks*`
 * as `<em>…</em>`, e.g. `"One-day *tours*"` → `One-day <em>tours</em>`. Lets the
 * section titles keep their gold-italic accent in both locales from a single
 * dictionary string.
 */
export function emphasize(text: string): ReactNode[] {
  return text.split(/\*([^*]+)\*/).map((part, i) =>
    i % 2 === 1 ? <em key={i}>{part}</em> : <Fragment key={i}>{part}</Fragment>,
  );
}
