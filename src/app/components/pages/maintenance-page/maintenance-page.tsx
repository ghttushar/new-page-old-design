import ConstructionIcon from '@mui/icons-material/Construction';
import { Box, Container, Typography } from '@mui/material';
import React from 'react';
import styles from './maintenance-page.module.scss';

const MaintenancePage: React.FC = () => {
  return (
    <Box className={styles.maintenanceContainer}>
      <Container maxWidth="sm" className={styles.contentWrapper}>
        <Box className={styles.iconWrapper}>
          <ConstructionIcon className={styles.maintenanceIcon} />
        </Box>

        <Typography variant="h1" className={styles.mainTitle}>
          We'll Be Back Soon
        </Typography>

        <Typography variant="body1" className={styles.description}>
          We're currently performing scheduled maintenance to improve your
          experience. Thank you for your patience.
        </Typography>

        <Box className={styles.statusIndicator}>
          <Box className={styles.pulsingDot} />
          <Typography variant="caption" className={styles.statusText}>
            Maintenance in progress
          </Typography>
        </Box>

        <Typography variant="body2" className={styles.supportText}>
          Need help?{' '}
          <a href="mailto:tech@anarix.io" className={styles.supportLink}>
            Contact support
          </a>
        </Typography>
      </Container>
    </Box>
  );
};

export default MaintenancePage;
