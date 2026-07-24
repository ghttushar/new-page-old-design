import { checkIsEqual } from '@/utils/advertising.utils';
import { useMemo } from 'react';
import { KeywordActionActionType } from 'src/enums/keyword-action.enums';
import { IKeywordActionFilterForm } from 'src/interfaces/keyword-actions.interface';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import {
  selectWalmartAppliedKeywordActionFilters,
  selectWalmartKeywordActionFilters,
  selectWalmartKeywordActionOptions,
  setWalmartAppliedKeywordActionFilters,
  setWalmartKeywordActionFilters,
} from 'src/redux/slices/keyword-action/walmart/keyword-action.slice';
import keywordActionsUtils from 'src/utils/keyword-actions.utils';
import Dropdown, { IDropdownItem } from '../dropdown/dropdown';
import PrimaryButton from '../primary-button/primary-button';
import styles from './filter.module.scss';

export const KeywordActionWalmartFilter = () => {
  const walmartAdditionOptions = useAppSelector(
    selectWalmartKeywordActionOptions
  );
  const appliedWalmartActionFilters = useAppSelector(
    selectWalmartAppliedKeywordActionFilters
  );
  const currWalmartActionFilters = useAppSelector(
    selectWalmartKeywordActionFilters
  );

  const dispatch = useAppDispatch();

  const setFilters = (filters: IKeywordActionFilterForm) => {
    dispatch(setWalmartKeywordActionFilters(filters));
  };

  const handleActionTypeChange = (
    actionType: IDropdownItem<KeywordActionActionType>
  ) => {
    setFilters({ ...currWalmartActionFilters, actionType });
    if (actionType.value === KeywordActionActionType.MANUAL_TO_MANUAL) {
      setFilters({
        ...currWalmartActionFilters,
        actionType: actionType,
        priority: walmartAdditionOptions.priority[0],
      });
    }
  };

  const isDisabled = useMemo(
    () => checkIsEqual(currWalmartActionFilters, appliedWalmartActionFilters),
    [appliedWalmartActionFilters, currWalmartActionFilters]
  );

  const handleFetchKeywords = () => {
    dispatch(setWalmartAppliedKeywordActionFilters(currWalmartActionFilters));
  };

  return (
    <div className={styles.filterContainerWrapper}>
      <div className={styles.filterContainer}>
        <div className={styles.filterContents}>
          <Dropdown
            options={walmartAdditionOptions.actionType}
            selected={appliedWalmartActionFilters.actionType}
            label={'Action Type'}
            onSelect={handleActionTypeChange}
            width="17rem"
            variant="unset"
          />
          <Dropdown
            options={walmartAdditionOptions.dateRange}
            selected={appliedWalmartActionFilters.dateRange}
            label={'Date Range'}
            onSelect={(dateRange) =>
              setFilters({ ...currWalmartActionFilters, dateRange })
            }
            width="17rem"
            variant="unset"
          />
          <Dropdown
            options={keywordActionsUtils.updatePriorityOptions(
              walmartAdditionOptions.priority,
              appliedWalmartActionFilters.actionType
            )}
            selected={appliedWalmartActionFilters.priority}
            label={'Priority'}
            onSelect={(priority) =>
              setFilters({ ...currWalmartActionFilters, priority })
            }
            width="17rem"
            variant="unset"
            isOptionsRequireTooltip={true}
            disabled={
              currWalmartActionFilters.actionType.value ===
              KeywordActionActionType.MANUAL_TO_MANUAL
            }
          />
        </div>
      </div>
      <div>
        <PrimaryButton
          buttonText={'Fetch Keywords'}
          buttonFunction={handleFetchKeywords}
          disabled={isDisabled}
          width="18rem"
          height="4rem"
        />
      </div>
    </div>
  );
};
