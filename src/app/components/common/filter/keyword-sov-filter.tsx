import { customRangeFilterOption } from '@/constants';
import { Frequency, MarketplaceEnum, Range } from '@/enums/serp.enums';
import { useEffect, useState } from 'react';
import { MultiSelectOptions } from 'src/constants/sov.filter.constants';
import { IMultiSelectDropdownItem } from 'src/interfaces/dropdown.interfaces';
import { IDateRange } from 'src/interfaces/serp.interface';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import {
  IKeywordSovFilterForm,
  selectKeywordSovFilter,
  selectKeywordSovOptions,
  setAppliedKeywordSovFilters,
  setKeywordSovBrandOptions,
  setKeywordSovFilters,
  setKeywordSovKeywordOptions,
  setKeywordSovRangeOption,
} from 'src/redux/slices/market-intelligence/keyword-sov-filter.slice';
import SerpService from 'src/services/market-intelligence/serp.service';
import { filterBrandVariationsByMarketplace } from 'src/utils/auth.utils';
import { isCustomDateRangeSet } from 'src/utils/datetime.utils';
import localStorageUtils from 'src/utils/local-storage/local-storage.utils';
import CustomDateRangePickerWrapper from '../../shared/custom-daterange-picker/custom-date-range-picker-wrapper';
import Dropdown, { IDropdownItem } from '../dropdown/dropdown';
import SearchableDropdown from '../dropdown/searchable-dropdown';
import MultiselectOptionBox from '../multiselect-option-box/multiselect-option-box';
import PrimaryButton from '../primary-button/primary-button';
import styles from './filter.module.scss';

export default function KeywordSOVFilter({
  marketplace,
  countryCode,
}: {
  marketplace: MarketplaceEnum;
  countryCode: string;
}) {
  const filters = useAppSelector(selectKeywordSovFilter);
  const options = useAppSelector(selectKeywordSovOptions);
  const [showDateRangeModal, setShowDateRangeModal] = useState<boolean>(false);
  const [prevRange, setPrevRange] = useState<IDropdownItem<Range> | null>(null);
  const [isRunDisabled, setIsRunDisabled] = useState<boolean>(true);

  const dispatch = useAppDispatch();
  const setFilters = (keywordSovFilters: IKeywordSovFilterForm) =>
    dispatch(setKeywordSovFilters(keywordSovFilters));

  useEffect(() => {
    SerpService.getKeywords(marketplace, false, countryCode).then((res) => {
      const keywords: IMultiSelectDropdownItem[] = res.data.data.map(
        (keyword) => ({
          label: keyword.keyword,
          value: keyword.keyword,
          selected: false,
        })
      );

      dispatch(
        setKeywordSovKeywordOptions([
          {
            label: MultiSelectOptions[0].label,
            value: MultiSelectOptions[0].value,
            selected: false,
          },
          ...keywords,
        ])
      );
    });
    const brandNameVariations = localStorageUtils.getBrandNameVariations();

    dispatch(
      setKeywordSovBrandOptions(
        filterBrandVariationsByMarketplace(brandNameVariations, marketplace)
      )
    );
  }, [marketplace, dispatch, countryCode]);

  const onKeywordSelect = (selectedOptions: IMultiSelectDropdownItem[]) => {
    dispatch(setKeywordSovKeywordOptions(selectedOptions));
    setIsRunDisabled(false);
  };

  const onRangeSelect = (value: IDropdownItem<Range>) => {
    setPrevRange(filters.range);

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

  const onFrequencyChange = (value: IDropdownItem<Frequency>) => {
    setFilters({
      ...filters,
      frequency: value,
    });
    setIsRunDisabled(false);
  };

  const setCustomDateRange = (value: IDateRange) => {
    setFilters({
      ...filters,
      customDateRange: value,
    });
  };

  const onBrandChange = (value: IDropdownItem<string>) => {
    setFilters({
      ...filters,
      brandName: value,
    });
    setIsRunDisabled(false);
  };

  const handleRun = () => {
    dispatch(setAppliedKeywordSovFilters(filters));
    setIsRunDisabled(true);
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

  useEffect(() => {
    dispatch(setKeywordSovRangeOption(customRangeFilterOption));
  }, [dispatch]);

  return (
    <div className={styles.filterContent}>
      <MultiselectOptionBox
        label={'Keywords'}
        options={options.keywords}
        onSelect={onKeywordSelect}
        isHorizontalScroll={false}
        width="21.5vw"
        top="18rem"
        emptyOptionListMessage="No Keywords found"
      />
      <CustomDateRangePickerWrapper
        title={'Date Range'}
        handleDateChange={onRangeSelect}
        setCustomDateRange={handleSetCustomDateRangeForModal}
        rangeOptions={options.range}
        defaultPreset={filters.range}
        selectedCustomDateRange={filters.customDateRange}
      />
      <Dropdown
        options={options.frequency}
        label={'Frequency'}
        onSelect={onFrequencyChange}
        selected={filters.frequency}
        width="100%"
      />

      <SearchableDropdown
        options={options.brandName}
        selected={filters.brandName}
        label={'Brand'}
        onSelect={onBrandChange}
        width="100%"
      />
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
