import styles from './weekly-review-trend.module.scss';
import ReviewTrendGraph from './weekly-trend-graph';

const WeeklyReviewTrend = () => {
  return (
    <div className={styles.WeeklyReviewTrendWrapper}>
      <div className={styles.WeeklyReviewTrendTitle}>
        <h3>Weekly Review Trend</h3>
      </div>
      <div className={styles.WeeklyTrendGraph}>
        <ReviewTrendGraph />
      </div>
    </div>
  );
};

export default WeeklyReviewTrend;
