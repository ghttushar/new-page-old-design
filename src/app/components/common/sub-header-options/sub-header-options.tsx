import { Range } from '@/enums/serp.enums';
import { IDateRange } from '@/interfaces/advertising/amazon/sp-advertising.interface';
import { getUpdatedPagination } from '@/utils';
import {
  checkIsEqual,
  getAdvertisingRangeOptionsByMarketplace,
  processStoredAdvertisingFilters,
} from '@/utils/advertising.utils';
import localStorageUtils from '@/utils/local-storage/local-storage.utils';
import { useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { frequency, range } from 'src/constants/advertising-filter.constants';
import { customRangeFilterOption } from 'src/constants';
import { useAppSelector } from 'src/redux/hooks';
import {
  IAdvertisingFilterForm,
  selectAdvertisingAppliedFilter,
  selectAdvertisingFilter,
  selectAdvertisingOptions,
  selectPaginationModel,
  setAdvertisingAppliedFilters,
  setAdvertisingFilters,
  setPaginationModel,
} from 'src/redux/slices/advertising/advertising-filter.slice';
import {
  selectAnalysisFilter,
  setAnalysisFilters,
} from 'src/redux/slices/impact-analysis/impact-analysis.slice';
import CustomDateRangePickerWrapper from '../../shared/custom-daterange-picker/custom-date-range-picker-wrapper';
import Dropdown, { IDropdownItem } from '../dropdown/dropdown';
import PrimaryButton from '../primary-button/primary-button';
import styles from './sub-header-options.module.scss';

interface ISubHeaderOptionsProps {
  isShowImpactOn: boolean;
  onRunFilterClickCustomActions?: () => void;
}

export default function SubHeaderOptions({
  isShowImpactOn,
  onRunFilterClickCustomActions,
}: ISubHeaderOptionsProps) {
  const filters = useAppSelector(selectAdvertisingFilter);
  const appliedAdvertisingFilters = useAppSelector(
    selectAdvertisingAppliedFilter
  );
  const options = useAppSelector(selectAdvertisingOptions);
  const analysisFilters = useAppSelector(selectAnalysisFilter);
  const dispatch = useDispatch();
  const paginationModel = useAppSelector(selectPaginationModel);

  const setFilters = useCallback(
    (filters: IAdvertisingFilterForm) =>
      dispatch(setAdvertisingFilters(filters)),
    [dispatch]
  );

  useEffect(() => {
    const rangeOptions = getAdvertisingRangeOptionsByMarketplace();
    const storedDateRange = localStorageUtils.getDateRangeFilter(
      range[2] as IDropdownItem<Range>
    );
    const storedFrequency = localStorageUtils.getFrequencyFilter(frequency[0]);

    if (!storedDateRange && !storedFrequency) return;

    const storedAdvertisingFilters = processStoredAdvertisingFilters(
      storedDateRange,
      rangeOptions as IDropdownItem<Range>[],
      storedFrequency
    );

    setFilters(storedAdvertisingFilters);
    dispatch(setAdvertisingAppliedFilters(storedAdvertisingFilters));
  }, [dispatch, setFilters]);

  const handlePaginationModelReset = useCallback(() => {
    dispatch(setPaginationModel(getUpdatedPagination(paginationModel)));
  }, [dispatch, paginationModel]);

  const handleFrequencyChange = (value: IDropdownItem<string>) => {
    const newFilters = {
      ...filters,
      frequency: value,
    };
    setFilters(newFilters);
  };

  const handleRangeChange = (value: IDropdownItem<string>) => {
    const newFilters = {
      ...filters,
      range: value,
    };
    setFilters(newFilters);

    if (isShowImpactOn) {
      dispatch(
        setAnalysisFilters({
          ...analysisFilters,
          range: value,
        })
      );
    }
  };

  const handleRun = () => {
    dispatch(setAdvertisingAppliedFilters(filters));
    localStorageUtils.setFrequencyFilter(filters.frequency);
    localStorageUtils.setDateRangeFilter(
      filters.range as IDropdownItem<Range>,
      filters.customDateRange
    );
    handlePaginationModelReset();
  };

  const handleSetCustomDateRangeForModal = (dateRange: IDateRange) => {
    const newFilters = {
      ...filters,
      customDateRange: dateRange,
      range: customRangeFilterOption,
    };

    if (
      filters.range.isCustom &&
      filters.customDateRange &&
      (!dateRange.startDate || !dateRange.endDate)
    ) {
      newFilters.range = range[2] as IDropdownItem<Range>;
      newFilters.customDateRange = {
        startDate: '',
        endDate: '',
      };
    }

    setFilters(newFilters);
  };

  useEffect(() => {
    if (isShowImpactOn) {
      dispatch(
        setAnalysisFilters({
          ...analysisFilters,
          range: filters.range,
        })
      );
    }

    if (
      isShowImpactOn &&
      filters.customDateRange.startDate &&
      filters.customDateRange.endDate
    ) {
      dispatch(
        setAnalysisFilters({
          ...analysisFilters,
          customDateRange: filters.customDateRange,
        })
      );
    }
  }, [isShowImpactOn, filters.customDateRange, filters.range, dispatch]);

  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <h3>Performance Overview</h3>
      </div>
      <div className={styles.options}>
        <Dropdown
          label="Frequency"
          options={options.frequency}
          selected={filters.frequency}
          onSelect={handleFrequencyChange}
          width={'10rem'}
          height="3.2rem"
          dropShadow={true}
        />
        <CustomDateRangePickerWrapper
          title={'Date Range'}
          handleDateChange={handleRangeChange}
          setCustomDateRange={handleSetCustomDateRangeForModal}
          rangeOptions={options.range}
          dropShadow={true}
          height="3.2rem"
          enableStorage={true}
        />

        <PrimaryButton
          height="3.2rem"
          width="6rem"
          buttonText={'Run'}
          buttonFunction={handleRun}
          disabled={checkIsEqual(appliedAdvertisingFilters, filters)}
        />
      </div>
    </div>
  );
}
