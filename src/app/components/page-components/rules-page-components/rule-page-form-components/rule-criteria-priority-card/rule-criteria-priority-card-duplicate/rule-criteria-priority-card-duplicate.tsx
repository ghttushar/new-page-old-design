import { WarningIcon } from '@phosphor-icons/react';
import styles from './rule-criteria-priority-card-duplicate.module.scss';

interface IRuleCriteriaPriorityCardDuplicateProps {
  isCriteria: boolean;
}

export default function RuleCriteriaPriorityCardDuplicate({
  isCriteria,
}: IRuleCriteriaPriorityCardDuplicateProps) {
  return (
    <div
      className={`${styles.duplicateWarningContainer} ${
        !isCriteria ? styles.marginBottom : ''
      }`}
    >
      <div className={styles.duplicateTitleContainer}>
        <WarningIcon
          className={styles.duplicateIcon}
          size={'1.4rem'}
          color="#ffaf38"
          weight="fill"
        />
        <p className={styles.duplicateTitle}>Warning disclaimer:</p>
      </div>

      <p className={styles.duplicateDescription}>
        This {isCriteria ? 'criteria' : 'condition'} is duplicated and may not
        have any additional effect.
      </p>
    </div>
  );
}
