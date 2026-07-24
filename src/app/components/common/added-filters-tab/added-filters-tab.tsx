import { getTitleCaseString } from '@/utils';
import { IconButton, Typography } from '@mui/material';
import { PencilIcon, XIcon } from '@phosphor-icons/react';
import { GlobalDataTestIds } from 'cypress/enums/global';
import React, { useEffect, useState } from 'react';
import { AdvertisingTitlesEnum } from 'src/enums/advertising.enums';
import { FilterOptions, Filters } from 'src/enums/filter.enums';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import {
  IFinalFilters,
  selectDynamicFilterValuesByFilterKey,
  setAppliedFilters,
  setClickedFilterId,
  setFilters,
  setShowFilterModal,
} from 'src/redux/slices/filters/filter.slice';
import { checkIsNull, clearAllFilter } from 'src/utils/advertising.utils';
import {
  isDisabledFilter,
  rowFilters,
  syncStoredLsFilters,
} from 'src/utils/row-filter.utils';
import AltPrimaryButton from '../alt-primary-button/alt-primary-button';
import styles from './added-filters-tab.module.scss';

interface IAddedFiltersTabProps {
  appliedFilters: IFinalFilters[];
  initialRows?: Record<string, unknown>[];
  setFilteredRows?: (data: Record<string, unknown>[]) => void;
  selectedAdvertisingNavTitle?: string;
  disableFilterConfig?: Filters[];
  isLoading: boolean;
  externalFilters?: IFinalFilters[];
  externalAppliedFilters?: IFinalFilters[];
  onFiltersChange?: (filters: IFinalFilters[]) => void;
  onAppliedFiltersChange?: (filters: IFinalFilters[]) => void;
  onShowFilterModal?: (show: boolean) => void;
  onSetClickedFilterId?: (id: string) => void;
  isCompact?: boolean;
  noFilterText?: string;
}
const AddedFiltersTab: React.FC<IAddedFiltersTabProps> = (props) => {
  const {
    appliedFilters,
    initialRows,
    setFilteredRows,
    selectedAdvertisingNavTitle,
    disableFilterConfig,
    isLoading,
    externalFilters,
    externalAppliedFilters,
    onFiltersChange,
    onAppliedFiltersChange,
    onShowFilterModal,
    onSetClickedFilterId,
    isCompact = false,
    noFilterText,
  } = props;
  const dispatch = useAppDispatch();

  const currentAppliedFilters = externalAppliedFilters ?? appliedFilters;
  const dynamicFilters = useAppSelector(selectDynamicFilterValuesByFilterKey);
  const [isFilterDisabled, setIsFilterDisabled] = useState(false);
  const removeFilter = (
    filter: IFinalFilters,
    isDisabled: boolean,
    index: number
  ) => {
    if (isDisabled) {
      handleFilterClick(index);
      return;
    }

    const isDefaultFilter = isDisabledFilter(
      filter.filterKey,
      disableFilterConfig
    );
    if (isDefaultFilter) return;

    const newFilters = currentAppliedFilters.filter(
      (appliedFilter) =>
        appliedFilter.filterKey !== filter.filterKey ||
        appliedFilter.filterType !== filter.filterType ||
        appliedFilter.filterValue !== filter.filterValue
    );

    if (onAppliedFiltersChange) {
      onAppliedFiltersChange(newFilters);
    } else {
      dispatch(setAppliedFilters(newFilters));
    }

    if (onFiltersChange) {
      onFiltersChange(newFilters);
    } else {
      dispatch(setFilters(newFilters));
    }

    if (externalFilters !== undefined) {
      onShowFilterModal?.(false);
      onSetClickedFilterId?.('');
    }

    syncStoredLsFilters(
      selectedAdvertisingNavTitle as AdvertisingTitlesEnum,
      newFilters
    );
    if (setFilteredRows) setFilteredRows(initialRows || []);
  };

  const handleFilterClick = (idx: number) => {
    if (externalFilters !== undefined) {
      onShowFilterModal?.(true);
      onSetClickedFilterId?.(String(idx));
    } else {
      dispatch(setShowFilterModal(true));
      dispatch(setClickedFilterId(String(idx)));
    }
  };

  const getEditOrRemoveIcon = (isDisabled: boolean) => {
    return isDisabled ? (
      <PencilIcon size={'1.2rem'} color="#77469B" weight="fill" />
    ) : (
      <XIcon size={'1rem'} weight="bold" color="#000" />
    );
  };

  const handleClearAppliedFilters = () => {
    if (onAppliedFiltersChange) {
      onAppliedFiltersChange([]);
      if (onFiltersChange) {
        onFiltersChange([]);
      }
      if (setFilteredRows) setFilteredRows(initialRows || []);
    } else {
      clearAllFilter(
        appliedFilters,
        selectedAdvertisingNavTitle as AdvertisingTitlesEnum,
        dispatch,
        disableFilterConfig,
        initialRows,
        setFilteredRows,
        isFilterDisabled
      );
    }
  };

  useEffect(() => {
    appliedFilters.every((filter) =>
      isDisabledFilter(filter.filterKey, disableFilterConfig)
    ) || isLoading === true
      ? setIsFilterDisabled(true)
      : setIsFilterDisabled(false);
  }, [appliedFilters, setIsFilterDisabled, disableFilterConfig, isLoading]);

  if (currentAppliedFilters.length === 0 && checkIsNull(noFilterText)) {
    return null;
  }

  return (
    <div
      className={`${styles.addedFiltersTab} ${isCompact ? styles.compact : ''}`}
      data-test={GlobalDataTestIds.ADDED_FILTERS_TAB}
    >
      <p className={styles.filterText}>Filters: </p>

      <div
        className={styles.addedFilterContainer}
        data-test={GlobalDataTestIds.ADDED_FILTERS_CONTAINER}
      >
        {currentAppliedFilters.length === 0 &&
        checkIsNull(noFilterText) === false ? (
          <div className={styles.noFilterText}>{noFilterText}</div>
        ) : (
          currentAppliedFilters.map((filter, index) => (
            <div
              key={`${filter.filterKey}-${index}`}
              className={styles.singleFilterContainer}
              data-test={GlobalDataTestIds.SINGLE_FILTER_CONTAINER}
              style={{
                pointerEvents: isLoading ? 'none' : 'all',
              }}
              onClick={() => handleFilterClick(index)}
            >
              <Typography
                fontSize="1rem"
                fontWeight={500}
                noWrap
                whiteSpace={'pre'}
                onClick={() => handleFilterClick(index)}
              >
                {`${filter.filterLabel} ${
                  filter.filterType
                } ${rowFilters.getFilterValue(
                  filter.filterName ?? filter.filterValue,
                  filter.filterKey,
                  Object.keys(dynamicFilters)
                )}`}
              </Typography>
              {filter.filterType === FilterOptions.IN ||
              filter.filterType === FilterOptions.NOT_IN ? (
                <span
                  className={styles.inFilterBadge}
                  onClick={() => handleFilterClick(index)}
                >
                  {(filter.filterValue as string[]).length}
                  &nbsp;{getTitleCaseString(filter.filterKey)}
                </span>
              ) : null}

              <IconButton
                disableRipple
                sx={{
                  width: 'auto',
                  height: 'auto',
                  padding: '0rem',
                  marginLeft: '0.5rem',
                  cursor: 'pointer',
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  removeFilter(
                    filter,
                    isDisabledFilter(filter.filterKey, disableFilterConfig),
                    index
                  );
                }}
                disabled={isLoading}
              >
                {getEditOrRemoveIcon(
                  isDisabledFilter(filter.filterKey, disableFilterConfig)
                )}
              </IconButton>
            </div>
          ))
        )}
      </div>
      <div className={styles.vl}></div>
      <AltPrimaryButton
        data-test={GlobalDataTestIds.CLEAR_BUTTON}
        buttonText="Clear"
        width="5rem"
        buttonFunction={handleClearAppliedFilters}
        disabled={isFilterDisabled}
        isNewDesign={true}
      />
    </div>
  );
};

export default AddedFiltersTab;
