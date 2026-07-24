import {
  IReview,
  IReviewAnalysisData,
} from 'src/interfaces/review-analysis.interface';
import ReviewSummaryTable from './review-summary-table';
import styles from './review-summary.module.scss';

const positiveTableColumnNames = [
  { id: 1, columnName: 'Top Positive Keywords' },
  {
    id: 2,
    columnName: 'Score',
  },
  {
    id: 3,
    columnName: 'No of Mentions',
  },
];

const negativeTableColumnNames = [
  { id: 1, columnName: 'Top Negative Keywords' },
  {
    id: 2,
    columnName: 'Score',
  },
  {
    id: 3,
    columnName: 'No of Mentions',
  },
];
interface ReviewSummaryProps {
  reviewAnalysisData: IReviewAnalysisData;
  onClick: (review: IReview) => void;
}
const ReviewSummary = ({ reviewAnalysisData, onClick }: ReviewSummaryProps) => {
  return (
    <div className={styles.ReviewSummaryWrapper}>
      <div className={styles.ReviewSummaryTitle}>
        <h3>Reviews Summary</h3>
      </div>
      <div className={styles.ReviewSummaryReportWrapper}>
        <div className={styles.ReviewSummaryReportBox}>
          <div className={styles.ReviewSummaryReportTitle}>
            Top Positive Tags
          </div>

          <div className={styles.ReviewSummaryReportBorderLine}></div>
          <ReviewSummaryTable
            tableColumns={positiveTableColumnNames}
            data={reviewAnalysisData.positiveKeywords}
            onClick={onClick}
          />
        </div>
        <div className={styles.verticalBorder}></div>
        <div className={styles.ReviewSummaryReportBox}>
          <div className={styles.ReviewSummaryReportTitle}>
            Top Negative Tags
          </div>
          <div className={styles.ReviewSummaryReportBorderLine}></div>
          <ReviewSummaryTable
            tableColumns={negativeTableColumnNames}
            data={reviewAnalysisData.negativeKeywords}
            onClick={onClick}
          />
        </div>
      </div>
    </div>
  );
};

export default ReviewSummary;
