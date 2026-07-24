import { RuleStatusEnum } from '@/enums/rules.enum';
import { checkRuleIsDraftedOrEnded } from '@/utils/rules.utils';
import { PauseCircleIcon } from '@phosphor-icons/react';
import React, { useMemo, useState } from 'react';
import { useAppSelector } from 'src/redux/hooks';
import { selectSelectedRowIds } from 'src/redux/slices/advertising/advertising-edit-access.slice';
import { selectAppliedRulesById } from 'src/redux/slices/rules/rules.slice';
import TextButton from '../../text-button/text-button';
import RulesBulkActionConfirmation from '../bulk-action-confirmation/rules-bulk-action-confirmation';

export default function RulesPauseAction() {
  const selectedRowIds = useAppSelector(selectSelectedRowIds);
  const appliedRulesById = useAppSelector(selectAppliedRulesById);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState<boolean>(false);

  const hasDraftOrEndedRuleSelected: boolean = useMemo(
    () => checkRuleIsDraftedOrEnded(selectedRowIds, appliedRulesById),
    [selectedRowIds, appliedRulesById]
  );

  const handlePauseClick = () => {
    setIsConfirmationOpen(true);
  };

  const handleConfirmationClose = () => {
    setIsConfirmationOpen(false);
  };

  return (
    <React.Fragment>
      <TextButton
        label="Pause"
        handleClick={handlePauseClick}
        isVisible={true}
        buttonStartIcon={
          <PauseCircleIcon size={16} color="#77469B" weight="bold" />
        }
        customStyles={{ fontSize: '1rem' }}
        isDisabled={!selectedRowIds.length || hasDraftOrEndedRuleSelected}
        disableReason={
          !selectedRowIds.length
            ? 'No row selected'
            : hasDraftOrEndedRuleSelected
            ? 'Status cannot be changed for Draft or Ended rules.'
            : ''
        }
        isNewDesign={true}
      />

      <RulesBulkActionConfirmation
        isOpen={isConfirmationOpen}
        onClose={handleConfirmationClose}
        ruleIds={selectedRowIds as string[]}
        status={RuleStatusEnum.PAUSED}
        title="Pause Rules?"
        description="Are you sure you want to pause the selected rule(s)?"
      />
    </React.Fragment>
  );
}
