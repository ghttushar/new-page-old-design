import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import styles from './custom-loading-overlay.module.scss';

interface ICustomLoadingOverlay {
  height?: string;
}

export default function CustomLoadingOverlay({
  height,
}: ICustomLoadingOverlay) {
  return (
    <div
      className={styles.loadingContainer}
      style={{ height: height ? height : '100%' }}
    >
      <CircularProgress sx={{ color: '#77469b' }} />
      <Typography
        variant="body1"
        fontSize="1.2rem"
        fontWeight={600}
        color="#666666"
      >
        Please wait while data is being fetched
      </Typography>
    </div>
  );
}
