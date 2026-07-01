'use client';

import styles from './CityFilter.module.scss';

interface CityFilterProps {
  cities: string[];
  active: string;
  onChange: (city: string) => void;
}

export const ALL_CITIES = 'All';

/** Pill filter bar for day tours, filtering by city. */
export default function CityFilter({ cities, active, onChange }: CityFilterProps) {
  const options = [ALL_CITIES, ...cities];

  return (
    <div className={styles.filter} role="tablist" aria-label="Filter tours by city">
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
            {city}
          </button>
        );
      })}
    </div>
  );
}
