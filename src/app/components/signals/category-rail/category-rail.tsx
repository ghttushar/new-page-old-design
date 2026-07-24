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

function iconFor(label: string): string {
  const map: Record<string, string> = {
    'All': '□',
    'Advertising': '📣',
    'Inventory': '📦',
    'Profitability': '📈',
    'Customer Service': '💬',
    'Buyer / Accounts': '👥',
    'Retail Listings': '🏷️',
    'Competitor Updates': '⚡',
    'Market Changes': '📊',
    'Insights': '💡',
    'Completed Today': '✅',
  };
  return map[label] || '○';
}

export function CategoryRail({ items, activeKey, onSelect }: CategoryRailProps) {
  const total = items.reduce((n, it) => n + it.count, 0);
  return (
    <nav className={styles.categoryRail}>
      <div className={styles.header}>Categories</div>
      <button
        className={`${styles.item} ${activeKey === null || activeKey === '__all__' ? styles.active : ''}`}
        onClick={() => onSelect('__all__')}
      >
        <span className={styles.icon}>□</span>
        <span className={styles.label}>All</span>
        <span className={`${styles.count} ${activeKey === null || activeKey === '__all__' ? styles.active : ''}`}>
          {total}
        </span>
      </button>
      {items.map((it) => {
        const active = activeKey === it.key;
        return (
          <button
            key={it.key}
            className={`${styles.item} ${active ? styles.active : ''}`}
            onClick={() => onSelect(it.key)}
          >
            <span className={styles.icon}>{iconFor(it.label)}</span>
            <span className={styles.label}>{it.label}</span>
            <span className={`${styles.count} ${active ? styles.active : ''}`}>{it.count}</span>
          </button>
        );
      })}
    </nav>
  );
}