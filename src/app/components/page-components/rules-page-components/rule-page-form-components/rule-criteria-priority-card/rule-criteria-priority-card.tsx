import { IDropdownItem } from '@/app/components/common/dropdown/dropdown';
import InfoIcon from '@/app/components/common/info-icon/info-icon';
import { RuleTypeEnum } from '@/enums/rules.enum';
import { RULES_TOOLTIPS, TooltipPlacement } from '@/enums/tooltip-texts.enums';
import useContainerCollapseAnimation from '@/hooks/use-container-collapse-animation';
import {
  IRuleCondition,
  IRuleConstraints,
  IRuleConstraintsDropdownOptions,
  IRuleCriteriaDetails,
} from '@/interfaces/rules/rules.interfaces';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  selectRuleCriteriaSetsMap,
  selectSelectedRuleType,
  setRuleCriteriaSetsMap,
} from '@/redux/slices/rules/rules.slice';
import { getSelectedFilterFromValue } from '@/utils';
import {
  findDuplicateConditionIds,
  getNewCondition,
  updateCriteriaOrder,
} from '@/utils/rules.utils';
import React, { useEffect, useState } from 'react';
import RuleCriteriaConditionCard from '../rule-criteria-condition-card/rule-criteria-condition-card';
import RuleCriteriaAction from './rule-criteria-priority-card-components/rule-criteria-action';
import RuleCriteriaAdjustmentWrapper from './rule-criteria-priority-card-components/rule-criteria-adjustment/rule-criteria-adjustment-wrapper';
import RuleCriteriaPriorityDetails from './rule-criteria-priority-card-components/rule-criteria-priority-details';
import RuleCriteriaPriorityCardDuplicate from './rule-criteria-priority-card-duplicate/rule-criteria-priority-card-duplicate';
import styles from './rule-criteria-priority-card.module.scss';

interface IRuleCriteriaPriorityCardProps {
  currCriteria: IRuleCriteriaDetails;
  priorityOptions: Array<IDropdownItem<number>>;
  constraints: IRuleConstraints;
  constraintsOptions: IRuleConstraintsDropdownOptions;
  isDuplicate: boolean;
}

export default function RuleCriteriaPriorityCard({
  currCriteria,
  priorityOptions,
  constraints,
  constraintsOptions,
  isDuplicate,
}: IRuleCriteriaPriorityCardProps) {
  const [selectedPriority, setSelectedPriority] = useState<
    IDropdownItem<number>
  >(priorityOptions[0]);
  const [containerOpen, setContainerOpen] = useState<boolean>(true);
  const [duplicateConditionIds, setDuplicateConditionIds] = useState<
    Array<string>
  >([]);

  const criteriaSetsMap = useAppSelector(selectRuleCriteriaSetsMap);
  const selectedRuleType = useAppSelector(selectSelectedRuleType);
  const dispatch = useAppDispatch();

  const { containerRef, containerCollapseAnimationStyles } =
    useContainerCollapseAnimation(containerOpen, currCriteria);

  useEffect(() => {
    setSelectedPriority(
      getSelectedFilterFromValue(
        priorityOptions,
        currCriteria.criteriaOrder,
        priorityOptions[0]
      )
    );
  }, [priorityOptions, currCriteria.criteriaOrder]);

  useEffect(() => {
    setDuplicateConditionIds(
      findDuplicateConditionIds(currCriteria.conditions)
    );
  }, [currCriteria.conditions]);

  const handlePriorityChange = (value: IDropdownItem<number>) => {
    setSelectedPriority(value);

    if (
      !currCriteria.id ||
      criteriaSetsMap === null ||
      !criteriaSetsMap.has(currCriteria.id)
    ) {
      dispatch(setRuleCriteriaSetsMap(criteriaSetsMap));
      return;
    }

    dispatch(
      setRuleCriteriaSetsMap(
        updateCriteriaOrder(criteriaSetsMap, currCriteria.id, value.value)
      )
    );
  };

  const handleCriteriaChange = (value: IRuleCriteriaDetails) => {
    if (!value || criteriaSetsMap === null) {
      dispatch(setRuleCriteriaSetsMap(criteriaSetsMap));
      return;
    }

    const next = new Map(criteriaSetsMap);
    next.set(currCriteria.id, value);
    dispatch(setRuleCriteriaSetsMap(next));
  };

  const handleConditionChange = (
    conditionId: string,
    value: IRuleCondition
  ) => {
    const conditions = currCriteria.conditions.map((item) => {
      if (item.id === conditionId) {
        return value;
      }
      return item;
    });

    handleCriteriaChange({
      ...currCriteria,
      conditions,
    });
  };

  const handleDeleteCondition = (conditionId: string) => {
    const conditions = currCriteria.conditions.filter(
      (item) => item.id !== conditionId
    );

    handleCriteriaChange({
      ...currCriteria,
      conditions,
    });
    setDuplicateConditionIds((prev) => prev.filter((id) => id !== conditionId));
  };

  const handleAddCondition = () => {
    const newCondition: IRuleCondition = getNewCondition(
      constraints,
      selectedRuleType
    );

    handleCriteriaChange({
      ...currCriteria,
      conditions: [...currCriteria.conditions, newCondition],
    });
  };

  return (
    <div
      className={styles.criteriaContainer}
      style={{ gap: containerOpen ? '1rem' : 0 }}
    >
      {isDuplicate === true && (
        <RuleCriteriaPriorityCardDuplicate isCriteria={true} />
      )}

      <RuleCriteriaPriorityDetails
        currCriteria={currCriteria}
        containerOpen={containerOpen}
        setContainerOpen={setContainerOpen}
        priorityOptions={priorityOptions}
        priorityValue={selectedPriority}
        handlePriorityChange={handlePriorityChange}
        handleCriteriaChange={handleCriteriaChange}
        handleAddCondition={handleAddCondition}
      />

      {containerOpen === true && (
        <React.Fragment>
          <div className={styles.criteriaSeparator} />
          <div
            className={styles.criteriaDetailsContainer}
            ref={containerRef}
            style={containerCollapseAnimationStyles}
          >
            {selectedRuleType !== RuleTypeEnum.KEYWORD_HARVESTING_RULE && (
              <React.Fragment>
                {selectedRuleType === RuleTypeEnum.PLACEMENT_RULE ||
                selectedRuleType === RuleTypeEnum.PLATFORM_RULE ||
                selectedRuleType === RuleTypeEnum.PAGE_TYPE_RULE ? (
                  <RuleCriteriaAdjustmentWrapper
                    currCriteria={currCriteria}
                    handleCriteriaChange={handleCriteriaChange}
                    constraints={constraints}
                    constraintsOptions={constraintsOptions}
                  />
                ) : (
                  <RuleCriteriaAction
                    currCriteria={currCriteria}
                    handleCriteriaChange={handleCriteriaChange}
                    constraintsOptions={constraintsOptions}
                  />
                )}

                <div className={styles.criteriaSeparator} />
              </React.Fragment>
            )}

            <div className={styles.conditionContainer}>
              <p className={styles.cardTitle}>
                Conditions{' '}
                <InfoIcon
                  title={RULES_TOOLTIPS.CONDITION}
                  position={TooltipPlacement.Right}
                />
              </p>

              {currCriteria.conditions.length > 0 &&
                currCriteria.conditions.map((condition, idx) => (
                  <RuleCriteriaConditionCard
                    key={condition.id}
                    condition={condition}
                    handleConditionChange={handleConditionChange}
                    handleDeleteCondition={handleDeleteCondition}
                    constraints={constraints}
                    constraintsOptions={constraintsOptions}
                    isDuplicate={duplicateConditionIds.includes(condition.id)}
                    conditionsCount={currCriteria.conditions.length}
                    conditionIndex={idx}
                  />
                ))}
            </div>
          </div>
        </React.Fragment>
      )}
    </div>
  );
}
