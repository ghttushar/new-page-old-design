import { IReview } from 'src/interfaces/review-analysis.interface';
import styles from './review-summary.module.scss';

interface ReviewSummaryTableProps {
  tableColumns: {
    id: number;
    columnName: string;
  }[];
  data: IReview[];
  onClick: (review: IReview) => void;
}
const ReviewSummaryTable = ({
  tableColumns,
  data,
  onClick,
}: ReviewSummaryTableProps) => {
  return (
    <div className={styles.TableWrapper}>
      <table className={styles.ReviewSummaryTable}>
        <thead>
          <tr>
            <th>{tableColumns[0].columnName}</th>
            <th>No of Mentions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, id) => {
            return (
              <tr key={id}>
                <td className={styles.bold} onClick={() => onClick(item)}>
                  {item.keyword}
                </td>
                <td>{item.count}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ReviewSummaryTable;
