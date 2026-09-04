'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { site, whatsappLink } from '@/config/site';
import Icon from '@/components/ui/Icon/Icon';
import styles from './WhatsAppButton.module.scss';

/**
 * Fixed, always-visible WhatsApp button on the left edge.
 * Elegant on-brand pill that expands a label on hover/focus.
 */
export default function WhatsAppButton() {
  const [hovered, setHovered] = useState(false);

  return (
    <a
      href={whatsappLink()}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.button}
      aria-label={`Chat with ${site.name} on WhatsApp`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
    >
      <span className={styles.pulse} aria-hidden="true" />
      <span className={styles.iconWrap}>
        <Icon name="whatsapp" size={30} />
      </span>

      <AnimatePresence>
        {hovered ? (
          <motion.span
            className={styles.label}
            initial={{ opacity: 0, width: 0, marginLeft: 0 }}
            animate={{ opacity: 1, width: 'auto', marginLeft: 12 }}
            exit={{ opacity: 0, width: 0, marginLeft: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            Chat with us
          </motion.span>
        ) : null}
      </AnimatePresence>
    </a>
  );
}

