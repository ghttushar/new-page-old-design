import { WarningCircleIcon } from '@phosphor-icons/react';
import styles from './bulk-upload-warning-banner.module.scss';

export default function BulkUploadWarningBanner() {
  return (
    <div className={styles.banner}>
      <WarningCircleIcon size={20} className={styles.bannerIcon} />
      <div className={styles.bannerContent}>
        <span className={styles.bannerTitle}>
          Bulk Edits Over 100 Rows Are Processed Separately
        </span>
        <span className={styles.bannerText}>
          Edits to more than 100 rows won't update instantly. You'll receive an
          email once the update is complete.
        </span>
      </div>
    </div>
  );
}
