import { checkIsNull } from '@/utils/advertising.utils';
import React, { useEffect, useMemo, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { getFilterTypes, IFilterSetting } from 'src/constants/filter.constants';
import { AdvertisingTitlesEnum } from 'src/enums/advertising.enums';
import { Filters } from 'src/enums/filter.enums';
import { IFilterRange } from 'src/interfaces/index.interface';
import { useAppSelector } from 'src/redux/hooks';
import { selectAdvertisingAccount } from 'src/redux/slices/auth/auth.slice';
import {
  IFinalFilters,
  selectAppliedFilters,
  selectClickedFilterId,
  selectFilters,
  setAppliedFilters,
  setClickedFilterId,
  setFilters,
} from 'src/redux/slices/filters/filter.slice';
import {
  getFormattedFilter,
  getMappedValuesForFilters,
  isInvalidArrayFilter,
  isInvalidFilterRangeValue,
  isNullFilter,
  syncStoredLsFilters,
} from 'src/utils/row-filter.utils';
import PrimaryButton from '../primary-button/primary-button';
import SecondaryButton from '../secondary-button/secondary-button';
import RowFilter from './row-filter';
import styles from './row-filter.module.scss';

interface IRowFilterWrapperProps {
  handleModalClose: () => void;
  filterConfig: IFilterSetting[];
  isDataLoaded: boolean;
  selectedAdvertisingNavTitle?: string;
  disableFilterConfig?: Filters[];
  disableAddFilter?: boolean;
  onFilterApply?: () => void;
  externalFilters?: IFinalFilters[];
  externalAppliedFilters?: IFinalFilters[];
  onFiltersChange?: (filters: IFinalFilters[]) => void;
  onAppliedFiltersChange?: (filters: IFinalFilters[]) => void;
  externalClickedFilterId?: string;
}
const RowFilterWrapper: React.FC<IRowFilterWrapperProps> = ({
  handleModalClose,
  filterConfig,
  isDataLoaded,
  selectedAdvertisingNavTitle,
  disableFilterConfig,
  disableAddFilter = false,
  onFilterApply,
  externalFilters,
  externalAppliedFilters,
  onFiltersChange,
  onAppliedFiltersChange,
  externalClickedFilterId,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const filterRef = useRef<HTMLDivElement | null>(null);
  const isMounted = useRef(false);
  const dispatch = useDispatch();
  const reduxFilters = useAppSelector(selectFilters);
  const reduxAppliedFilters = useAppSelector(selectAppliedFilters);
  const reduxClickedFilterId = useAppSelector(selectClickedFilterId);
  const advertisingAccount = useAppSelector(selectAdvertisingAccount);

  const filters = externalFilters ?? reduxFilters;
  const appliedFilters = externalAppliedFilters ?? reduxAppliedFilters;
  const clickedFilterId = externalClickedFilterId ?? reduxClickedFilterId;

  const selectedMarketplace = useMemo(
    () => advertisingAccount.marketplace as string,
    [advertisingAccount.marketplace]
  );

  const handleSetFilters = (filters: IFinalFilters[]) => {
    if (onFiltersChange) {
      onFiltersChange(filters);
    } else {
      dispatch(setFilters(filters));
    }
  };

  const handleAddFilterClick = () => {
    if (filters.length === filterConfig.length) {
      return;
    }
    const newFilter = filterConfig.find(
      (filterSetting) =>
        !filters.some((filter) => filter.filterKey === filterSetting.filterKey)
    );

    if (newFilter) {
      const stringifiedFilter = JSON.stringify({
        filterKey: newFilter.filterKey,
        filterType: getFilterTypes(newFilter.filterValueType)[0],
        filterValue: newFilter.filterDropdownValue?.[0] ?? null,
        filterDropdownValue: newFilter.filterDropdownValue?.[0] ?? null,
        filterName: newFilter.filterDropdownValue?.[0] ?? null,
        filterLabel: newFilter.filterLabel,
      });

      const updatedFilters = [...filters, JSON.parse(stringifiedFilter)];
      handleSetFilters(updatedFilters);
    }
  };

  const handleFilterChange = () => {
    if (onFilterApply) onFilterApply();
  };

  const handleApplyFilter = () => {
    const hasNullFilterValue = filters.some(
      (filter) => filter.filterValue === null
    );
    const hasNullRangeValue = filters.some(
      (filter) =>
        (filter.filterValue as IFilterRange).from === null ||
        (filter.filterValue as IFilterRange).to === null
    );
    if (!hasNullFilterValue && !hasNullRangeValue) {
      const finalFilters: IFinalFilters[] = getMappedValuesForFilters(
        filters,
        selectedMarketplace
      ).map(getFormattedFilter);

      syncStoredLsFilters(
        selectedAdvertisingNavTitle as AdvertisingTitlesEnum,
        finalFilters
      );

      if (onAppliedFiltersChange) {
        onAppliedFiltersChange(finalFilters);
      } else {
        dispatch(setAppliedFilters(finalFilters));
      }

      handleFilterChange();
      handleModalClose();
    }
  };
  const handleCancel = () => {
    handleSetFilters(appliedFilters);
    handleModalClose();
  };

  const areAllFiltersPopulated = (filters: IFinalFilters[]) =>
    !filters?.some(
      (filter) =>
        isNullFilter(filter) ||
        isInvalidFilterRangeValue(filter, filterConfig) ||
        isInvalidArrayFilter(filter)
    );

  useEffect(() => {
    if (checkIsNull(externalFilters) === false) return;

    if (appliedFilters.length > 0) {
      handleSetFilters(appliedFilters);
      return;
    }

    if (checkIsNull(filterConfig)) return;
    const stringifiedFilter = JSON.stringify({
      filterKey: filterConfig[0].filterKey,
      filterType: getFilterTypes(filterConfig[0].filterValueType)[0],
      filterValue: filterConfig[0].filterDropdownValue?.[0] ?? null,
      filterDropdownValue: filterConfig[0].filterDropdownValue?.[0] ?? null,
      filterName: filterConfig[0].filterDropdownValue?.[0] ?? null,
      filterLabel: filterConfig[0].filterLabel,
    });

    if (filters.length > 0) return;

    handleSetFilters([JSON.parse(stringifiedFilter)]);

    return () => {
      handleSetFilters([]);
    };
  }, []);

  useEffect(() => {
    const element = document.querySelector('#row-filter-container');
    if (!element) return;
    const selectedElement = document.getElementById(clickedFilterId);
    if (selectedElement) {
      selectedElement.scrollIntoView({ behavior: 'smooth' });
    } else {
      element.scrollTop = element.scrollHeight;
    }

    return () => {
      if (externalFilters === undefined) {
        dispatch(setClickedFilterId(''));
      }
    };
  }, [filters.length, clickedFilterId, dispatch, externalFilters]);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!isMounted.current) {
        isMounted.current = true;
        return;
      }

      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node) &&
        event.target !== document.body
      ) {
        if (externalFilters === undefined) {
          handleSetFilters([]);
        }
        handleModalClose();
      }
    };

    document.addEventListener('click', handleOutsideClick);

    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, []);

  return (
    <div className={styles.container} ref={containerRef}>
      <div
        className={styles.filterContainer}
        id="row-filter-container"
        ref={filterRef}
      >
        {filters.map((filter, index) =>
          index < filterConfig.length ? (
            <RowFilter
              id={index}
              key={`${filter.filterKey}-${index}`}
              filter={filter}
              FILTER_CONFIG={filterConfig}
              handleModalClose={handleModalClose}
              disableFilterConfig={disableFilterConfig}
              externalFilters={externalFilters}
              onFiltersChange={onFiltersChange}
              selectedAdvertisingNavTitle={selectedAdvertisingNavTitle}
            />
          ) : null
        )}
      </div>

      <div className={styles.dashLine}></div>

      <div className={styles.actionContainer}>
        <div
          className={styles.addFilter}
          onClick={handleAddFilterClick}
          style={{
            color: disableAddFilter ? '#bfbfbf' : '',
            cursor: disableAddFilter ? 'not-allowed' : '',
          }}
        >
          <span
            style={{
              marginTop: '-0.3rem',
              fontSize: '1.5rem',
              marginRight: '0.3rem',
            }}
          >
            +
          </span>
          <span>Add Filter</span>
        </div>
        <span
          style={{
            display: 'flex',
            gap: '1rem',
          }}
        >
          <SecondaryButton
            buttonText={'Cancel'}
            buttonFunction={handleCancel}
            disabled={false}
            height="3rem"
          />

          <PrimaryButton
            height="3rem"
            buttonText={'Apply'}
            buttonFunction={handleApplyFilter}
            disabled={!isDataLoaded || !areAllFiltersPopulated(filters)}
          ></PrimaryButton>
        </span>
      </div>
    </div>
  );
};

export default RowFilterWrapper;
