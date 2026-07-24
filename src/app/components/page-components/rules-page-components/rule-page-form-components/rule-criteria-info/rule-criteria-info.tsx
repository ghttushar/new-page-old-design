import { InfoIcon } from '@phosphor-icons/react';
import React from 'react';
import styles from './rule-criteria-info.module.scss';

interface IRuleCriteriaInfoProps {
  title: string;
  description: string | React.ReactNode;
  inline?: boolean;
}

export default function RuleCriteriaInfo({
  title,
  description,
  inline = false,
}: IRuleCriteriaInfoProps) {
  return (
    <div className={`${styles.criteriaInfo} ${inline ? styles.inline : ''}`}>
      <div className={styles.infoTitleContainer}>
        <InfoIcon
          className={styles.infoTitleIcon}
          size={'1.3rem'}
          color="#3874FF"
          weight="fill"
        />
        <p className={styles.infoTitle}>{title}</p>
      </div>
      <p className={styles.infoDesc}>{description}</p>
    </div>
  );
}
