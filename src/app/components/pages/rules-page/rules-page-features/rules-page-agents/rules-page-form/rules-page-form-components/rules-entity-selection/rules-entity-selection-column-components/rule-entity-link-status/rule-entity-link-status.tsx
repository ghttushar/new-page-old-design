import { RuleAutomationStatusEnum } from '@/enums/advertising.enums';
import { getTitleCaseString } from '@/utils';
import { useMemo } from 'react';
import styles from './rule-entity-link-status.module.scss';

interface IRuleEntityLinkStatusColumnProps {
  ruleEntityLinkStatus?: string | null;
}

export default function RuleEntityLinkStatusColumn({
  ruleEntityLinkStatus,
}: IRuleEntityLinkStatusColumnProps) {
  const formattedStatus = useMemo(() => {
    let final = '';

    if (!ruleEntityLinkStatus) final = RuleAutomationStatusEnum.ENABLED;
    else final = ruleEntityLinkStatus;

    return getTitleCaseString(final);
  }, [ruleEntityLinkStatus]);

  return (
    <p className={styles.statusText} title={formattedStatus}>
      {formattedStatus}
    </p>
  );
}
