'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Icon from '@/components/ui/Icon/Icon';
import styles from './CityFilter.module.scss';

interface CityFilterProps {
  cities: string[];
  active: string;
  onChange: (city: string) => void;
}

export const ALL_CITIES = 'All';

/**
 * Swipeable, single-line city filter for day tours. On phones it scrolls
 * horizontally with edge fades hinting there's more; on desktop it wraps.
 */
export default function CityFilter({ cities, active, onChange }: CityFilterProps) {
  const options = [ALL_CITIES, ...cities];
  const railRef = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ start: false, end: false });

  const syncEdges = useCallback(() => {
    const el = railRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setEdges({
      start: scrollLeft > 4,
      end: scrollLeft + clientWidth < scrollWidth - 4,
    });
  }, []);

  useEffect(() => {
    syncEdges();
    const el = railRef.current;
    if (!el) return;
    el.addEventListener('scroll', syncEdges, { passive: true });
    window.addEventListener('resize', syncEdges);
    return () => {
      el.removeEventListener('scroll', syncEdges);
      window.removeEventListener('resize', syncEdges);
    };
  }, [syncEdges]);

  // Keep the selected chip in view when it changes.
  useEffect(() => {
    const el = railRef.current?.querySelector('[aria-selected="true"]');
    el?.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
  }, [active]);

  return (
    <div
      className={[
        styles.wrap,
        edges.start ? styles.fadeStart : '',
        edges.end ? styles.fadeEnd : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className={styles.rail} ref={railRef} role="tablist" aria-label="Filter tours by city">
        {options.map((city) => {
          const isActive = city === active;
          return (
            <button
              key={city}
              role="tab"
              aria-selected={isActive}
              className={[styles.pill, isActive ? styles.active : ''].filter(Boolean).join(' ')}
              onClick={() => onChange(city)}
            >
              <Icon name="map-pin" size={15} className={styles.pin} />
              {city}
            </button>
          );
        })}
      </div>
    </div>
  );
}
