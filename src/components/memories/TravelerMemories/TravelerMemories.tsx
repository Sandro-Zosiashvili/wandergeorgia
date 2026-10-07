'use client';

import { useState } from 'react';
import { memories, type Memory } from '@/data/memories';
import Container from '@/components/ui/Container/Container';
import SectionHeading from '@/components/ui/SectionHeading/SectionHeading';
import Button from '@/components/ui/Button/Button';
import Reveal from '@/components/ui/Reveal/Reveal';
import MemoryCard from '../MemoryCard/MemoryCard';
import MemoryLightbox from '../MemoryLightbox/MemoryLightbox';
import styles from './TravelerMemories.module.scss';

/** Number of curated moments shown on the home teaser. */
const PREVIEW_COUNT = 8;

/**
 * "Traveler Moments" home section — a curated grid of guest photos and video
 * clips sitting just below the tours. Tapping a card opens the lightbox; "See
 * all moments" links through to the full /memories gallery.
 */
export default function TravelerMemories() {
  const items = memories.slice(0, PREVIEW_COUNT);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const open = (memory: Memory) => {
    const i = items.findIndex((m) => m.id === memory.id);
    if (i >= 0) setOpenIndex(i);
  };

  return (
    <section id="moments" className={styles.section} aria-labelledby="moments-title">
      <Container>
        <div className={styles.header}>
          <SectionHeading
            eyebrow="Traveler moments"
            title={
              <span id="moments-title">
                Memories from <em>the road</em>
              </span>
            }
            description="Real photos and clips shared by guests across Georgia — from Kazbegi sunrises to Kakheti cellars. A glimpse of the trip waiting for you."
          />
        </div>

        <div className={styles.grid}>
          {items.map((memory, i) => (
            <Reveal key={memory.id} from="up" delay={(i % 4) * 0.06} className={styles.cell}>
              <MemoryCard memory={memory} onOpen={open} />
            </Reveal>
          ))}
        </div>

        <div className={styles.foot}>
          <Button href="/memories" variant="outline" icon="arrow-right">
            See all moments
          </Button>
        </div>
      </Container>

      <MemoryLightbox
        items={items}
        index={openIndex}
        onIndexChange={setOpenIndex}
        onClose={() => setOpenIndex(null)}
      />
    </section>
  );
}
