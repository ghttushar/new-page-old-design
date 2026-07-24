import styles from './table-empty-state.module.scss';

interface ITableEmptyStateProps {
  handleReset: () => void;
}

export default function TableEmptyState({
  handleReset,
}: ITableEmptyStateProps) {
  return (
    <div className={styles.tableEmptyContainer}>
      <p>
        No data found for the selected filters.{' '}
        <span onClick={handleReset}>Reset the filters.</span>
      </p>
    </div>
  );
}
