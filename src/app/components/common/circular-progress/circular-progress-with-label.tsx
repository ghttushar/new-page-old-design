import { getWholeNumber } from '@/utils';
import { Box, CircularProgress, Typography } from '@mui/material';
import styles from './custom-circular-progress.module.scss';
interface CustomCircularProgressProps {
  value: number;
}

const CustomCircularProgress = ({ value = 0 }: CustomCircularProgressProps) => {
  return (
    <Box className={styles.container}>
      <Box className={styles.root}>
        <CircularProgress
          variant="determinate"
          classes={{
            circle: styles.circle,
          }}
          value={100}
          size={'15rem'}
          thickness={4}
          sx={{
            color: '#f5f6f7',
            position: 'absolute',
          }}
        />
        <CircularProgress
          className={styles.top}
          classes={{
            circle: styles.circle,
          }}
          variant="determinate"
          size={'15rem'}
          thickness={4}
          value={value}
          style={{
            transform: 'rotate(-90deg)',
            color: '#59bf82',
            borderRadius: '50%',
            boxShadow: '0rem 0.1rem 0.4rem 0rem rgba(0,0,0,0.2)',
          }}
        />
        <Typography className={styles.text}>
          {getWholeNumber(value >= 100 ? 100 : value)}%
        </Typography>
      </Box>
    </Box>
  );
};

export default CustomCircularProgress;
