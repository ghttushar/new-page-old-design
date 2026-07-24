import styles from '@/app/components/page-components/rules-page-components/applied-rules-components/applied-rules-actions-wrapper/applied-rules-actions-wrapper.module.scss';
import { RuleStatusEnum } from '@/enums/rules.enum';
import { ArchiveIcon } from '@phosphor-icons/react';
import React, { useMemo, useState } from 'react';
import { useAppSelector } from 'src/redux/hooks';
import { selectSelectedRowIds } from 'src/redux/slices/advertising/advertising-edit-access.slice';
import { selectAppliedRulesById } from 'src/redux/slices/rules/rules.slice';
import TextButton from '../../text-button/text-button';
import RulesBulkActionConfirmation from '../bulk-action-confirmation/rules-bulk-action-confirmation';

export default function RulesArchiveAction() {
  const selectedRowIds = useAppSelector(selectSelectedRowIds);
  const appliedRulesById = useAppSelector(selectAppliedRulesById);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState<boolean>(false);

  const eligibleRuleIds: string[] = useMemo(
    () =>
      selectedRowIds.filter((ruleId) => {
        const rule = appliedRulesById?.[ruleId as string];

        return rule?.status !== RuleStatusEnum.ARCHIVED;
      }) as string[],
    [selectedRowIds, appliedRulesById]
  );

  const handleArchiveClick = () => {
    setIsConfirmationOpen(true);
  };

  const handleConfirmationClose = () => {
    setIsConfirmationOpen(false);
  };

  return (
    <React.Fragment>
      <TextButton
        label="Archive"
        handleClick={handleArchiveClick}
        isVisible={true}
        buttonStartIcon={
          <ArchiveIcon size={16} color="#77469B" weight="bold" />
        }
        customStyles={{ fontSize: '1rem' }}
        isDisabled={!eligibleRuleIds.length}
        disableReason="No row selected"
        isNewDesign={true}
      />

      <RulesBulkActionConfirmation
        isOpen={isConfirmationOpen}
        onClose={handleConfirmationClose}
        ruleIds={eligibleRuleIds}
        status={RuleStatusEnum.ARCHIVED}
        title="Archive Rules?"
        description={
          <p className={styles.popupDescription}>
            Archived rules cannot be edited, restored, or reactivated. This
            action is permanent.
            <br />
            Are you sure you want to archive{' '}
            <span className={styles.ruleName}>
              {eligibleRuleIds.length}
            </span>{' '}
            selected rule(s)?
          </p>
        }
      />
    </React.Fragment>
  );
}
