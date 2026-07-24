import AltPrimaryButton from '@/app/components/common/alt-primary-button/alt-primary-button';
import Dropdown, {
  IDropdownItem,
} from '@/app/components/common/dropdown/dropdown';
import InfoIcon from '@/app/components/common/info-icon/info-icon';
import PrimaryIconButton from '@/app/components/common/primary-icon-button/primary-icon-button';
import { textboxNewStyles } from '@/app/components/pages/rules-page/rules-page-features/rules-page-agents/rules-page-form/rules-page-form-styles';
import { NAME_STRING_SPECIAL_CHARACTER_REGEX } from '@/constants/regex.constants';
import { RULES_TOOLTIPS } from '@/enums/tooltip-texts.enums';
import {
  IRuleCriteriaDetails,
  IRulesValidation,
} from '@/interfaces/rules/rules.interfaces';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  selectIsRuleArchived,
  selectIsRuleFormLoading,
  selectRuleCriteriaSetsMap,
  selectRulesValidation,
  setRuleCriteriaSetsMap,
  setRulesValidation,
} from '@/redux/slices/rules/rules.slice';
import {
  getCompressedConditionText,
  getCompressedCriteriaAction,
  getReOrderedCriteriaSetsWithDelete,
  getReOrderedCriteriaSetsWithDuplicate,
} from '@/utils/rules.utils';
import OutlinedInput from '@mui/material/OutlinedInput';
import {
  CaretDownIcon,
  CopySimpleIcon,
  PlusIcon,
  TrashIcon,
} from '@phosphor-icons/react';
import React, { useEffect, useMemo, useRef } from 'react';
import styles from '../rule-criteria-priority-card.module.scss';

interface IRuleCriteriaPriorityDetailsProps {
  currCriteria: IRuleCriteriaDetails;
  containerOpen: boolean;
  setContainerOpen: (containerOpen: boolean) => void;
  priorityOptions: Array<IDropdownItem<number>>;
  priorityValue: IDropdownItem<number>;
  handlePriorityChange: (value: IDropdownItem<number>) => void;
  handleCriteriaChange: (value: IRuleCriteriaDetails) => void;
  handleAddCondition: () => void;
}

export default function RuleCriteriaPriorityDetails({
  containerOpen,
  setContainerOpen,
  priorityOptions,
  priorityValue,
  handlePriorityChange,
  currCriteria,
  handleCriteriaChange,
  handleAddCondition,
}: IRuleCriteriaPriorityDetailsProps) {
  const handleContainerOpen = () => setContainerOpen(true);
  const handleContainerClose = () => setContainerOpen(false);

  const selectCriteriaSetsMap = useAppSelector(selectRuleCriteriaSetsMap);
  const dispatch = useAppDispatch();
  const isMount = useRef(false);
  const ruleValidations = useAppSelector(selectRulesValidation);
  const isRuleFormLoading = useAppSelector(selectIsRuleFormLoading);
  const isRuleArchived = useAppSelector(selectIsRuleArchived);

  const handlePriorityDropdown = (value: IDropdownItem<number>) => {
    handlePriorityChange(value);
  };

  const handleCriteriaNameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newVal = event.target.value;

    handleCriteriaChange({
      ...currCriteria,
      criteriaName: newVal,
    });
  };

  const handleCriteriaDuplicate = () => {
    if (selectCriteriaSetsMap === null) {
      dispatch(setRuleCriteriaSetsMap(selectCriteriaSetsMap));
      return;
    }

    dispatch(
      setRuleCriteriaSetsMap(
        getReOrderedCriteriaSetsWithDuplicate(
          selectCriteriaSetsMap,
          currCriteria.id
        )
      )
    );
  };

  const handleCriteriaDelete = () => {
    if (selectCriteriaSetsMap === null) {
      dispatch(setRuleCriteriaSetsMap(selectCriteriaSetsMap));
      return;
    }

    dispatch(
      setRuleCriteriaSetsMap(
        getReOrderedCriteriaSetsWithDelete(
          selectCriteriaSetsMap,
          currCriteria.id
        )
      )
    );
  };

  const isAddConditionDisabled = useMemo(
    () =>
      currCriteria.conditions.find(
        (item) =>
          item.value.absoluteValue === null ||
          isNaN(parseFloat(`${item.value.absoluteValue}`))
      )
        ? true
        : false,
    [currCriteria.conditions]
  );

  useEffect(() => {
    if (!isMount.current) {
      isMount.current = true;
      return;
    }

    if (isRuleFormLoading) return;

    const criteriaId = currCriteria.id;
    const criteriaName = currCriteria.criteriaName;

    const prevValidations = ruleValidations ?? {};
    const prevCriteriaNameErrors = prevValidations.criteriaName ?? {};
    const nextCriteriaNameErrors = { ...prevCriteriaNameErrors };

    let errorMsg: string | undefined;

    if (!criteriaName || !criteriaName.length) {
      errorMsg = 'Criteria Name is required.';
    } else if (criteriaName.length < 2) {
      errorMsg = 'Criteria Name must have at least 2 characters.';
    } else if (criteriaName.length > 255) {
      errorMsg = 'Criteria Name must be less than 255 characters.';
    } else if (!NAME_STRING_SPECIAL_CHARACTER_REGEX.test(criteriaName)) {
      errorMsg = `Only letters, numbers, single spaces, commas (,), ., -, _, &, :, (, ), /, %, #, ', + are allowed. Criteria Name must start with a letter or a number.`;
    }

    if (errorMsg) {
      nextCriteriaNameErrors[criteriaId] = errorMsg;
    } else {
      delete nextCriteriaNameErrors[criteriaId];
    }

    const nextValidations: IRulesValidation = {
      ...ruleValidations,
      criteriaName:
        Object.keys(nextCriteriaNameErrors).length > 0
          ? nextCriteriaNameErrors
          : undefined,
    };

    const hasAnyError = Object.values(nextValidations).some((val) => {
      if (typeof val === 'string') return true;
      if (typeof val === 'object' && val !== null)
        return Object.keys(val).length > 0;
      return false;
    });

    dispatch(setRulesValidation(hasAnyError ? nextValidations : null));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currCriteria.criteriaName, dispatch]);

  return (
    <div className={styles.criteriaInfoContainer}>
      <div className={styles.priorityCountContainer}>
        <div>
          <Dropdown
            options={priorityOptions}
            selected={priorityValue}
            onSelect={handlePriorityDropdown}
            width="7rem"
            height="3.2rem"
            dropShadow={false}
            isNewDesign={true}
            fontSize="1.6rem"
            fontWeight={700}
            disabled={isRuleArchived}
          />
          {containerOpen === true && (
            <p className={styles.prioritySubText} style={{ marginTop: '5px' }}>
              Priority {priorityValue.value}/{priorityOptions.length}
            </p>
          )}
        </div>

        {containerOpen === true ? (
          <div className={styles.criteriaName}>
            <OutlinedInput
              type="text"
              onChange={handleCriteriaNameChange}
              value={currCriteria.criteriaName}
              placeholder="Enter Criteria Name"
              sx={{
                ...textboxNewStyles,
                height: '3.2rem',
                display: 'flex',
              }}
              error={
                isRuleArchived === false &&
                ruleValidations !== null &&
                ruleValidations?.criteriaName !== undefined &&
                Boolean(ruleValidations?.criteriaName[currCriteria.id]) === true
              }
              disabled={isRuleArchived}
            />
            {isRuleArchived === false &&
              ruleValidations !== null &&
              ruleValidations?.criteriaName !== undefined &&
              Boolean(ruleValidations?.criteriaName[currCriteria.id]) ===
                true && (
                <p className={styles.error}>
                  {ruleValidations?.criteriaName[currCriteria.id] ?? ''}
                </p>
              )}
          </div>
        ) : (
          <div className={styles.collapsedNameContainer}>
            <p className={styles.collapsedName}>
              {currCriteria.criteriaName}{' '}
              <InfoIcon
                title={`${currCriteria.criteriaName}`}
                customIconStyles={{ marginTop: '2px' }}
              />
            </p>
            <div className={styles.criteriaCompressedContainer}>
              <p className={styles.compressedConditions}>
                {Boolean(
                  getCompressedConditionText(currCriteria?.conditions ?? [])
                ) === true && (
                  <React.Fragment>
                    <span className={styles.compressedTitle}>WHEN</span>{' '}
                    {getCompressedConditionText(currCriteria?.conditions ?? [])}
                  </React.Fragment>
                )}
              </p>

              <p className={styles.compressedAction}>
                {Boolean(getCompressedCriteriaAction(currCriteria?.action)) ===
                  true && (
                  <React.Fragment>
                    <span className={styles.compressedTitle}>THEN</span>{' '}
                    {getCompressedCriteriaAction(currCriteria?.action)}
                  </React.Fragment>
                )}
              </p>
            </div>
          </div>
        )}
      </div>

      <div className={styles.criteriaActions}>
        {containerOpen === true ? (
          <AltPrimaryButton
            buttonText="Duplicate Criteria"
            buttonFunction={handleCriteriaDuplicate}
            disabled={isRuleArchived}
            isHoverTooltipEnabled={isRuleArchived}
            tooltipText={RULES_TOOLTIPS.ARCHIVED}
            width="13rem"
            height="3.2rem"
            isNewDesign={true}
            isButtonIconRequired={true}
            buttonIcon={<CopySimpleIcon size={'1.5rem'} color="#464646" />}
          />
        ) : (
          <PrimaryIconButton
            width="3.2rem"
            height="3.2rem"
            buttonFunction={handleCriteriaDuplicate}
            disabled={isRuleArchived}
            isHoverTooltipEnabled={isRuleArchived}
            tooltipText={RULES_TOOLTIPS.ARCHIVED}
            buttonIcon={<CopySimpleIcon size={'1.5rem'} color="#464646" />}
            IsNewDesign={true}
          />
        )}

        {containerOpen === true ? (
          <AltPrimaryButton
            buttonText="Delete Criteria"
            buttonFunction={handleCriteriaDelete}
            disabled={priorityOptions.length <= 1 || isRuleArchived}
            isHoverTooltipEnabled={isRuleArchived}
            tooltipText={RULES_TOOLTIPS.ARCHIVED}
            width="12rem"
            height="3.2rem"
            isNewDesign={true}
            isButtonIconRequired={true}
            buttonIcon={<TrashIcon size={'1.5rem'} color="#464646" />}
          />
        ) : (
          <PrimaryIconButton
            width="3.2rem"
            height="3.2rem"
            buttonFunction={handleCriteriaDelete}
            disabled={priorityOptions.length <= 1 || isRuleArchived}
            isHoverTooltipEnabled={isRuleArchived}
            tooltipText={RULES_TOOLTIPS.ARCHIVED}
            buttonIcon={<TrashIcon size={'1.5rem'} color="#464646" />}
            IsNewDesign={true}
          />
        )}

        {containerOpen === true ? (
          <AltPrimaryButton
            buttonText="Add Condition"
            buttonFunction={handleAddCondition}
            disabled={isAddConditionDisabled || isRuleArchived}
            isHoverTooltipEnabled={isRuleArchived}
            tooltipText={RULES_TOOLTIPS.ARCHIVED}
            width="12rem"
            height="3.2rem"
            isNewDesign={true}
            isButtonIconRequired={true}
            buttonIcon={<PlusIcon size={'1.5rem'} color="#464646" />}
          />
        ) : (
          <PrimaryIconButton
            width="3.2rem"
            height="3.2rem"
            buttonFunction={handleAddCondition}
            disabled={isAddConditionDisabled || isRuleArchived}
            isHoverTooltipEnabled={isRuleArchived}
            tooltipText={RULES_TOOLTIPS.ARCHIVED}
            buttonIcon={<PlusIcon size={'1.5rem'} color="#464646" />}
            IsNewDesign={true}
          />
        )}

        <CaretDownIcon
          className={`${styles.icon} ${containerOpen ? styles.expanded : ''}`}
          size={'1.7rem'}
          color="#464646"
          weight="bold"
          onClick={containerOpen ? handleContainerClose : handleContainerOpen}
        />
      </div>
    </div>
  );
}
