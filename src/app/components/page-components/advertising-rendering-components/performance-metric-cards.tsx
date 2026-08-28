import styles from './performance-metric-cards.module.scss';

interface MetricCard {
  label: string;
  value: string;
  trend: string;
  trendUp: boolean;
  subtitle: string;
}

const MOCK_METRICS: MetricCard[] = [
  { label: 'Ad Spend', value: '$500,171.31', trend: '33.53%', trendUp: true, subtitle: 'Previous 7 days: $37,574.1' },
  { label: 'Ad Spend', value: '$500,171.31', trend: '33.53%', trendUp: true, subtitle: 'Previous 7 days: $37,574.1' },
  { label: 'Ad Spend', value: '$500,171.31', trend: '33.53%', trendUp: true, subtitle: 'Previous 7 days: $37,574.1' },
  { label: 'Ad Spend', value: '$500,171.31', trend: '33.53%', trendUp: true, subtitle: 'Previous 7 days: $37,574.1' },
  { label: 'Ad Spend', value: '$500,171.31', trend: '33.53%', trendUp: true, subtitle: 'Previous 7 days: $37,574.1' },
];

export default function PerformanceMetricCards() {
  return (
    <div className={styles.metricCardsRow}>
      {MOCK_METRICS.map((card, i) => {
        const isSelected = i === MOCK_METRICS.length - 1;
        return (
          <div
            key={i}
            className={`${styles.metricCard} ${isSelected ? styles.metricCardSelected : ''}`}
          >
            <div className={styles.metricCardHeader}>
              <span className={styles.metricLabel}>{card.label}</span>
              <span className={styles.metricInfoIcon}>ⓘ</span>
              <span className={`${styles.metricTrend} ${card.trendUp ? styles.trendUp : styles.trendDown}`}>
                ↘ {card.trend}
              </span>
            </div>
            <div className={styles.metricValue}>{card.value}</div>
            <div className={styles.metricSubtitle}>{card.subtitle}</div>
          </div>
        );
      })}
    </div>
  );
}
