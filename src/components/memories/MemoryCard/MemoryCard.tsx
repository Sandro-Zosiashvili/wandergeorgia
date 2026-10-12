import Image from 'next/image';
import type { Memory } from '@/data/memories';
import { flagFor } from '@/data/memories';
import Icon from '@/components/ui/Icon/Icon';
import styles from './MemoryCard.module.scss';

interface MemoryCardProps {
  memory: Memory;
  /** Opens the lightbox for this moment. */
  onOpen: (memory: Memory) => void;
  /** Hint for next/image responsive sizing (grid column width). */
  sizes?: string;
}

/**
 * A single traveler moment — photo (or video thumbnail with a play badge),
 * location tag, caption and the traveler's name + country flag. Rendered as a
 * button so it opens the shared lightbox on click/Enter.
 */
export default function MemoryCard({
  memory,
  onOpen,
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw',
}: MemoryCardProps) {
  const isVideo = memory.type === 'video';

  return (
    <button
      type="button"
      className={styles.card}
      onClick={() => onOpen(memory)}
      aria-label={`${isVideo ? 'Play video' : 'View photo'} from ${memory.tourTitle} by ${memory.travelerName}`}
    >
      {/* Inner wrapper holds the flex layout: Safari/iOS does NOT honour
          display:flex/grid on a <button> itself, which collapsed the
          aspect-ratio media box to 0 height on mobile. */}
      <span className={styles.cardInner}>
        <div className={styles.mediaFrame}>
          <div className={styles.media}>
          <Image
            src={memory.thumbnailUrl}
            alt={memory.caption}
            fill
            sizes={sizes}
            // Load eagerly: the default lazy IntersectionObserver can fail to
            // fire on some mobile browsers for a fill image whose aspect-ratio
            // box resolves its height after the observer registers, leaving the
            // card media blank until the item is opened. These are the section's
            // primary content, so eager loading is the right call.
            loading="eager"
            className={styles.image}
          />
          <span className={styles.scrim} aria-hidden="true" />

          <span className={styles.locTag}>
            <Icon name="map-pin" size={13} />
            {memory.tourTitle}
          </span>

          {isVideo ? (
            <span className={styles.playWrap} aria-hidden="true">
              <span className={styles.play}>
                <Icon name="play" size={20} />
              </span>
            </span>
          ) : null}
        </div>
      </div>

      <div className={styles.body}>
        <p className={styles.caption}>{memory.caption}</p>
        <span className={styles.traveler}>
          <span className={styles.flag} aria-hidden="true">
            {flagFor(memory.country)}
          </span>
          <span className={styles.name}>{memory.travelerName}</span>
          <span className={styles.dot} aria-hidden="true">
            ·
          </span>
          <span className={styles.country}>{memory.country}</span>
        </span>
      </div>
      </span>
    </button>
  );
}
