import { CircularProgress } from '@mui/material';
import styles from './custom-table-loader.module.scss';
/* eslint-disable-next-line */
export interface CustomTableLoaderProps {
  loadingOverlay?: JSX.Element;
}

export function CustomTableLoader(props: CustomTableLoaderProps) {
  const { loadingOverlay } = props;
  return (
    <div className={`${styles.customTableLoader} `}>
      <div className={styles.container}>
        {loadingOverlay ? (
          loadingOverlay
        ) : (
          <div className={styles.content}>
            <CircularProgress sx={{ color: '#77469b' }} />
            <p className={styles.text}>
              Please wait while data is being fetched
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default CustomTableLoader;
