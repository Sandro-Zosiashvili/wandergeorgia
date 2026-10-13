'use client';

import { useMemo, useState } from 'react';
import type { Tour } from '@/types/tour';
import Container from '@/components/ui/Container/Container';
import SectionHeading from '@/components/ui/SectionHeading/SectionHeading';
import CityFilter, { ALL_CITIES } from '../CityFilter/CityFilter';
import TourGrid from '../TourGrid/TourGrid';
import { useLocale } from '@/hooks/useLocale';
import { ui } from '@/lib/uiStrings';
import { emphasize } from '@/lib/emphasize';
import styles from './OneDayTours.module.scss';

interface OneDayToursProps {
  tours: Tour[];
}

/** "One-Day Tours" home section — filterable grid organised by city. */
export default function OneDayTours({ tours }: OneDayToursProps) {
  const t = ui(useLocale()).home.oneDay;
  const [city, setCity] = useState<string>(ALL_CITIES);

  const cities = useMemo(
    () => Array.from(new Set(tours.map((t) => t.city))),
    [tours],
  );

  const filtered = useMemo(
    () => (city === ALL_CITIES ? tours : tours.filter((t) => t.city === city)),
    [city, tours],
  );

  return (
    <section id="day-tours" className={styles.section} aria-labelledby="day-tours-title">
      <Container>
        <div className={styles.header}>
          <SectionHeading
            eyebrow={t.eyebrow}
            title={<span id="day-tours-title">{emphasize(t.title)}</span>}
            description={t.description}
          />
          <CityFilter cities={cities} active={city} onChange={setCity} />
        </div>

        <TourGrid tours={filtered} featureFirst />
      </Container>
    </section>
  );
}
