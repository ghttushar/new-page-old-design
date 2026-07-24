import { range } from '@/constants/advertising-filter.constants';
import { Frequency, Range } from '@/enums/serp.enums';
import { TimezoneEnum } from '@/enums/timezone.enums';
import { TooltipPlacement } from '@/enums/tooltip-texts.enums';
import { IDateRange } from '@/interfaces/serp.interface';
import { getTodayByTimeZone } from '@/utils/datetime.utils';
import { Matcher } from 'react-day-picker';
import { IDropdownItem } from '../../common/dropdown/dropdown';
import InfoIcon from '../../common/info-icon/info-icon';
import DateRangePicker from './datepicker';

interface CustomDateRangePickerWrapperProps {
  title: string;
  handleDateChange: (dateRange: IDropdownItem<Range>) => void;
  setCustomDateRange: (range: IDateRange) => void;
  rangeOptions: Array<IDropdownItem<string>>;
  width?: string;
  height?: string;
  fontWeight?: string;
  fontSize?: string;
  dropShadow?: boolean;
  disabled?: boolean;
  disableMatcher?: Matcher[];
  isTooltipRequired?: boolean;
  labelTooltipTitle?: string;
  tooltipPosition?: TooltipPlacement;
  labelStyles?: React.CSSProperties;
  enableStorage?: boolean;
  defaultPreset?: IDropdownItem<string>;
  selectedCustomDateRange?: IDateRange;
  isProfitability?: boolean;
  frequencyOptions?: IDropdownItem<Frequency>[];
  selectedFrequency?: IDropdownItem<Frequency>;
  setFrequency?: (val: IDropdownItem<Frequency>) => void;
  externalTrigger?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  isNewDesign?: boolean;
  isNeedReducedBlur?: boolean;
  isFutureNavRequired?: boolean;
  isNoEndDateOptionRequired?: boolean;
  timeZone?: TimezoneEnum;
}
export function CustomDateRangePickerWrapper({
  title,
  handleDateChange,
  setCustomDateRange,
  rangeOptions,
  width,
  height,
  fontWeight,
  fontSize,
  dropShadow,
  disabled = false,
  isTooltipRequired,
  labelTooltipTitle,
  tooltipPosition = TooltipPlacement.Top,
  labelStyles,
  enableStorage,
  defaultPreset = range[2] as IDropdownItem<Range>,
  selectedCustomDateRange,
  isProfitability = false,
  frequencyOptions,
  selectedFrequency,
  setFrequency,
  externalTrigger = false,
  open,
  onOpenChange,
  isNewDesign,
  isNeedReducedBlur,
  isFutureNavRequired = false,
  isNoEndDateOptionRequired,
  timeZone,
  disableMatcher = [{ after: getTodayByTimeZone(timeZone) }],
}: CustomDateRangePickerWrapperProps) {
  return (
    <div data-test="custom-date-range-picker-wrapper">
      {!externalTrigger && (
        <div
          style={{
            display: 'flex',
          }}
        >
          <span
            style={{
              fontWeight: 400,
              fontSize: '1.2rem',
              marginBottom: '0.2rem',
              color: disabled ? '#bbb' : 'initial',
              ...labelStyles,
            }}
          >
            {title}
          </span>
          {isTooltipRequired === true && labelTooltipTitle && (
            <InfoIcon title={labelTooltipTitle} position={tooltipPosition} />
          )}
        </div>
      )}
      <DateRangePicker
        handleDateChange={handleDateChange}
        setCustomDateRange={setCustomDateRange}
        rangeOptions={rangeOptions as IDropdownItem<Range>[]}
        width={width}
        height={height}
        fontWeight={fontWeight}
        fontSize={fontSize}
        dropShadow={dropShadow}
        defaultPreset={defaultPreset as IDropdownItem<Range>}
        disabled={disabled}
        disableMatcher={disableMatcher}
        enableStorage={enableStorage}
        selectedCustomDateRange={selectedCustomDateRange}
        isProfitability={isProfitability}
        frequencyOptions={frequencyOptions}
        selectedFrequency={selectedFrequency}
        setFrequency={setFrequency}
        externalTrigger={externalTrigger}
        open={open}
        onOpenChange={onOpenChange}
        isNewDesign={isNewDesign}
        isFutureNavRequired={isFutureNavRequired}
        isNoEndDateOptionRequired={isNoEndDateOptionRequired}
        timeZone={timeZone}
      />
    </div>
  );
}

export default CustomDateRangePickerWrapper;
