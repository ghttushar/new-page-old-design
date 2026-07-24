import { CircularProgress } from '@mui/material';
import styles from './custom-edit-loader.module.scss';
export interface CustomTableLoaderProps {
  overlayText?: string;
  borderRadius?: string;
}

export function CustomEditLoader(props: CustomTableLoaderProps) {
  const { overlayText, borderRadius = '0' } = props;
  return (
    <div
      className={styles.container}
      style={{
        borderRadius,
      }}
    >
      <div className={styles.content}>
        <CircularProgress size={'5rem'} sx={{ color: '#77469b' }} />
        <p className={styles.text}>
          {overlayText !== '' ? overlayText : 'Saving Data...'}
        </p>
      </div>
    </div>
  );
}

export default CustomEditLoader;
