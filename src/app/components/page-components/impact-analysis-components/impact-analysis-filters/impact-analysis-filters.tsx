import MultiSelectDropdown from '@/app/components/common/dropdown/multi-select-dropdown';
import CustomDateRangePickerWrapper from '@/app/components/shared/custom-daterange-picker/custom-date-range-picker-wrapper';
import { customRangeFilterOption } from '@/constants';
import { IMultiSelectDropdownItem } from '@/interfaces/dropdown.interfaces';
import { selectIsChatbotOpen } from '@/redux/slices/auth/auth.slice';
import { checkIsEqual } from '@/utils/advertising.utils';
import { removeSelectedMetrics } from '@/utils/analysis.utils';
import { useCallback, useEffect, useState } from 'react';
import { IDropdownItem } from 'src/app/components/common/dropdown/dropdown';
import PrimaryButton from 'src/app/components/common/primary-button/primary-button';
import { IDateRange } from 'src/interfaces/analysis.interface';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import {
  IAnalysisFilterForm,
  selectAnalysisFilter,
  selectAnalysisOptions,
  setAnalysisFilters,
  setAnalysisRangeOption,
  setSelectedAnalysisMetrics,
} from 'src/redux/slices/impact-analysis/impact-analysis.slice';
import styles from './impact-analysis-filters.module.scss';

export default function ImpactAnalysisFilters() {
  const filters = useAppSelector(selectAnalysisFilter);
  const options = useAppSelector(selectAnalysisOptions);
  const isChatBotOpen = useAppSelector(selectIsChatbotOpen);

  const [headerFilters, setHeaderFilters] =
    useState<IAnalysisFilterForm>(filters);

  const dispatch = useAppDispatch();
  const setFilters = useCallback(
    (filters: IAnalysisFilterForm) => dispatch(setAnalysisFilters(filters)),
    [dispatch]
  );

  const handleRangeSelect = (value: IDropdownItem<string>) => {
    setHeaderFilters((prev) => {
      return {
        ...prev,
        range: value,
      };
    });
  };

  const handleImpactRangeSelect = (value: IDropdownItem<string>) => {
    setHeaderFilters((prev) => {
      return {
        ...prev,
        impactRange: value,
      };
    });
  };

  const handleSetImpactCustomDateRangeForModal = (dateRange: IDateRange) => {
    setHeaderFilters((prev) => {
      return {
        ...prev,
        impactCustomDateRange: dateRange,
        impactRange: customRangeFilterOption,
      };
    });
  };

  const onAnalyzeClick = () => {
    setFilters(headerFilters);
  };

  const handleSetCustomDateRangeForModal = (dateRange: IDateRange) => {
    setHeaderFilters((prev) => {
      return {
        ...prev,
        customDateRange: dateRange,
        range: customRangeFilterOption,
      };
    });
  };

  const handleMetricChange = (selectedOptions: IMultiSelectDropdownItem[]) => {
    dispatch(setSelectedAnalysisMetrics(selectedOptions));
  };

  useEffect(() => {
    dispatch(setAnalysisRangeOption(customRangeFilterOption));
  }, [dispatch]);

  return (
    <div className={styles.filtersContainer}>
      <div className="flex items-end gap-[1rem]">
        <CustomDateRangePickerWrapper
          title={'Time Period'}
          handleDateChange={handleRangeSelect}
          setCustomDateRange={handleSetCustomDateRangeForModal}
          rangeOptions={options.range}
          width={isChatBotOpen ? '24rem' : '32rem'}
          defaultPreset={headerFilters.range}
          selectedCustomDateRange={headerFilters.customDateRange}
        />

        <span className={styles.middleText}>vs</span>

        <CustomDateRangePickerWrapper
          title={'Impact Period'}
          handleDateChange={handleImpactRangeSelect}
          setCustomDateRange={handleSetImpactCustomDateRangeForModal}
          rangeOptions={options.range}
          width={isChatBotOpen ? '24rem' : '32rem'}
          defaultPreset={headerFilters.impactRange}
          selectedCustomDateRange={headerFilters.impactCustomDateRange}
        />
      </div>

      <div className="flex items-end gap-[1rem] justify-end w-[100%]">
        <MultiSelectDropdown
          options={filters.selectedAnalysisMetrics}
          label={'Metrics'}
          onSelect={handleMetricChange}
          width="22rem"
          height="3rem"
          maxLimit={4}
          minLimit={1}
          background="white"
        />

        <PrimaryButton
          buttonText="Analyze"
          width="10rem"
          height="3rem"
          buttonFunction={onAnalyzeClick}
          disabled={checkIsEqual(
            removeSelectedMetrics(filters, true),
            removeSelectedMetrics(headerFilters, true)
          )}
        />
      </div>
    </div>
  );
}
