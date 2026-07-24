import AltPrimaryButton from '@/app/components/common/alt-primary-button/alt-primary-button';
import { IDropdownItem } from '@/app/components/common/dropdown/dropdown';
import InfoIcon from '@/app/components/common/info-icon/info-icon';
import RuleCriteriaInfo from '@/app/components/page-components/rules-page-components/rule-page-form-components/rule-criteria-info/rule-criteria-info';
import RuleCriteriaPriorityCard from '@/app/components/page-components/rules-page-components/rule-page-form-components/rule-criteria-priority-card/rule-criteria-priority-card';
import { MarketplaceEnum } from '@/enums/serp.enums';
import { RULES_TOOLTIPS, TooltipPlacement } from '@/enums/tooltip-texts.enums';
import {
  IRuleConstraints,
  IRuleConstraintsDropdownOptions,
} from '@/interfaces/rules/rules.interfaces';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { selectAdvertisingAccount } from '@/redux/slices/auth/auth.slice';
import {
  selectIsRuleArchived,
  selectRuleCriteriaSetsMap,
  selectSelectedRuleType,
  setRuleCriteriaSetsMap,
} from '@/redux/slices/rules/rules.slice';
import {
  findDuplicateCriteriaIds,
  getNewCriteria,
  getPriorityOptions,
} from '@/utils/rules.utils';
import { PlusIcon } from '@phosphor-icons/react';
import React, { useEffect, useMemo, useState } from 'react';
import styles from './rules-page-form-criteria.module.scss';

interface IRulesPageFormCriteriaProps {
  constraints: IRuleConstraints;
  constraintsOptions: IRuleConstraintsDropdownOptions;
}

export default function RulesPageFormCriteria({
  constraints,
  constraintsOptions,
}: IRulesPageFormCriteriaProps) {
  const [priorityOptions, setPriorityOptions] = useState<
    Array<IDropdownItem<number>>
  >([]);
  const [duplicateCriteriaIds, setDuplicateCriteriaIds] = useState<
    Array<string>
  >([]);

  const selectedCriteriaSetsMap = useAppSelector(selectRuleCriteriaSetsMap);
  const selectedRuleType = useAppSelector(selectSelectedRuleType);
  const isRuleArchived = useAppSelector(selectIsRuleArchived);
  const selectedAdvertisingAccount = useAppSelector(selectAdvertisingAccount);
  const dispatch = useAppDispatch();

  const marketplace = useMemo(
    () => selectedAdvertisingAccount.marketplace ?? MarketplaceEnum.AMAZON,
    [selectedAdvertisingAccount.marketplace]
  );

  const handleAddCriteriaClick = () => {
    dispatch(
      setRuleCriteriaSetsMap(
        getNewCriteria(
          selectedCriteriaSetsMap,
          [],
          selectedRuleType,
          marketplace
        )
      )
    );
  };

  useEffect(() => {
    if (selectedCriteriaSetsMap !== null) {
      setPriorityOptions(
        getPriorityOptions(Array.from(selectedCriteriaSetsMap.values()))
      );

      setDuplicateCriteriaIds(
        findDuplicateCriteriaIds(selectedCriteriaSetsMap)
      );
    }
  }, [selectedCriteriaSetsMap]);

  return (
    <div className={styles.criteriaInformation}>
      <p className={styles.infoContainerTitle}>
        Criteria Information
        <InfoIcon
          title={RULES_TOOLTIPS.CRITERIA}
          customIconStyles={{ width: '1.1rem', height: '1.1rem' }}
          position={TooltipPlacement.Right}
        />{' '}
      </p>

      <div className={styles.optionsAction}>
        {selectedCriteriaSetsMap !== null && priorityOptions.length > 0 ? (
          <React.Fragment>
            <RuleCriteriaInfo
              title='How to use "Criteria Card" ?'
              description='This rule has been applied for the following products under the campaign "XYZ". Add/Remove products to edit the list by clicking on the section below.'
            />

            {Array.from(selectedCriteriaSetsMap.values()).map((criteria) => (
              <RuleCriteriaPriorityCard
                key={criteria.id}
                isDuplicate={duplicateCriteriaIds.includes(criteria.id)}
                currCriteria={criteria}
                priorityOptions={priorityOptions}
                constraints={constraints}
                constraintsOptions={constraintsOptions}
              />
            ))}
          </React.Fragment>
        ) : (
          <div className={styles.noCriteriaContainer}>
            <p className={styles.noCriteriaHeader}>
              “Start building your rule by adding a criteria.”
            </p>
            <p className={styles.noCriteriaText}>
              You can add multiple criteria and conditions once add the first
              criteria card below.
            </p>
          </div>
        )}

        <div className={styles.addCriteriaContainer}>
          <div className={styles.addCriteriaButton}>
            <AltPrimaryButton
              buttonText="Add Criteria"
              buttonFunction={handleAddCriteriaClick}
              disabled={isRuleArchived}
              isHoverTooltipEnabled={isRuleArchived}
              tooltipText={RULES_TOOLTIPS.ARCHIVED}
              width="13rem"
              height="3.2rem"
              isNewDesign={true}
              isButtonIconRequired={true}
              buttonIcon={<PlusIcon size={'1.5rem'} color="#464646" />}
            />
            <InfoIcon
              title="Until you add atleast one condition to a criteria card, this “Add Criteria” button will be disabled."
              position={TooltipPlacement.Right}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
