import { ACTION_TYPE_MAPPING } from '@/constants/logs.constants';

import { ALL_VALUE, SELECT_ALL } from '@/constants';
import { WALMART_INDEFINITE_END_DATE } from '@/constants/advertising-walmart.constants';
import { DATE_FORMAT_3 } from '@/constants/datetime.constants';
import { ProductActionsMatchTypeMap } from '@/constants/keyword-action.constants';
import { checkIsEqual } from '@/utils/advertising.utils';
import {
  getAfterNDays,
  getFormattedDateWithFormat,
  getTodayByTimeZone,
} from '@/utils/datetime.utils';
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { getFilterTypes, IFilterSetting } from 'src/constants/filter.constants';
import {
  FilterDropdownValue,
  FilterOptions,
  Filters,
  FilterValueType,
} from 'src/enums/filter.enums';
import { IMultiSelectDropdownItem } from 'src/interfaces/dropdown.interfaces';
import { IFilterRange } from 'src/interfaces/index.interface';
import { useAppSelector } from 'src/redux/hooks';
import {
  IFilterDropDownValue,
  IFilterValue,
  IFinalFilters,
  selectFilters,
  setFilters,
} from 'src/redux/slices/filters/filter.slice';
import { checkMomentDateValidity, formatStringToTitleCase } from 'src/utils';
import {
  filterDropdownValueByFilters,
  filterFiltersBySelectedFilters,
  isDisabledFilter,
  rowFilters,
} from 'src/utils/row-filter.utils';
import { SingleCalendarWrapper } from '../../shared/custom-daterange-picker/custom-single-calendar';
import { IDropdownItem } from '../dropdown/dropdown';
import RowFilterComponent from './row-filter-component';

interface IRowFilterProps {
  id: number;
  filter: IFinalFilters;
  FILTER_CONFIG: IFilterSetting[];
  handleModalClose: () => void;
  disableFilterConfig?: Filters[];
  externalFilters?: IFinalFilters[];
  onFiltersChange?: (filters: IFinalFilters[]) => void;
  selectedAdvertisingNavTitle?: string;
}

const RowFilter: React.FC<IRowFilterProps> = ({
  id,
  filter,
  FILTER_CONFIG,
  handleModalClose,
  disableFilterConfig,
  externalFilters,
  onFiltersChange,
  selectedAdvertisingNavTitle,
}) => {
  const dispatch = useDispatch();
  const reduxFilters = useAppSelector(selectFilters);
  const filters = externalFilters ?? reduxFilters;

  const updateFilters = (newFilters: IFinalFilters[]) => {
    if (onFiltersChange) {
      onFiltersChange(newFilters);
    } else {
      dispatch(setFilters(newFilters));
    }
  };
  const [isCalendarOpen, setIsCalendarOpen] = useState<boolean>(false);
  const [isToOpen, setIsToOpen] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<IFilterValue>(
    filter.filterValue
  );
  const [isInputDisabled, setIsInputDisabled] = useState<boolean>(
    (inputValue as IFilterRange)?.from === '' ||
      (inputValue as IFilterRange)?.from === undefined
  );

  const filterNameData: IFilterSetting = FILTER_CONFIG?.find(
    (filterSetting) => filterSetting.filterKey === filter.filterKey
  ) as IFilterSetting;

  const filterOptionData = getFilterTypes(
    filterNameData?.filterValueType
  )?.find((option) => option === filter.filterType) as FilterOptions;

  const filterValueDropdownData = filterNameData?.filterDropdownValue?.find(
    (option) => option === filter.filterDropdownValue
  ) as FilterDropdownValue;

  const [selectedFilter, setSelectedFilter] = useState<IDropdownItem<Filters>>({
    label: filterNameData?.filterLabel,
    value: filterNameData?.filterKey,
  });

  const [selectedFilterOption, setSelectedFilterOption] = useState<
    IDropdownItem<FilterOptions>
  >({
    label: filterOptionData,
    value: filterOptionData,
  });

  const [filterInputType, setFilterInputType] = useState<FilterValueType>(
    filterNameData?.filterValueType as FilterValueType
  );

  const [selectedFilterDropdown, setSelectedFilterDropdown] = useState<
    IDropdownItem<FilterDropdownValue>
  >({
    label: formatStringToTitleCase(
      filterValueDropdownData as FilterDropdownValue
    ),
    value: filterValueDropdownData as FilterDropdownValue,
  });

  const initialMultiSelectFilterOptions = useMemo(
    () =>
      filterNameData?.filterDropdownValue?.map((option) => {
        const _option: IMultiSelectDropdownItem = {
          label: checkIsEqual(Filters.TAG_NAME, filterNameData.filterKey)
            ? option
            : formatStringToTitleCase(
                filterNameData.filterKey === Filters.ACTION_TYPE
                  ? ACTION_TYPE_MAPPING[option] ??
                      formatStringToTitleCase(option)
                  : filterNameData.filterKey === Filters.MATCH_TYPE_ADD
                  ? ProductActionsMatchTypeMap.get(option) ?? option
                  : option
              ),
          value: option,
          selected:
            (
              filters?.find(
                (filter) =>
                  (filter.filterKey === filterNameData.filterKey &&
                    filterNameData.filterValueType ===
                      FilterValueType.MULTI_SELECT_DROPDOWN) ||
                  filterNameData.filterKey === Filters.MATCH_TYPE_ADD ||
                  filter.filterKey === Filters.ACTION_TYPE
              )?.filterValue as string[]
            )?.includes(option) || false,
        };

        return _option;
      }) || [],
    [filterNameData, filters]
  );

  const [multiSelectFilterOptions, setMultiSelectFilterOptions] = useState<
    IMultiSelectDropdownItem[]
  >(
    filterNameData?.filterValueType === FilterValueType.MULTI_SELECT_DROPDOWN
      ? [
          {
            label: SELECT_ALL,
            value: ALL_VALUE,
            selected: false,
          } as IMultiSelectDropdownItem,
          ...initialMultiSelectFilterOptions,
        ]
      : initialMultiSelectFilterOptions
  );

  const finalFilterDropdownSettings = FILTER_CONFIG.find(
    (filterSetting) => filterSetting.filterKey === selectedFilter.value
  )?.filterDropdownValue?.map((option) => {
    if (
      option === FilterDropdownValue.SP ||
      option === FilterDropdownValue.SB ||
      option === FilterDropdownValue.SD ||
      option === FilterDropdownValue.SV ||
      checkIsEqual(Filters.TAG_NAME, selectedFilter.value)
    ) {
      return {
        label: option,
        value: option,
      };
    } else {
      return {
        label: formatStringToTitleCase(option),
        value: option,
      };
    }
  }) as IDropdownItem<FilterDropdownValue>[];
  const filterDropdownOptions = filterDropdownValueByFilters(
    selectedFilter.value,
    filters,
    finalFilterDropdownSettings
  );

  const filterCategories = filterFiltersBySelectedFilters(
    filters,
    FILTER_CONFIG
  ).map((filterSetting) => ({
    label: filterSetting.filterLabel,
    value: filterSetting.filterKey,
  })) as IDropdownItem<Filters>[];

  const filterOptions = getFilterTypes(
    FILTER_CONFIG.find(
      (filterSetting) => filterSetting.filterKey === selectedFilter.value
    )?.filterValueType
  ).map((option) => ({
    label: option,
    value: option,
  })) as IDropdownItem<FilterOptions>[];
  const getInitialDate = () => {
    if (filterInputType === FilterValueType.DATE) {
      if (filter.filterType === FilterOptions.IN_BETWEEN) {
        return {
          from: (filter.filterValue as IFilterRange)?.from || '',
          to: (filter.filterValue as IFilterRange)?.to || '',
        };
      }
      return filter.filterValue as IFilterRange;
    }
    return {
      from: (filter.filterValue as IFilterRange)?.from || '',
      to: (filter.filterValue as IFilterRange)?.to || '',
    };
  };

  const initialIndefiniteCheckState = useMemo(() => {
    if (filter.filterKey !== Filters.END_DATE) return false;
    if (inputValue === null || inputValue === undefined || inputValue === '')
      return false;

    let formattedDate;
    formattedDate = getFormattedDateWithFormat(
      inputValue as string,
      DATE_FORMAT_3
    );

    if (filter.filterType === FilterOptions.IN_BETWEEN) {
      if (
        (inputValue as IFilterRange).to === null ||
        (inputValue as IFilterRange).to === undefined ||
        (inputValue as IFilterRange).to === ''
      )
        return false;

      formattedDate = getFormattedDateWithFormat(
        (inputValue as IFilterRange).to.toString(),
        DATE_FORMAT_3
      );
      return checkIsEqual(WALMART_INDEFINITE_END_DATE, formattedDate);
    }
    return checkIsEqual(WALMART_INDEFINITE_END_DATE, formattedDate);
  }, [filter.filterKey, filter.filterType, inputValue]);

  const [date, setDate] = useState<IFilterRange>(getInitialDate());
  const [isIndefinite, setIsIndefinite] = useState<boolean>(false);

  useEffect(() => {
    setIsIndefinite(initialIndefiniteCheckState);
  }, [initialIndefiniteCheckState]);

  const handleIndefiniteClick = (value: boolean) => {
    setIsIndefinite(!isIndefinite);
    if (value) {
      handleInputValueChange(WALMART_INDEFINITE_END_DATE);
      setIsToOpen(false);
      setIsCalendarOpen(false);
    } else handleInputValueChange(getTodayByTimeZone().toString());
  };
  useEffect(() => {
    const filterNameData: IFilterSetting = FILTER_CONFIG.find(
      (filterSetting) => filterSetting.filterKey === filter.filterKey
    ) as IFilterSetting;
    const filterOptionData = getFilterTypes(
      filterNameData?.filterValueType
    ).find((option) => option === filter.filterType) as FilterOptions;
    setSelectedFilter({
      label: filterNameData?.filterLabel,
      value: filterNameData?.filterKey,
    });
    setSelectedFilterOption({
      label: filterOptionData,
      value: filterOptionData,
    });
    setFilterInputType(filterNameData?.filterValueType as FilterValueType);
    setInputValue(filter.filterValue);
    if (
      filterNameData?.filterValueType === FilterValueType.DROPDOWN &&
      filter.filterDropdownValue
    ) {
      if (Array.isArray(filter.filterDropdownValue)) {
        const formattedMultiSelectOptions: IMultiSelectDropdownItem[] =
          filterNameData?.filterDropdownValue?.map((option) => {
            if (filter.filterDropdownValue?.includes(option)) {
              return {
                label:
                  ProductActionsMatchTypeMap.get(option) ??
                  formatStringToTitleCase(option),
                value: option,
                selected: true,
              };
            }
            return {
              label:
                ProductActionsMatchTypeMap.get(option) ??
                formatStringToTitleCase(option),
              value: option,
              selected: false,
            };
          }) || [];
        setMultiSelectFilterOptions(formattedMultiSelectOptions);
      } else {
        setSelectedFilterDropdown({
          label:
            filter?.filterKey === Filters.AD_TYPE ||
            checkIsEqual(Filters.TAG_NAME, filter?.filterKey)
              ? (filter.filterName as FilterDropdownValue)
              : formatStringToTitleCase(
                  filter.filterName as FilterDropdownValue
                ),
          value: filter.filterDropdownValue as FilterDropdownValue,
        });
      }
    }
  }, [
    filter.filterValue,
    filter.filterType,
    filter.filterKey,
    filter.filterDropdownValue,
    FILTER_CONFIG,
    filter.filterName,
  ]);

  const setFromDate = (date: string) => {
    setIsCalendarOpen(false);
    const formattedDate = getFormattedDateWithFormat(date, DATE_FORMAT_3);

    if (selectedFilterOption.value === FilterOptions.IN_BETWEEN) {
      handleInputValueChange(formattedDate, 'from');
      setDate((prev) => ({
        ...prev,
        from: formattedDate,
        to: prev ? prev.to : '',
      }));
    } else {
      handleInputValueChange(formattedDate);
      setDate((prev) => ({
        from: formattedDate,
        to: (inputValue as IFilterRange)
          ? (inputValue as IFilterRange).from
          : '',
      }));
    }
  };

  const setToDate = (date: string) => {
    setIsToOpen(false);
    const formattedDate = getFormattedDateWithFormat(date, DATE_FORMAT_3);

    handleInputValueChange(formattedDate, 'to');
    setDate((prev) => ({
      ...prev,
      to: formattedDate,
      from: prev ? prev.from : '',
    }));
  };

  const handleSelectedFilter = (value: IDropdownItem<Filters>) => {
    setSelectedFilter(value);

    const filterSetting = FILTER_CONFIG.find(
      (filterSetting) => filterSetting.filterKey === (value.value as Filters)
    ) as IFilterSetting;

    const initialFilterOption = getFilterTypes(
      filterSetting.filterValueType
    )[0] as FilterOptions;

    setSelectedFilterOption({
      label: initialFilterOption,
      value: initialFilterOption,
    });

    setFilterInputType(filterSetting.filterValueType as FilterValueType);
    if (
      filterSetting.filterValueType === FilterValueType.DROPDOWN &&
      (filterSetting.filterKey === Filters.STATUS ||
        filterSetting.filterKey === Filters.CAMPAIGN_STATUS ||
        filterSetting.filterKey === Filters.ADGROUP_STATUS)
    ) {
      const filteredDropdownValue = filterDropdownValueByFilters(
        value.value,
        filters,
        filterSetting.filterDropdownValue?.map((option) => ({
          label: option,
          value: option,
        })) as IDropdownItem<FilterDropdownValue>[]
      ).map((option) => ({
        label: formatStringToTitleCase(option.value as FilterDropdownValue),
        value: option.value as FilterDropdownValue,
      }));

      if (filteredDropdownValue.length > 0) {
        setSelectedFilterDropdown(filteredDropdownValue[0]);
      }
    }

    if (
      (filterSetting.filterValueType === FilterValueType.DATE &&
        filterSetting.filterKey === Filters.START_DATE) ||
      filterSetting.filterKey === Filters.END_DATE
    ) {
      setInputValue({
        from:
          (date && date.from) ||
          getFormattedDateWithFormat(
            getTodayByTimeZone().toDateString(),
            DATE_FORMAT_3
          ),
        to:
          (date && date.to) ||
          getFormattedDateWithFormat(
            getTodayByTimeZone().toDateString(),
            DATE_FORMAT_3
          ),
      });
    }

    if (
      filterSetting.filterValueType === FilterValueType.DROPDOWN &&
      (filterSetting.filterKey === Filters.MATCH_TYPE_ADD ||
        filterSetting.filterKey === Filters.ACTION_TYPE)
    ) {
      setMultiSelectFilterOptions(
        filterSetting.filterDropdownValue?.map((option) => {
          const _option: IMultiSelectDropdownItem = {
            label:
              ProductActionsMatchTypeMap.get(option) ??
              formatStringToTitleCase(option),
            value: option,
            selected: true,
          };
          return _option;
        }) || []
      );
    }
    if (
      filterSetting.filterValueType === FilterValueType.MULTI_SELECT_DROPDOWN
    ) {
      setMultiSelectFilterOptions(
        filterSetting.filterDropdownValue?.map((option) => {
          const _option: IMultiSelectDropdownItem = {
            label: formatStringToTitleCase(option),
            value: option,
            selected: true,
          };
          return _option;
        }) || []
      );
    }

    const updatedFilters = [...filters];
    updatedFilters[id] = {
      filterKey: value.value,
      filterType: getFilterTypes(
        filterSetting.filterValueType
      )[0] as FilterOptions,
      filterValue:
        filterSetting.filterValueType ===
          FilterValueType.MULTI_SELECT_DROPDOWN ||
        value.value === Filters.ACTION_TYPE
          ? null
          : value.value === Filters.MATCH_TYPE_ADD
          ? (filterSetting.filterDropdownValue as string[])
          : (filterDropdownValueByFilters(
              value.value,
              filters,
              filterSetting.filterDropdownValue?.map((option) => ({
                label: option,
                value: option,
              })) as IDropdownItem<FilterDropdownValue>[]
            )[0]?.value as FilterDropdownValue) ?? '',
      filterDropdownValue:
        value.value === Filters.MATCH_TYPE_ADD ||
        value.value === Filters.ACTION_TYPE ||
        filterSetting.filterValueType === FilterValueType.MULTI_SELECT_DROPDOWN
          ? filterSetting.filterDropdownValue
          : filterDropdownValueByFilters(
              value.value,
              filters,
              filterSetting.filterDropdownValue?.map((option) => ({
                label: option,
                value: option,
              })) ?? []
            )[0]?.value ?? null,

      filterName:
        value.value === Filters.MATCH_TYPE_ADD ||
        value.value === Filters.ACTION_TYPE ||
        filterSetting.filterValueType === FilterValueType.MULTI_SELECT_DROPDOWN
          ? filterSetting.filterDropdownValue
          : filterDropdownValueByFilters(
              value.value,
              filters,
              filterSetting.filterDropdownValue?.map((option) => ({
                label: option,
                value: option,
              })) ?? []
            )[0]?.label ?? null,
      filterLabel: filterSetting.filterLabel,
    };
    updateFilters(updatedFilters);
  };

  const handleSelectedFilterOption = (value: IDropdownItem<FilterOptions>) => {
    if (checkIsEqual(value.value, filter.filterType)) return;
    setSelectedFilterOption(value);
    const updatedFilters = [...filters];
    updatedFilters[id] = {
      filterKey: selectedFilter.value,
      filterType: value.value,
      filterValue: inputValue,
      filterDropdownValue: selectedFilterDropdown.value,
      filterName: updatedFilters[id].filterName,
      filterLabel: selectedFilter.label,
    };
    if (
      updatedFilters[id].filterKey === Filters.START_DATE ||
      updatedFilters[id].filterKey === Filters.END_DATE
    ) {
      date && isIndefinite && setIsIndefinite(!isIndefinite);
      if (value.value === FilterOptions.IN_BETWEEN) {
        updatedFilters[id] = {
          ...updatedFilters[id],
          filterType: value.value,
          filterValue: {
            from: date?.from ?? '',
            to: date?.to ?? '',
          },
        };
      } else {
        updatedFilters[id] = {
          ...updatedFilters[id],
          filterType: value.value,
          filterValue: '',
        };
      }
      setDate({
        from: '',
        to: '',
      });
    }
    updateFilters(updatedFilters);
  };

  const handleSelectedFilterDropdown = (
    value: IDropdownItem<FilterDropdownValue>
  ) => {
    setSelectedFilterDropdown(value);

    const updatedFilters = [...filters];
    updatedFilters[id] = {
      ...updatedFilters[id],
      filterValue: value.value,
      filterDropdownValue: value.value,
      filterName: value.value,
      filterLabel: selectedFilter.label,
    };
    updateFilters(updatedFilters);
  };

  const handleMultipleSelectDropdown = (
    selectedOptions: IMultiSelectDropdownItem[]
  ) => {
    setMultiSelectFilterOptions(selectedOptions);

    const _selectedOptions = selectedOptions
      .filter((option) => option.selected === true && option.value !== '')
      .map((option) => option.value);

    const updatedFilters = [...filters];
    updatedFilters[id] = {
      filterKey: selectedFilter.value,
      filterType: selectedFilterOption.value,
      filterValue: _selectedOptions as string[],
      filterDropdownValue: _selectedOptions,
      filterName: _selectedOptions,
      filterLabel: selectedFilter.label,
    };
    updateFilters(updatedFilters);
  };

  const handleInputValueChange = (
    value: IFilterValue,
    rangeType?: 'from' | 'to'
  ) => {
    let filterValue: IFilterRange;
    if (selectedFilterOption.value === FilterOptions.IN_BETWEEN) {
      const currentRange = (inputValue as IFilterRange) || {
        from: null,
        to: null,
      };
      if (filterInputType === FilterValueType.DATE) {
        const formattedValue = getFormattedDateWithFormat(
          value as string,
          DATE_FORMAT_3
        );
        const filterValue =
          rangeType === 'from'
            ? { ...currentRange, from: formattedValue }
            : {
                ...currentRange,
                to: formattedValue,
              };

        setInputValue(filterValue);
        updateFiltersWithValue(filterValue);
        if (rangeType === 'from') {
          setIsInputDisabled(false);
        }
        return;
      }

      const numericValue = value === '' ? null : Number(value);
      if (rangeType === 'from') {
        filterValue = { ...currentRange, from: numericValue ?? '' };
        setIsInputDisabled(false);
      } else {
        filterValue = { ...currentRange, to: numericValue ?? '' };
      }

      setInputValue(filterValue);
      updateFiltersWithValue(filterValue);
    } else {
      if (filterInputType === FilterValueType.DATE) {
        const formattedValue = getFormattedDateWithFormat(
          value?.toString() ?? '',
          DATE_FORMAT_3
        );
        setInputValue(formattedValue);
        updateFiltersWithValue(formattedValue);
        return;
      }

      setInputValue(value);
      updateFiltersWithValue(value);
    }
  };

  const updateFiltersWithValue = (value: IFilterValue) => {
    const updatedFilters = [...filters];
    updatedFilters[id] = {
      ...updatedFilters[id],
      filterValue: value,
      filterDropdownValue: value as IFilterDropDownValue,
      filterName: rowFilters
        .getFilterValue(value, updatedFilters[id].filterKey)
        ?.toString(),
      filterLabel: formatStringToTitleCase(selectedFilter.label),
    };
    updateFilters(updatedFilters);
  };

  const removeFilter = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();

    const isDisabled = isDisabledFilter(filter.filterKey, disableFilterConfig);
    if (isDisabled) return;

    const updatedFilters = filters.filter((_, index) => index !== id);
    if (updatedFilters.length === 0) handleModalClose();
    updateFilters(updatedFilters);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (
      filterInputType === FilterValueType.NUMBER &&
      (e.key === '-' || e.key === '+')
    ) {
      e.preventDefault();
    }
  };

  const renderDateSelection = () => {
    if (selectedFilterOption.value === FilterOptions.IN_BETWEEN) {
      return (
        <div className="flex gap-4 ">
          <SingleCalendarWrapper
            value={
              date && date.from && checkMomentDateValidity(date.from as string)
                ? getFormattedDateWithFormat(
                    date.from.toString(),
                    DATE_FORMAT_3
                  )
                : null
            }
            isOpen={isCalendarOpen}
            onOpenChange={setIsCalendarOpen}
            onDateSelect={setFromDate}
          />
          <SingleCalendarWrapper
            value={
              date && date.to && checkMomentDateValidity(date.to as string)
                ? getFormattedDateWithFormat(date.to.toString(), DATE_FORMAT_3)
                : null
            }
            isOpen={isToOpen}
            onOpenChange={setIsToOpen}
            onDateSelect={setToDate}
            minDate={
              date && date.from
                ? new Date(getAfterNDays(date.from as string, 2))
                : getTodayByTimeZone()
            }
            disabled={isInputDisabled}
            setIsChecked={
              filterNameData.filterKey === Filters.END_DATE &&
              filterOptionData === FilterOptions.IN_BETWEEN
                ? handleIndefiniteClick
                : undefined
            }
            isChecked={isIndefinite}
          />
        </div>
      );
    }
    return (
      <SingleCalendarWrapper
        value={
          inputValue
            ? getFormattedDateWithFormat(inputValue.toString(), DATE_FORMAT_3)
            : null
        }
        isOpen={isCalendarOpen}
        onOpenChange={setIsCalendarOpen}
        onDateSelect={setFromDate}
        customStyles={{
          width: '14rem',
        }}
        isChecked={isIndefinite}
        setIsChecked={
          filterNameData?.filterKey === Filters.END_DATE &&
          filterOptionData === FilterOptions.IS_ON
            ? handleIndefiniteClick
            : undefined
        }
      />
    );
  };

  return (
    <RowFilterComponent
      key={filter.filterKey}
      filterId={id}
      filters={filterCategories}
      selectedFilterCategory={selectedFilter}
      isDisabledFilter={isDisabledFilter(
        selectedFilter.value,
        disableFilterConfig
      )}
      filterOptions={filterOptions}
      selectedFilterOption={selectedFilterOption}
      filterInputType={filterInputType}
      multiSelectFilterOptions={multiSelectFilterOptions}
      filterDropdownOptions={filterDropdownOptions}
      selectedFilterDropdown={selectedFilterDropdown}
      customDatePicker={renderDateSelection()}
      isInputDisabled={isInputDisabled}
      trashIconStyles={rowFilters.getTrashIconStyles(
        filter.filterKey,
        disableFilterConfig
      )}
      inputValue={inputValue}
      handleKeyDown={handleKeyDown}
      removeFilter={removeFilter}
      handleInputValueChange={handleInputValueChange}
      handleSelectedFilter={handleSelectedFilter}
      handleSelectedFilterOption={handleSelectedFilterOption}
      handleMultipleSelectDropdown={handleMultipleSelectDropdown}
      handleSelectedFilterDropdown={handleSelectedFilterDropdown}
      selectedAdvertisingNavTitle={selectedAdvertisingNavTitle}
    />
  );
};

export default RowFilter;
