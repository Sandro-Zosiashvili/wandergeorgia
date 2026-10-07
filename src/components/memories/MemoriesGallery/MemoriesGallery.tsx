'use client';

import { useMemo, useState } from 'react';
import { memories, type Memory, type MemoryType } from '@/data/memories';
import Reveal from '@/components/ui/Reveal/Reveal';
import MemoryCard from '../MemoryCard/MemoryCard';
import MemoryLightbox from '../MemoryLightbox/MemoryLightbox';
import styles from './MemoriesGallery.module.scss';

type Filter = 'all' | MemoryType;

const TABS: { key: Filter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'image', label: 'Photos' },
  { key: 'video', label: 'Videos' },
];

/**
 * Full moments gallery: filter tabs (All / Photos / Videos) over the complete
 * grid, with the shared lightbox for viewing a photo or playing a clip. The
 * lightbox browses within the *currently filtered* set.
 */
export default function MemoriesGallery() {
  const [filter, setFilter] = useState<Filter>('all');
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const items = useMemo(
    () => (filter === 'all' ? memories : memories.filter((m) => m.type === filter)),
    [filter],
  );

  const counts = useMemo(
    () => ({
      all: memories.length,
      image: memories.filter((m) => m.type === 'image').length,
      video: memories.filter((m) => m.type === 'video').length,
    }),
    [],
  );

  const changeFilter = (next: Filter) => {
    setOpenIndex(null); // indices differ between filtered sets
    setFilter(next);
  };

  const open = (memory: Memory) => {
    const i = items.findIndex((m) => m.id === memory.id);
    if (i >= 0) setOpenIndex(i);
  };

  return (
    <>
      <div className={styles.tabs} role="tablist" aria-label="Filter moments">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            role="tab"
            aria-selected={filter === tab.key}
            className={[styles.tab, filter === tab.key ? styles.tabActive : '']
              .filter(Boolean)
              .join(' ')}
            onClick={() => changeFilter(tab.key)}
          >
            {tab.label}
            <span className={styles.count}>{counts[tab.key]}</span>
          </button>
        ))}
      </div>

      <div className={styles.grid}>
        {items.map((memory, i) => (
          <Reveal key={memory.id} from="up" delay={(i % 4) * 0.05} className={styles.cell}>
            <MemoryCard memory={memory} onOpen={open} />
          </Reveal>
        ))}
      </div>

      <MemoryLightbox
        items={items}
        index={openIndex}
        onIndexChange={setOpenIndex}
        onClose={() => setOpenIndex(null)}
      />
    </>
  );
}
