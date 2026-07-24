import MultiselectCustomOptionBox from '@/app/components/common/multi-select-custom-option-box/multi-select-custom-option-box';
import PrimaryButton from '@/app/components/common/primary-button/primary-button';
import CustomDateRangePickerWrapper from '@/app/components/shared/custom-daterange-picker/custom-date-range-picker-wrapper';
import { customRangeFilterOption } from '@/constants';
import { MarketplaceEnum, Range } from '@/enums/serp.enums';
import {
  IDaypartingCampaignList,
  IDaypartingJob,
  IWalmartDaypartingJob,
} from '@/interfaces/day-parting.interfaces';
import Dropdown, {
  IDropdownItem,
} from 'src/app/components/common/dropdown/dropdown';
import { MetricsKeysEnum } from 'src/enums/advertising.enums';
import { IMultiSelectCustomDropdownItem } from 'src/interfaces/dropdown.interfaces';
import { IDateRange } from 'src/interfaces/serp.interface';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';

import { selectIsChatbotOpen } from '@/redux/slices/auth/auth.slice';
import {
  IDayPartingFilterForm,
  selectDayPartingAppliedFilters,
  selectDayPartingFilters,
  selectDayPartingOptions,
  selectIsRunDisabled,
  setDayPartingAppliedFilters,
  setDayPartingCampaignOptions,
  setDayPartingFilters,
  setIsRunDisabled,
} from '@/redux/slices/day-parting/day-parting.slice';
import { formatDate } from '@/utils';
import {
  getTodayByTimeZone,
  isCustomDateRangeSet,
} from 'src/utils/datetime.utils';
import styles from './day-parting-filter.module.scss';

interface IDayPartingFilterProps {
  customDateRange: IDateRange;
  setCustomDateRange: (value: IDateRange) => void;
  campaigns: IDaypartingCampaignList[];
  handleEditRuleClick: (job: IWalmartDaypartingJob | IDaypartingJob) => void;
  isEdit: boolean;
  marketplace: MarketplaceEnum;
}

export default function DayPartingFilter({
  customDateRange,
  setCustomDateRange,
  campaigns,
  handleEditRuleClick,
  isEdit,
  marketplace,
}: IDayPartingFilterProps) {
  const isChatbotOpen = useAppSelector(selectIsChatbotOpen);
  const isRunDisabled = useAppSelector(selectIsRunDisabled);

  const dispatch = useAppDispatch();
  const filters = useAppSelector(selectDayPartingFilters);

  const options = useAppSelector(selectDayPartingOptions);
  const setFilters = (filters: IDayPartingFilterForm) =>
    dispatch(setDayPartingFilters(filters));

  const appliedFilters = useAppSelector(selectDayPartingAppliedFilters);

  const onCampaignSelect = (
    selectedOptions: IMultiSelectCustomDropdownItem[]
  ) => {
    dispatch(setDayPartingCampaignOptions(selectedOptions));
    const hasSelected = selectedOptions.some((camp) => camp.selected);
    dispatch(setIsRunDisabled(!hasSelected));
  };

  const onMetricChange = (value: IDropdownItem<string>) => {
    setFilters({
      ...filters,
      metric: value,
    });
    dispatch(setIsRunDisabled(false));
  };

  const onRangeSelect = (value: IDropdownItem<Range>) => {
    setFilters({
      ...filters,
      range: value,
    });

    dispatch(setIsRunDisabled(value.value === Range.CUSTOM_RANGE));
  };

  const handleSetCustomDateRangeForModal = (dateRange: IDateRange) => {
    setCustomDateRange(dateRange);
    setFilters({
      ...filters,
      customDateRange: dateRange,
      range: customRangeFilterOption,
    });
    if (isCustomDateRangeSet(dateRange)) {
      dispatch(setIsRunDisabled(false));
    }
  };

  const handleRun = () => {
    dispatch(
      setDayPartingAppliedFilters({
        ...filters,
        campaigns: options.campaigns.filter((camp) => camp.selected),
      })
    );

    dispatch(setIsRunDisabled(true));
  };

  const checkIfDisabled = () => {
    return [
      MetricsKeysEnum.TOTAL_SALES,
      MetricsKeysEnum.TOTAL_UNITS,
      MetricsKeysEnum.TACOS,
    ].includes(filters.metric.value as MetricsKeysEnum);
  };
  return (
    <div className={styles.hourlyFilter}>
      <MultiselectCustomOptionBox
        label={'Select Campaigns'}
        options={options.campaigns}
        onSelect={onCampaignSelect}
        width={isChatbotOpen ? '30vw' : '35vw'}
        isHorizontalScroll={false}
        emptyOptionListMessage="No Campaigns found"
        disabled={checkIfDisabled()}
        campaigns={campaigns}
        dropShadow={true}
        handleEditRuleClick={handleEditRuleClick}
      />

      <Dropdown
        options={options.metric}
        label={'Select Metric'}
        onSelect={onMetricChange}
        selected={filters.metric}
        width="20rem"
        background="#ffffff"
        disabled={marketplace === MarketplaceEnum.WALMART}
        dropShadow={true}
      />

      <CustomDateRangePickerWrapper
        title={'Date Range'}
        handleDateChange={onRangeSelect}
        setCustomDateRange={handleSetCustomDateRangeForModal}
        rangeOptions={options.range}
        width="22rem"
        disableMatcher={[
          {
            before: new Date(
              formatDate(Range.LAST_30_DAYS_FROM_TODAY).startDate
            ),
            after: getTodayByTimeZone(),
          },
        ]}
        isTooltipRequired={true}
        labelTooltipTitle={'You can only select data from the past 30 days.'}
        disabled={marketplace === MarketplaceEnum.WALMART}
        dropShadow={true}
      />

      <PrimaryButton
        buttonText={marketplace === MarketplaceEnum.AMAZON ? 'Run' : 'Add'}
        buttonFunction={handleRun}
        disabled={isRunDisabled}
        height="3rem"
        width="auto"
        isHoverTooltipEnabled={true}
        tooltipText={
          appliedFilters.campaigns.length === 0
            ? 'Please select a campaign'
            : ''
        }
      />
    </div>
  );
}
