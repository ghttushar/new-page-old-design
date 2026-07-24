import { IDropdownItem } from '@/app/components/common/dropdown/dropdown';
import {
  ISubHeaderDataItem,
  ISubHeaderProps,
} from '@/app/components/common/sub-header/sub-header';
import { range } from '@/constants/advertising-filter.constants';
import { customRangeFilterOption } from '@/constants';
import { emptyDateRange } from '@/constants/profitability/profitability.constants';
import { DropdownLabelEnum } from '@/enums/index.enums';
import { TimezoneEnum } from '@/enums/timezone.enums';
import { IDateRange } from '@/interfaces/advertising/amazon/sp-advertising.interface';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setSubheaderOptions } from '@/redux/slices/advertising/sub-header.slice';

import {
  IMonitoringHeaderFilterForm,
  selectMonitoringHeaderFilters,
  setMonitoringHeaderFilters,
  setMonitoringHeaderFiltersCustomRange,
} from '@/redux/slices/monitoring/monitoring.slice';
import { useCallback, useEffect, useState } from 'react';

const useMonitoringSubHeader = (
  title: string,
  titleTooltip: string,
  onChange?: () => void
) => {
  const dispatch = useAppDispatch();
  const headerFilters = useAppSelector(selectMonitoringHeaderFilters);

  const [showDateRangeModal, setShowDateRangeModal] = useState<boolean>(false);
  const [prevRange, setPrevRange] = useState<IDropdownItem<string> | null>(
    null
  );

  const setFilters = useCallback(
    (filters: IMonitoringHeaderFilterForm) =>
      dispatch(setMonitoringHeaderFilters(filters)),
    [dispatch]
  );

  const handleSetCustomDateRangeForModal = (dateRange: IDateRange) => {
    if (onChange) onChange();
    const newFilters = {
      ...headerFilters,
      customDateRange: dateRange,
      range: customRangeFilterOption,
    };

    setFilters(newFilters);
  };

  const handleMonitoringFilterRange = (value: IDropdownItem<string>) => {
    setFilters({
      ...headerFilters,
      range: value,
    });
  };

  const handleDateRangeFilterChange = (value: IDropdownItem<string>) => {
    if (onChange) onChange();
    setPrevRange(headerFilters.range);
    handleMonitoringFilterRange(value);
    dispatch(setMonitoringHeaderFiltersCustomRange(emptyDateRange));
  };

  const options = [...range, customRangeFilterOption];

  useEffect(() => {
    const dropdownOptions: ISubHeaderDataItem[] = [
      {
        selectedItem: headerFilters.range,
        setSelectedItem: handleDateRangeFilterChange,
        label: DropdownLabelEnum.DATE_RANGE,
        options,
        previousRangeState: prevRange,
        fallbackRangeState: options[0],
        customDateRange: headerFilters.customDateRange,
        showDateRangeModal: showDateRangeModal,
        setShowDateRangeModal: setShowDateRangeModal,
        handleSetCustomDateRangeForModal: handleSetCustomDateRangeForModal,
        timeZone: TimezoneEnum.UTC,
      },
    ];
    const subHeaderOptions: ISubHeaderProps = {
      title: title,
      titleTooltip: titleTooltip,
      isDropdownRequired: true,
      dropdownOptions,
      defaultPreset: headerFilters.range,
      selectedCustomDateRange: headerFilters.customDateRange,
      goBackButton: false,
    };
    dispatch(setSubheaderOptions(subHeaderOptions));
  }, [
    dispatch,
    headerFilters,
    prevRange,
    showDateRangeModal,
    title,
    titleTooltip,
  ]);

  return null;
};

export default useMonitoringSubHeader;
