import {
  selectAppliedProductActionFilters,
  selectProductActionFilters,
} from '@/redux/slices/keyword-action/amazon/product-action.slice';
import {
  selectAppliedProductNegationFilters,
  selectProductNegationFilters,
} from '@/redux/slices/keyword-action/amazon/product-negation.slice';
import { checkIsEqual } from '@/utils/advertising.utils';
import { useMemo } from 'react';
import {
  KeywordActionActionType,
  KeywordActionTabsEnum,
} from 'src/enums/keyword-action.enums';
import { useAppSelector } from 'src/redux/hooks';
import {
  IKeywordActionFilterOptions,
  IOpportunitiesFilterForm,
  selectAppliedKeywordNegationFilters,
  selectKeywordNegationFilters,
} from 'src/redux/slices/keyword-action/amazon/keyword-action-negation.slice';
import {
  selectAppliedKeywordActionFilters,
  selectKeywordActionFilters,
} from 'src/redux/slices/keyword-action/amazon/keyword-action.slice';
import keywordActionsUtils from 'src/utils/keyword-actions.utils';
import Dropdown, { IDropdownItem } from '../dropdown/dropdown';
import PrimaryButton from '../primary-button/primary-button';
import styles from './filter.module.scss';

interface KeywordActionFilter {
  options: IKeywordActionFilterOptions;
  filters: IOpportunitiesFilterForm;
  setFilters: (filters: IOpportunitiesFilterForm) => void;
  handleRefetchClick: () => void;
  selectedTab: KeywordActionTabsEnum;
}
export const KeywordActionFilter: React.FC<KeywordActionFilter> = ({
  options,
  filters,
  setFilters,
  handleRefetchClick,
  selectedTab,
}) => {
  const keywordAdditionAppliedFilters = useAppSelector(
    selectAppliedKeywordActionFilters
  );
  const keywordNegationAppliedFilters = useAppSelector(
    selectAppliedKeywordNegationFilters
  );
  const productAdditionAppliedFilters = useAppSelector(
    selectAppliedProductActionFilters
  );
  const productNegationAppliedFilters = useAppSelector(
    selectAppliedProductNegationFilters
  );

  const currKeywordAdditionFilters = useAppSelector(selectKeywordActionFilters);
  const currKeywordNegationFilters = useAppSelector(
    selectKeywordNegationFilters
  );
  const currProductNegationFilters = useAppSelector(
    selectProductNegationFilters
  );
  const currProductAdditionFilters = useAppSelector(selectProductActionFilters);

  const handleGetRecommendation = () => {
    handleRefetchClick();
  };

  const handleActionTypeChange = (
    actionType: IDropdownItem<KeywordActionActionType>
  ) => {
    setFilters({ ...filters, actionType });
    if (
      actionType.value === KeywordActionActionType.MANUAL_TO_MANUAL ||
      actionType.value === KeywordActionActionType.PCT_TO_PCT
    ) {
      setFilters({
        ...filters,
        actionType: actionType,
        priority: options.priority[0],
      });
    }
  };

  const isDisabled = useMemo(
    () =>
      checkIsEqual(keywordAdditionAppliedFilters, currKeywordAdditionFilters) &&
      checkIsEqual(keywordNegationAppliedFilters, currKeywordNegationFilters) &&
      checkIsEqual(productAdditionAppliedFilters, currProductAdditionFilters) &&
      checkIsEqual(productNegationAppliedFilters, currProductNegationFilters),

    [
      currKeywordAdditionFilters,
      currKeywordNegationFilters,
      currProductAdditionFilters,
      currProductNegationFilters,
      keywordAdditionAppliedFilters,
      keywordNegationAppliedFilters,
      productAdditionAppliedFilters,
      productNegationAppliedFilters,
    ]
  );

  const btnTitleMap = new Map()
    .set(KeywordActionTabsEnum.KEYWORD_ADDITION_AMAZON, 'Fetch Keywords')
    .set(KeywordActionTabsEnum.KEYWORD_NEGATION_AMAZON, 'Fetch Keywords')
    .set(KeywordActionTabsEnum.PRODUCT_NEGATION_AMAZON, 'Fetch Products')
    .set(KeywordActionTabsEnum.PRODUCT_ADDITION_AMAZON, 'Fetch Products');

  return (
    <div className={styles.filterContainerWrapper}>
      <div className={styles.filterContainer}>
        <div className={styles.filterContents}>
          <Dropdown
            options={options.actionType}
            selected={filters.actionType}
            label={'Action Type'}
            onSelect={handleActionTypeChange}
            width="17rem"
            variant="unset"
          />
          <Dropdown
            options={options.dateRange}
            selected={filters.dateRange}
            label={'Date Range'}
            onSelect={(dateRange) => setFilters({ ...filters, dateRange })}
            width="17rem"
            variant="unset"
          />
          <Dropdown
            options={keywordActionsUtils.updatePriorityOptions(
              options.priority,
              filters.actionType
            )}
            selected={filters.priority}
            label={'Priority'}
            onSelect={(priority) => setFilters({ ...filters, priority })}
            width="17rem"
            variant="unset"
            isOptionsRequireTooltip={true}
            disabled={
              selectedTab === KeywordActionTabsEnum.KEYWORD_NEGATION_AMAZON ||
              selectedTab === KeywordActionTabsEnum.PRODUCT_NEGATION_AMAZON ||
              filters.actionType.value ===
                KeywordActionActionType.MANUAL_TO_MANUAL ||
              filters.actionType.value === KeywordActionActionType.PCT_TO_PCT
            }
          />
        </div>
      </div>
      <div>
        <PrimaryButton
          buttonText={btnTitleMap.get(selectedTab)}
          buttonFunction={handleGetRecommendation}
          disabled={isDisabled}
          width="16rem"
          height="3.5rem"
        ></PrimaryButton>
      </div>
    </div>
  );
};
