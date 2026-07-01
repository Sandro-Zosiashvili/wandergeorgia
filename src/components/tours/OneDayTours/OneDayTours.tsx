'use client';

import { useMemo, useState } from 'react';
import { oneDayTours } from '@/data/tours';
import Container from '@/components/ui/Container/Container';
import SectionHeading from '@/components/ui/SectionHeading/SectionHeading';
import CityFilter, { ALL_CITIES } from '../CityFilter/CityFilter';
import TourGrid from '../TourGrid/TourGrid';
import styles from './OneDayTours.module.scss';

/** "One-Day Tours" home section — filterable grid organised by city. */
export default function OneDayTours() {
  const [city, setCity] = useState<string>(ALL_CITIES);

  const cities = useMemo(
    () => Array.from(new Set(oneDayTours.map((t) => t.city))),
    [],
  );

  const filtered = useMemo(
    () => (city === ALL_CITIES ? oneDayTours : oneDayTours.filter((t) => t.city === city)),
    [city],
  );

  return (
    <section id="day-tours" className={styles.section} aria-labelledby="day-tours-title">
      <Container>
        <div className={styles.header}>
          <SectionHeading
            eyebrow="Single-day escapes"
            title={
              <span id="day-tours-title">
                One-day <em>tours</em>
              </span>
            }
            description="Set out after breakfast, return by evening. Each private day trip is fully guided, at your own pace — choose a base and we'll do the rest."
          />
          <CityFilter cities={cities} active={city} onChange={setCity} />
        </div>

        <TourGrid tours={filtered} featureFirst />
      </Container>
    </section>
  );
}
