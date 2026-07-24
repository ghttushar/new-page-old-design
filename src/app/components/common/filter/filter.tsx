import { Frequency, Positions, Range } from '@/enums/serp.enums';
import { useEffect, useState } from 'react';
import SerpService from 'src/services/market-intelligence/serp.service';
import Dropdown, { IDropdownItem } from '../dropdown/dropdown';
import styles from './filter.module.scss';

import { customRangeFilterOption } from '@/constants';
import { IDateRange } from 'src/interfaces/serp.interface';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import {
  selectClickedApplyFilters,
  setClickedApplyFilters,
} from 'src/redux/slices/market-intelligence/market-intelligence.slice';
import {
  ISovFilterForm,
  selectAppliedSovFilters,
  selectSovFilter,
  selectSovOptions,
  setAppliedSovFilters,
  setBrandOptions,
  setKeywordFilter,
  setKeywordOptions,
  setPositionOption,
  setRangeOption,
  setSovFilters,
} from 'src/redux/slices/market-intelligence/sov-filter.slice';
import { filterBrandVariationsByMarketplace } from 'src/utils/auth.utils';
import { isCustomDateRangeSet } from 'src/utils/datetime.utils';
import localStorageUtils from 'src/utils/local-storage/local-storage.utils';
import serpUtils from 'src/utils/serp.utils';
import CustomDateRangePickerWrapper from '../../shared/custom-daterange-picker/custom-date-range-picker-wrapper';
import SearchableDropdown from '../dropdown/searchable-dropdown';
import PrimaryButton from '../primary-button/primary-button';

interface IFilterProps {
  hideBrandDropdown?: boolean;
  onKeywordFetchComplete: (count: number) => void;
  marketplace: string;
  countryCode?: string;
  setIsLoading?: (loading: boolean) => void;
}

export default function Filter(props: IFilterProps) {
  const { hideBrandDropdown, marketplace, countryCode } = props;
  const appliedSovFilters = useAppSelector(selectAppliedSovFilters);
  const filters = useAppSelector(selectSovFilter);
  const options = useAppSelector(selectSovOptions);
  const clickedApplyFilters = useAppSelector(selectClickedApplyFilters);
  const [isRunDisabled, setIsRunDisabled] = useState<boolean>(true);

  const dispatch = useAppDispatch();
  const setFilters = (filters: ISovFilterForm) =>
    dispatch(setSovFilters(filters));

  const handleLoading = (val: boolean) => {
    if (props.setIsLoading) props.setIsLoading(val);
  };
  useEffect(() => {
    dispatch(setPositionOption(marketplace));
  }, [marketplace, dispatch]);

  useEffect(() => {
    handleLoading(true);
    SerpService.getKeywords(marketplace, false, countryCode)
      .then((res) => {
        const keywords: IDropdownItem<string>[] = res.data.data.map<
          IDropdownItem<string>
        >((keyword) => ({
          label: keyword.keyword,
          value: keyword.keyword,
        }));
        if (keywords?.length) {
          const keyword = keywords[0];
          dispatch(setKeywordOptions(keywords));
          const marketIntelligenceFilters =
            localStorageUtils.getMarketIntelligenceFilters();

          if (marketIntelligenceFilters.isInitialFilters) {
            dispatch(setKeywordFilter(keyword));
            localStorageUtils.setMarketIntelligenceKeywordFilters(keyword);
          }
        }
        props.onKeywordFetchComplete(keywords?.length);
      })
      .finally(() => handleLoading(false));
    dispatch(setRangeOption(customRangeFilterOption));
    const brandNameVariations = localStorageUtils.getBrandNameVariations();

    dispatch(
      setBrandOptions(
        filterBrandVariationsByMarketplace(brandNameVariations, marketplace)
      )
    );
  }, [marketplace, dispatch, countryCode]);

  const onKeywordSelect = (value: IDropdownItem<string>) => {
    setFilters({
      ...filters,
      keyword: value,
    });

    setIsRunDisabled(false);
  };

  const onRangeSelect = (value: IDropdownItem<Range>) => {
    setFilters({
      ...filters,
      range: value,
    });

    if (value.value !== Range.CUSTOM_RANGE) {
      setIsRunDisabled(false);
    } else {
      setIsRunDisabled(true);
    }
  };

  const onPositionChange = (value: IDropdownItem<Positions>) => {
    setFilters({
      ...filters,
      position: value,
    });

    setIsRunDisabled(false);
  };

  const onFrequencyChange = (value: IDropdownItem<Frequency>) => {
    setFilters({
      ...filters,
      frequency: value,
    });

    setIsRunDisabled(false);
  };

  const onBrandChange = (value: IDropdownItem<string>) => {
    setFilters({
      ...filters,
      brandName: value,
    });

    setIsRunDisabled(false);
  };

  const setCustomDateRange = (value: IDateRange) => {
    setFilters({
      ...filters,
      customDateRange: value,
    });
  };

  const handleRun = () => {
    const _sovFilters = serpUtils.getFilters(filters);
    dispatch(setAppliedSovFilters(_sovFilters));
    dispatch(setClickedApplyFilters(!clickedApplyFilters));
    setIsRunDisabled(true);
    localStorageUtils.setMarketIntelligenceFilters(filters);
  };

  const handleSetCustomDateRangeForModal = (dateRange: IDateRange) => {
    setCustomDateRange(dateRange);
    setFilters({
      ...filters,
      customDateRange: dateRange,
      range: customRangeFilterOption,
    });
    if (isCustomDateRangeSet(dateRange)) {
      setIsRunDisabled(false);
    }
  };

  if (appliedSovFilters.keyword === undefined) return <div></div>;
  return (
    <div className={styles.filterContent} data-test="filter-content">
      <SearchableDropdown
        options={options.keyword}
        selected={filters.keyword}
        label={'Keyword'}
        onSelect={onKeywordSelect}
        width="100%"
      />
      <CustomDateRangePickerWrapper
        title={'Range'}
        handleDateChange={onRangeSelect}
        setCustomDateRange={handleSetCustomDateRangeForModal}
        rangeOptions={options.range}
        defaultPreset={filters.range}
        selectedCustomDateRange={filters.customDateRange}
      />

      <Dropdown
        options={options.position}
        label={'Position'}
        selected={filters.position}
        onSelect={onPositionChange}
        width="100%"
      />
      <Dropdown
        options={options.frequency}
        label={'Frequency'}
        onSelect={onFrequencyChange}
        selected={filters.frequency}
        width="100%"
      />
      {!hideBrandDropdown && (
        <SearchableDropdown
          options={options.brandName}
          selected={filters.brandName}
          label={'Brand'}
          onSelect={onBrandChange}
          width="100%"
        />
      )}

      <span style={{ marginTop: '1.9rem' }}>
        <PrimaryButton
          buttonText={'Run'}
          buttonFunction={handleRun}
          disabled={isRunDisabled}
          height="3rem"
        />
      </span>
    </div>
  );
}
