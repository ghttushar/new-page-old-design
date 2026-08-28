import styles from './performance-metric-cards.module.scss';

interface MetricCard {
  label: string;
  value: string;
  trend: string;
  trendUp: boolean;
  subtitle: string;
}

const MOCK_METRICS: MetricCard[] = [
  { label: 'Impressions', value: '820,400', trend: '33.53%', trendUp: true, subtitle: 'Previous 7 days: 615,000' },
  { label: 'Clicks', value: '21,230', trend: '34.37%', trendUp: true, subtitle: 'Previous 7 days: 15,800' },
  { label: 'Ad Spend', value: '$35,280.50', trend: '33.64%', trendUp: true, subtitle: 'Previous 7 days: $26,400.00' },
  { label: 'CVR', value: '7.30%', trend: '5.80%', trendUp: true, subtitle: 'Previous 7 days: 6.90%' },
  { label: 'ACoS', value: '27.50%', trend: '0.36%', trendUp: false, subtitle: 'Previous 7 days: 27.40%' },
];

export default function PerformanceMetricCards() {
  return (
    <div className={styles.metricCardsRow}>
      {MOCK_METRICS.map((card, i) => (
          <div
            key={i}
            className={`${styles.metricCard} ${styles.metricCardSelected}`}
          >
            <div className={styles.metricCardHeader}>
              <span className={styles.metricLabel}>{card.label}</span>
              <span className={styles.metricInfoIcon}>ⓘ</span>
              <span className={`${styles.metricTrend} ${card.trendUp ? styles.trendUp : styles.trendDown}`}>
                {card.trendUp ? '↗' : '↘'} {card.trend}
              </span>
            </div>
            <div className={styles.metricValue}>{card.value}</div>
            <div className={styles.metricSubtitle}>{card.subtitle}</div>
          </div>
        ))}
    </div>
  );
}
