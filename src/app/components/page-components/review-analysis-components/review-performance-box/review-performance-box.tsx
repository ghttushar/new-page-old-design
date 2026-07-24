import { IReviewAnalysisData } from 'src/interfaces/review-analysis.interface';
import { formatNum } from 'src/utils';
import styles from './review-performance-box.module.scss';

interface ReviewPerformanceBoxProps {
  data: IReviewAnalysisData;
}

const ReviewPerformanceBox = (props: ReviewPerformanceBoxProps) => {
  const reviewsData = props.data.reviewsData;

  return (
    <div className={styles.reviewPerformanceBoxWrapper}>
      <div className={styles.metricBox}>
        <div className={styles.metricTitle}>Overall Review</div>
        <div className={styles.metricValue}>
          {formatNum(reviewsData.total_reviews || 0, false)}
        </div>
      </div>
      <div className={styles.verticalBorder}></div>
      <div className={styles.metricBox}>
        <div className={styles.metricTitle}>Positive</div>
        <div className={styles.metricValue}>
          {formatNum(reviewsData.positive_reviews || 0, false)}
        </div>
      </div>
      <div className={styles.verticalBorder}></div>
      <div className={styles.metricBox}>
        <div className={styles.metricTitle}>Negative</div>
        <div className={styles.metricValue}>
          {formatNum(reviewsData.negative_reviews || 0, false)}
        </div>
      </div>
      <div className={styles.verticalBorder}></div>
      <div className={styles.metricBox}>
        <div className={styles.metricTitle}>Neutral</div>
        <div className={styles.metricValue}>
          {formatNum(reviewsData.neutral_reviews || 0, false)}
        </div>
      </div>
    </div>
  );
};

export default ReviewPerformanceBox;
