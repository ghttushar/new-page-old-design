import styles from './review-summary.module.scss';

export interface Review {
  type: string;
  keyword: string;
  score: number;
  summary: string;
  points: ReviewPoint[];
}
interface ReviewPoint {
  id: number;
  point: string;
}
interface ReviewSummaryScoreProps {
  positive: Review;
  negative: Review;
  neutral: Review;
  onClick: (review: Review) => void;
}
const ReviewScoreCell = ({
  positive,
  negative,
  neutral,
  onClick,
}: ReviewSummaryScoreProps) => {
  return (
    <div className={styles.ReviewScoreCell}>
      <div
        className={`${styles.CellContent} ${styles.Positive}`}
        style={{ width: `${positive.score}%` }}
        onClick={() => onClick(positive)}
      >
        {positive.score}%
      </div>
      <div
        className={`${styles.CellContent} ${styles.Negative}`}
        style={{ width: `${negative.score}%` }}
        onClick={() => onClick(negative)}
      >
        {negative.score}%
      </div>
      <div
        className={`${styles.CellContent} ${styles.Neutral}`}
        style={{ width: `${neutral.score}%` }}
        onClick={() => onClick(neutral)}
      >
        {neutral.score}%
      </div>
    </div>
  );
};

export default ReviewScoreCell;
