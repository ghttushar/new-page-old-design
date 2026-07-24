import { Folder, Megaphone, Package, TrendUp, ChatCircle, Users, Tag, Sparkle, Clock, CheckCircle, Lightning, Robot } from '@phosphor-icons/react';
import type { Icon } from '@phosphor-icons/react';
import styles from './category-rail.module.scss';

interface RailItem {
  key: string;
  label: string;
  count: number;
}

interface CategoryRailProps {
  items: RailItem[];
  activeKey: string | null;
  onSelect: (key: string) => void;
}

const ICON_MAP: Record<string, Icon> = {
  'Advertising': Megaphone,
  'Inventory': Package,
  'Profitability': TrendUp,
  'Customer Service': ChatCircle,
  'Buyer / Accounts': Users,
  'Retail Listings': Tag,
  'Competitor Updates': Lightning,
  'Market Changes': TrendUp,
  'Insights': Sparkle,
  'Completed Today': CheckCircle,
  'Completed This Week': CheckCircle,
  'Pending This Week': Clock,
  'Automated': Robot,
  'Amazon': Tag,
  'Walmart': Tag,
  'Internal': Folder,
  'Customer Calls': ChatCircle,
};

export function CategoryRail({ items, activeKey, onSelect }: CategoryRailProps) {
  const total = items.reduce((n, it) => n + it.count, 0);
  return (
    <nav className={styles.categoryRail}>
      <div className={styles.header}>Categories</div>
      <button
        className={`${styles.item} ${activeKey === null || activeKey === '__all__' ? styles.active : ''}`}
        onClick={() => onSelect('__all__')}
      >
        <Folder size={14} className={styles.icon} />
        <span className={styles.label}>All</span>
        <span className={`${styles.count} ${activeKey === null || activeKey === '__all__' ? styles.countActive : ''}`}>
          {total}
        </span>
      </button>
      {items.map((it) => {
        const active = activeKey === it.key;
        const IconComp = ICON_MAP[it.label] || Folder;
        return (
          <button
            key={it.key}
            className={`${styles.item} ${active ? styles.active : ''}`}
            onClick={() => onSelect(it.key)}
          >
            <IconComp size={14} className={styles.icon} />
            <span className={styles.label}>{it.label}</span>
            <span className={`${styles.count} ${active ? styles.countActive : ''}`}>{it.count}</span>
          </button>
        );
      })}
    </nav>
  );
}
