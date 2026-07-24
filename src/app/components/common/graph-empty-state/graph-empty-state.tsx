import Typography from '@mui/material/Typography';
import TextButton from '../text-button/text-button';
import styles from './graph-empty-state.module.scss';
interface IGraphEmptyState {
  hideGraphOnClick?: () => void;
}
export default function GraphEmptyState({
  hideGraphOnClick,
}: IGraphEmptyState) {
  return (
    <div className={styles.emptyContainer}>
      {hideGraphOnClick && (
        <span className={styles.hideChart}>
          <TextButton
            label={'Hide Chart'}
            handleClick={hideGraphOnClick}
            customStyles={{
              fontSize: '1rem',
            }}
          />
        </span>
      )}
      <Typography
        variant="h4"
        color="#000000"
        fontSize="1.5rem"
        fontWeight={700}
      >
        No data available
      </Typography>
      <Typography
        variant="body1"
        color="#777777"
        fontSize="1.2rem"
        fontWeight={600}
      >
        Please try adjusting filters to see performance data
      </Typography>
    </div>
  );
}
