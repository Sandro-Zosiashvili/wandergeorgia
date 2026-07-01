import Icon, { type IconName } from '@/components/ui/Icon/Icon';
import styles from './TrustCard.module.scss';

export interface TrustItem {
  icon: IconName;
  title: string;
  description: string;
}

interface TrustCardProps {
  item: TrustItem;
}

/** A single reason-to-trust tile with an accent icon. */
export default function TrustCard({ item }: TrustCardProps) {
  return (
    <div className={styles.card}>
      <span className={styles.iconWrap} aria-hidden="true">
        <Icon name={item.icon} size={24} />
      </span>
      <h3 className={styles.title}>{item.title}</h3>
      <p className={styles.desc}>{item.description}</p>
    </div>
  );
}
