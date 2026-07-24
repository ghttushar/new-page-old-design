import Typography from '@mui/material/Typography';
import styles from './impact-analysis-subheader.module.scss';

export default function ImpactAnalysisSubheader() {
  return (
    <div className={styles.subHeaderContainer}>
      <div className={styles.subHeaderHeadings}>
        <Typography fontSize={24} fontWeight={600} letterSpacing="-0.72px">
          Impact Analysis
        </Typography>
        <Typography fontSize={14} fontWeight={400} letterSpacing="-0.42px">
          You can compare the two date ranges on the same campaign, and how it
          performs and also see the recommendations based on the performance.
        </Typography>
      </div>
    </div>
  );
}
