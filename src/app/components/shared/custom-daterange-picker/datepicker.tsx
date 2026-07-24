'use client';
import { Calendar } from '@/components/ui/calendar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { customRangeFilterOption } from '@/constants';
import { WALMART_INDEFINITE_END_DATE } from '@/constants/advertising-walmart.constants';
import { DATE_FORMAT_19, DATE_FORMAT_3 } from '@/constants/datetime.constants';
import { ProfitabilityPnLFrequency } from '@/constants/profitability/profitability.constants';
import { Frequency, MarketplaceEnum, Range } from '@/enums/serp.enums';
import { TimezoneEnum } from '@/enums/timezone.enums';
import { IDateRange } from '@/interfaces/serp.interface';
import { cn } from '@/lib/utils';
import { useAppSelector } from '@/redux/hooks';
import { selectAdvertisingAccount } from '@/redux/slices/auth/auth.slice';
import {
  formatDate,
  getDateRangeDisplayValue,
  isIndefiniteDate,
} from '@/utils';
import {
  changeDateFormat,
  getDiffBetweenTwoDates,
  getIsLessThanMonth,
  getIsLessThanWeek,
  getTodayByTimeZone,
} from '@/utils/datetime.utils';
import localStorageUtils from '@/utils/local-storage/local-storage.utils';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel/FormControlLabel';
import IconButton from '@mui/material/IconButton/IconButton';
import Radio from '@mui/material/Radio/Radio';
import {
  ArrowRightIcon,
  CaretLeftIcon,
  CaretRightIcon,
} from '@phosphor-icons/react';
import moment from 'moment';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Matcher, SelectRangeEventHandler } from 'react-day-picker';
import AltPrimaryButton from '../../common/alt-primary-button/alt-primary-button';
import { IDropdownItem } from '../../common/dropdown/dropdown';
import PrimaryButton from '../../common/primary-button/primary-button';

interface DateRangePickerProps {
  handleDateChange: (dateRange: IDropdownItem<Range>) => void;
  setCustomDateRange: (range: IDateRange) => void;
  rangeOptions: Array<IDropdownItem<Range>>;
  defaultPreset: IDropdownItem<Range>;
  width?: string;
  height?: string;
  fontWeight?: string;
  fontSize?: string;
  dropShadow?: boolean;
  disabled?: boolean;
  enableStorage?: boolean;
  selectedCustomDateRange?: IDateRange;
  disableMatcher?: Matcher[];
  isProfitability?: boolean;
  frequencyOptions?: IDropdownItem<Frequency>[];
  selectedFrequency?: IDropdownItem<Frequency>;
  setFrequency?: (val: IDropdownItem<Frequency>) => void;
  externalTrigger?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  isNewDesign?: boolean;
  isFutureNavRequired?: boolean;
  isNoEndDateOptionRequired?: boolean;
  timeZone?: TimezoneEnum;
}

export default function DateRangePicker({
  handleDateChange,
  setCustomDateRange,
  rangeOptions,
  defaultPreset,
  width,
  height,
  fontWeight,
  fontSize,
  dropShadow = false,
  disabled,
  enableStorage = false,
  selectedCustomDateRange,
  disableMatcher,
  isProfitability = false,
  frequencyOptions,
  selectedFrequency,
  setFrequency,
  externalTrigger = false,
  open: externalOpen,
  onOpenChange: externalOnOpenChange,
  isNewDesign,
  isFutureNavRequired,
  isNoEndDateOptionRequired = false,
  timeZone,
}: DateRangePickerProps) {
  const calendarRef = useRef<HTMLDivElement>(null);
  const selectedAccount = useAppSelector(selectAdvertisingAccount);

  const marketplace = useMemo(
    () => selectedAccount.marketplace,
    [selectedAccount]
  );

  const initialState = useMemo(() => {
    if (rangeOptions.length === 0 && selectedCustomDateRange) {
      return {
        dateRange: {
          ...selectedCustomDateRange,
          endDate: isIndefiniteDate(selectedCustomDateRange.endDate)
            ? undefined
            : selectedCustomDateRange.endDate,
        },
        preset: customRangeFilterOption,
        noEndDateChecked: isIndefiniteDate(selectedCustomDateRange.endDate),
      };
    }

    const savedFilter =
      enableStorage === true
        ? localStorageUtils.getDateRangeFilter(defaultPreset)
        : {
            label: defaultPreset.value,
            startDate: selectedCustomDateRange?.startDate ?? null,
            endDate: selectedCustomDateRange?.endDate,
          };

    const matchingPreset =
      rangeOptions.length === 0
        ? customRangeFilterOption
        : rangeOptions.find((option) => option.value === savedFilter.label) ??
          defaultPreset;

    if (
      matchingPreset.value === Range.CUSTOM_RANGE &&
      savedFilter.startDate !== null &&
      savedFilter.endDate !== null
    ) {
      return {
        dateRange: {
          startDate: savedFilter.startDate,
          endDate: isIndefiniteDate(savedFilter.endDate)
            ? undefined
            : savedFilter.endDate,
        },
        preset: matchingPreset,
        noEndDateChecked: isIndefiniteDate(savedFilter.endDate),
      };
    }

    return {
      dateRange: formatDate(
        matchingPreset.isDisabled ? defaultPreset.value : matchingPreset.value,
        marketplace as MarketplaceEnum,
        timeZone
      ),
      preset: matchingPreset.isDisabled ? defaultPreset : matchingPreset,
      noEndDateChecked: false,
    };
  }, [
    rangeOptions,
    selectedCustomDateRange,
    enableStorage,
    defaultPreset,
    marketplace,
    timeZone,
  ]);

  const [selectedDateRange, setSelectedDateRange] = useState<IDateRange>(
    initialState.dateRange
  );
  const [tempDateRange, setTempDateRange] = useState<IDateRange>(
    initialState.dateRange
  );
  const [selectedPreset, setSelectedPreset] = useState<IDropdownItem<Range>>(
    initialState.preset
  );
  const [tempPreset, setTempPreset] = useState<IDropdownItem<Range>>(
    initialState.preset
  );
  const [showLabel, setShowLabel] = useState(false);
  const [isRangeSelected, setIsRangeSelected] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(
    moment(initialState.dateRange.startDate).toDate()
  );
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [frequencyState, setFrequencyState] = useState<
    IDropdownItem<Frequency>[]
  >(frequencyOptions ?? []);
  const [tempIsNoEndDateChecked, setTempIsNoEndDateChecked] = useState<boolean>(
    initialState.noEndDateChecked
  );
  const [selectedIsNoEndDateChecked, setSelectedIsNoEndDateChecked] =
    useState<boolean>(initialState.noEndDateChecked);

  const isOpen =
    externalTrigger && externalOpen !== undefined
      ? externalOpen
      : internalIsOpen;
  const setIsOpen =
    externalTrigger && externalOnOpenChange !== undefined
      ? externalOnOpenChange
      : setInternalIsOpen;

  const isNoEndDateRequired = useMemo(
    () => isNoEndDateOptionRequired && tempPreset.value === Range.CUSTOM_RANGE,
    [isNoEndDateOptionRequired, tempPreset.value]
  );

  useEffect(() => {
    setSelectedDateRange(initialState.dateRange);
    setTempDateRange(initialState.dateRange);
    setSelectedPreset(initialState.preset);
    setTempPreset(initialState.preset);
    setSelectedIsNoEndDateChecked(initialState.noEndDateChecked);
    setTempIsNoEndDateChecked(initialState.noEndDateChecked);
    setCurrentMonth(moment(initialState.dateRange.startDate).toDate());
  }, [initialState]);

  const handleFrequencyChange = (frequency: IDropdownItem<Frequency>) => {
    setFrequencyState((prev) =>
      prev.map((freq) => ({
        ...freq,
        selected: freq.value === frequency.value,
      }))
    );
  };

  const handleRangeChange = (value: Range) => {
    const newPreset = rangeOptions.find((preset) => preset.label === value);
    if (!newPreset) return;

    const isCustomRange = newPreset.value === Range.CUSTOM_RANGE;
    setTempPreset(newPreset);

    if (isCustomRange) {
      setIsRangeSelected(false);
      setCurrentMonth(moment(tempDateRange.startDate).toDate());
    } else {
      const formattedDates = formatDate(
        newPreset.value,
        marketplace as MarketplaceEnum,
        timeZone
      );

      setTempDateRange(formattedDates);
      setIsRangeSelected(!isCustomRange);
      setCurrentMonth(moment(formattedDates.startDate).toDate());
    }
    setTempIsNoEndDateChecked(false);
  };

  const handleCalendarSelect: SelectRangeEventHandler = (
    dates,
    selectedDay,
    activeModifiers,
    e
  ) => {
    e.stopPropagation();
    setTempIsNoEndDateChecked(false);
    const customRangeOption =
      rangeOptions.find((option) => option.value === Range.CUSTOM_RANGE) ??
      customRangeFilterOption;

    if (isRangeSelected && selectedDay) {
      setIsRangeSelected(false);
      setShowLabel(true);
      setTempDateRange({
        startDate: moment(selectedDay).format(DATE_FORMAT_3),
        endDate: moment(selectedDay).format(DATE_FORMAT_3),
      });
      setFrequencyState((prev) => {
        return prev.map((p) => {
          return {
            ...p,
            isDisabled: p.value !== Frequency.DAILY,
          };
        });
      });

      setCurrentMonth(selectedDay);
      setTempPreset(customRangeOption);
      return;
    }

    if (dates?.from) {
      setTempDateRange({
        startDate: moment(dates.from).format(DATE_FORMAT_3),
        endDate: moment(dates?.to ?? dates.from).format(DATE_FORMAT_3),
      });
      setIsRangeSelected(!!dates.to);
      setShowLabel(true);
      setCurrentMonth(moment(dates.from).toDate());
      setTempPreset(customRangeOption);
      setFrequencyState((prev) => {
        return prev.map((p) => {
          return {
            ...p,
            isDisabled:
              (p.value === Frequency.WEEKLY &&
                getIsLessThanWeek(
                  getDiffBetweenTwoDates(
                    dates.from?.toDateString() ?? '',
                    dates.to?.toDateString() ?? ''
                  )
                )) ||
              (p.value === Frequency.MONTHLY &&
                getIsLessThanMonth(
                  getDiffBetweenTwoDates(
                    dates.from?.toDateString() ?? '',
                    dates.to?.toDateString() ?? ''
                  )
                )),
          };
        });
      });
    }
  };

  const handleRangeClick = () => {
    if (isProfitability === true) {
      if (tempPreset.value === Range.CUSTOM_RANGE) {
        setShowLabel(false);
        return;
      }

      setShowLabel(true);
      setSelectedDateRange({
        ...tempDateRange,
        endDate: tempIsNoEndDateChecked
          ? WALMART_INDEFINITE_END_DATE
          : tempDateRange.endDate,
      });
      setSelectedPreset(tempPreset);
      setIsOpen(false);
      handleDateChange(tempPreset);
      setSelectedIsNoEndDateChecked(tempIsNoEndDateChecked);
      return;
    }
    setShowLabel(true);
  };

  const handleNoEndDateCheck = (isChecked: boolean) => {
    const customRangeOption =
      rangeOptions.find((option) => option.value === Range.CUSTOM_RANGE) ??
      customRangeFilterOption;

    let formattedTempDateRange: IDateRange = {
      ...tempDateRange,
    };

    if (isChecked) {
      formattedTempDateRange = {
        ...formattedTempDateRange,
        endDate: undefined,
      };
    } else {
      formattedTempDateRange = {
        ...formattedTempDateRange,
        endDate: tempDateRange.startDate,
      };
    }
    setTempDateRange(formattedTempDateRange);
    setTempPreset(customRangeOption);
    setTempIsNoEndDateChecked(isChecked);
  };

  const handleApply = () => {
    const formattedDateRange = {
      ...tempDateRange,
      endDate: tempIsNoEndDateChecked
        ? WALMART_INDEFINITE_END_DATE
        : tempDateRange.endDate,
    };
    setSelectedDateRange(formattedDateRange);
    setSelectedPreset(tempPreset);
    setSelectedIsNoEndDateChecked(tempIsNoEndDateChecked);
    setIsOpen(false);

    if (tempPreset.value === Range.CUSTOM_RANGE) {
      setCustomDateRange(formattedDateRange);
    } else {
      handleDateChange(tempPreset);
    }
    setShowLabel(false);
  };

  const handleCancel = () => {
    setTempDateRange(selectedDateRange);
    setTempPreset(selectedPreset);
    setTempIsNoEndDateChecked(selectedIsNoEndDateChecked);
    setCurrentMonth(moment(selectedDateRange.startDate).toDate());
    setShowLabel(false);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (calendarRef.current?.contains(event.target as Node) || !isOpen)
        return;
      handleCancel();
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const displayValue = useMemo(() => {
    return getDateRangeDisplayValue({
      showLabel,
      isProfitability: isProfitability === true,
      tempPreset: {
        value: tempPreset.value,
        label: tempPreset.label,
      },
      tempDateRange,
      isNoEndDateChecked: tempIsNoEndDateChecked,
      frequencyState,
    });
  }, [
    showLabel,
    isProfitability,
    tempPreset.value,
    tempPreset.label,
    tempDateRange,
    tempIsNoEndDateChecked,
    frequencyState,
  ]);

  if (externalTrigger) {
    return (
      <div ref={calendarRef} className={cn('w-full')}>
        <DateRangePickerContent
          rangeOptions={rangeOptions}
          dateState={{
            temp: tempDateRange,
            currentMonth,
            isRangeSelected,
          }}
          onShowRangeChange={handleRangeClick}
          onCancel={handleCancel}
          onApply={handleApply}
          onCalendarSelect={handleCalendarSelect}
          handleMonthChange={setCurrentMonth}
          disabled={disabled}
          disableMatcher={
            tempIsNoEndDateChecked
              ? [
                  ...(disableMatcher ?? []),
                  {
                    before: new Date(tempDateRange.startDate),
                    after: new Date(tempDateRange.startDate),
                  },
                ]
              : disableMatcher
          }
          isProfitability={isProfitability}
          isCustomRange={tempPreset.value === Range.CUSTOM_RANGE}
          frequencyOptions={frequencyState}
          setFrequencyState={handleFrequencyChange}
          setFrequency={setFrequency}
          isFutureNavRequired={isFutureNavRequired}
          isNoEndDateRequired={isNoEndDateRequired}
          isNoEndDateChecked={tempIsNoEndDateChecked}
          setIsNoEndDateChecked={handleNoEndDateCheck}
          timeZone={timeZone}
        />
      </div>
    );
  }

  const handleOpenChange = (open: boolean) => {
    if (open) setIsOpen(!isOpen);
    return;
  };

  return (
    <div className={cn('grid gap-2')}>
      <Select
        value={tempPreset.label}
        onValueChange={handleRangeChange}
        open={isOpen}
        onOpenChange={handleOpenChange}
        disabled={disabled}
        defaultValue={defaultPreset.value}
      >
        <SelectTrigger
          style={{
            display: 'flex',
            padding: '0.1rem 0 0  1rem',
            alignItems: 'center',
            backgroundColor: isNewDesign === true ? undefined : 'white',
            width: width ? width : '25rem',
            height: height ? height : '3rem',
            fontSize: fontSize ? fontSize : '1.16rem',
            fontWeight: fontWeight ? fontWeight : '400',
            lineClamp: '1',
            boxShadow: dropShadow
              ? '0rem 0.2rem 0.4rem 0rem rgba(0, 0, 0, 0.1)'
              : 'none',
            border:
              isNewDesign === true
                ? undefined
                : dropShadow
                ? '1px solid white'
                : '1px solid #dadeeb',
            whiteSpace: 'nowrap',
            transition: 'width 0.2s ease-in',
          }}
          className={
            isNewDesign === true
              ? cn(
                  'rounded-[0.8rem] !bg-[#fff]',
                  isOpen
                    ? [
                        '!border-[0.5px]',
                        '!border-[#000000]',
                        '!bg-origin-border',
                        '!bg-clip-padding',
                      ]
                    : ['!border-[0.5px]', '!border-[#acacac]'],
                  [
                    'hover:!border-[0.5px]',
                    'hover:!border-[#000000]',
                    'hover:!bg-origin-border',
                    'hover:!bg-clip-padding',
                  ]
                )
              : cn(
                  'rounded-md',
                  isOpen ? '!border-[#77469b]' : '',
                  'hover:!border-[#464646]'
                )
          }
          disabled={disabled}
        >
          <SelectValue>{displayValue}</SelectValue>
        </SelectTrigger>

        <SelectContent
          ref={calendarRef}
          className="w-full bg-white border-none py-2 mt-[0.3rem] shadow-[0_0_0.4rem_0_rgba(0,0,0,0.2)]"
          style={{
            paddingRight:
              tempPreset.value === Range.CUSTOM_RANGE ||
              isProfitability === false
                ? '0.4rem'
                : '',
          }}
          align="end"
          sideOffset={2}
        >
          <DateRangePickerContent
            rangeOptions={rangeOptions}
            dateState={{
              temp: tempDateRange,
              currentMonth,
              isRangeSelected,
            }}
            onShowRangeChange={handleRangeClick}
            onCancel={handleCancel}
            onApply={handleApply}
            onCalendarSelect={handleCalendarSelect}
            handleMonthChange={setCurrentMonth}
            disabled={disabled}
            disableMatcher={
              tempIsNoEndDateChecked
                ? [
                    ...(disableMatcher ?? []),
                    {
                      before: new Date(tempDateRange.startDate),
                      after: new Date(tempDateRange.startDate),
                    },
                  ]
                : disableMatcher
            }
            isProfitability={isProfitability}
            isCustomRange={tempPreset.value === Range.CUSTOM_RANGE}
            frequencyOptions={frequencyState}
            setFrequencyState={handleFrequencyChange}
            setFrequency={setFrequency}
            isFutureNavRequired={isFutureNavRequired}
            isNoEndDateRequired={isNoEndDateRequired}
            isNoEndDateChecked={tempIsNoEndDateChecked}
            setIsNoEndDateChecked={handleNoEndDateCheck}
            timeZone={timeZone}
          />
        </SelectContent>
      </Select>
    </div>
  );
}

interface DateRangePickerContentProps {
  rangeOptions: Array<IDropdownItem<string>>;
  dateState: {
    temp: IDateRange;
    currentMonth: Date;
    isRangeSelected: boolean;
  };
  disabled?: boolean;
  onShowRangeChange: () => void;
  onCancel: () => void;
  onApply: () => void;
  onCalendarSelect: SelectRangeEventHandler;
  handleMonthChange: (month: Date) => void;
  disableMatcher?: Matcher[];
  isProfitability?: boolean;
  isCustomRange?: boolean;
  isPerformanceCustom?: boolean;
  frequencyOptions?: IDropdownItem<Frequency>[];
  setFrequencyState?: (val: IDropdownItem<Frequency>) => void;
  setFrequency?: (val: IDropdownItem<Frequency>) => void;
  isFutureNavRequired?: boolean;
  isNoEndDateRequired: boolean;
  isNoEndDateChecked: boolean;
  setIsNoEndDateChecked: (value: boolean) => void;
  timeZone?: TimezoneEnum;
}

function DateRangePickerContent({
  rangeOptions,
  dateState,
  handleMonthChange,
  onShowRangeChange,
  onCancel,
  onApply,
  onCalendarSelect,
  disabled,
  disableMatcher,
  isProfitability = false,
  isCustomRange,
  isPerformanceCustom = false,
  frequencyOptions,
  setFrequencyState,
  setFrequency,
  isFutureNavRequired,
  isNoEndDateRequired,
  isNoEndDateChecked,
  setIsNoEndDateChecked,
  timeZone,
}: DateRangePickerContentProps) {
  const isProfitabilityCustomRange = useMemo(
    () => isCustomRange === true || isProfitability === false,
    [isCustomRange, isProfitability]
  );

  const handleFrequencyClick = (value: IDropdownItem<Frequency>) => {
    if (setFrequencyState) {
      setFrequencyState(value);
    }
  };

  const handleChangeNoEndDate = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setIsNoEndDateChecked(event.target.checked);
  };

  const handleApply = () => {
    onApply();
    if (setFrequency) {
      setFrequency(
        frequencyOptions?.filter((type) => type.selected)[0] ??
          ProfitabilityPnLFrequency[0]
      );
    }
  };

  return (
    <div className="flex">
      <div
        style={{
          borderRight:
            rangeOptions.length > 0 &&
            isProfitabilityCustomRange &&
            !isPerformanceCustom
              ? '1px solid #dadeeb'
              : '',
          padding: 0,
          width: rangeOptions.length ? '100%' : 0,
        }}
      >
        {!isPerformanceCustom &&
          rangeOptions.map((preset) => (
            <SelectItem
              key={preset.label}
              value={preset.label}
              className="cursor-pointer"
              onClick={onShowRangeChange}
              disabled={preset.isDisabled}
              style={{
                fontSize: '1rem',
                fontWeight: '400',
                padding: '0.5rem 0.8rem',
              }}
            >
              {preset.label}
            </SelectItem>
          ))}
      </div>
      {(isProfitabilityCustomRange || isPerformanceCustom) && (
        <div>
          <DateRangeDisplay
            dateRange={dateState.temp}
            isNoEndDateChecked={isNoEndDateChecked}
          />

          <span
            style={{
              display: 'flex',
              justifyContent: 'space-around',
              width: '100%',
              marginBottom: '-0.8rem',
              marginTop: '0.4rem',
            }}
          >
            {frequencyOptions &&
              frequencyOptions.length > 0 &&
              frequencyOptions.map((freq, index) => {
                return (
                  <FormControlLabel
                    key={`${freq.value}-${index}`}
                    control={
                      <Radio
                        classes={{
                          checked: '!text-[#77469b]',
                          root: '!text-[#77469b]',
                          disabled: '!text-[#9e9e9e]',
                        }}
                        sx={{
                          margin: 0,
                          padding: '0.4rem',
                        }}
                        disableRipple
                        checked={freq.selected === true}
                        onChange={() => handleFrequencyClick(freq)}
                        disabled={freq.isDisabled === true}
                      />
                    }
                    label={freq.label}
                    value={freq.value}
                    sx={{
                      margin: 0,
                      '& .MuiTypography-root': {
                        fontSize: '1.2rem',
                        fontWeight: '300 !important',
                        color: '#464646',
                      },
                    }}
                  />
                );
              })}
          </span>

          <Calendar
            initialFocus
            mode="range"
            month={dateState.currentMonth}
            defaultMonth={dateState.currentMonth}
            toMonth={
              isFutureNavRequired ? undefined : getTodayByTimeZone(timeZone)
            }
            onMonthChange={handleMonthChange}
            today={getTodayByTimeZone(timeZone)}
            disabled={disableMatcher}
            selected={{
              from: moment(dateState.temp.startDate).toDate(),
              to: dateState.temp.endDate
                ? moment(dateState.temp.endDate).toDate()
                : undefined,
            }}
            onSelect={onCalendarSelect}
            numberOfMonths={1}
            components={{
              IconLeft: ({ ...props }) => (
                <IconButton disableRipple>
                  <CaretLeftIcon
                    color="#77469b"
                    className="h-6 w-6"
                    weight="bold"
                  />
                </IconButton>
              ),
              IconRight: ({ ...props }) => (
                <IconButton
                  disableRipple
                  disabled={
                    dateState.currentMonth.getMonth() ===
                    getTodayByTimeZone(timeZone).getMonth()
                  }
                >
                  <CaretRightIcon
                    color="#77469b"
                    className="h-6 w-6"
                    weight="bold"
                  />
                </IconButton>
              ),
            }}
          />

          {isNoEndDateRequired === true && (
            <div className="w-full p-3">
              <FormControlLabel
                label="No End Date"
                sx={{
                  margin: 0,

                  '& .MuiCheckbox-root': {
                    paddingTop: 0,
                    paddingRight: '0.8rem',
                    paddingLeft: '1rem',
                    paddingBottom: 0,

                    '&.Mui-checked': {
                      color: '#77469B',
                    },
                  },

                  '& .MuiTypography-root': {
                    fontSize: '1rem',
                    fontWeight: 400,
                    lineHeight: '144%',
                  },

                  '&.Mui-disabled': {
                    cursor: 'not-allowed',
                  },
                }}
                control={
                  <Checkbox
                    checked={isNoEndDateChecked}
                    onChange={handleChangeNoEndDate}
                    sx={{
                      '&.Mui-disabled': {
                        cursor: 'not-allowed',
                      },
                    }}
                  />
                }
              />
            </div>
          )}

          <div className="flex justify-end mr-2 my-3 items-center gap-[0.8rem]">
            <AltPrimaryButton
              buttonText="Cancel"
              buttonFunction={onCancel}
              disabled={false}
              height="3rem"
              stopPropagation={true}
              isNewDesign={true}
            />
            <PrimaryButton
              buttonText="Apply"
              buttonFunction={handleApply}
              disabled={
                frequencyOptions !== undefined &&
                setFrequencyState !== undefined &&
                setFrequency !== undefined
                  ? frequencyOptions?.every(
                      (option) => option.selected === false
                    ) === true ||
                    frequencyOptions?.some(
                      (option) => option.isDisabled && option.selected
                    ) === true
                  : false
              }
              height="3rem"
              stopPropagation={true}
              isNewDesign={true}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function DateRangeDisplay({
  dateRange,
  isNoEndDateChecked,
}: {
  dateRange: IDateRange;
  isNoEndDateChecked: boolean;
}) {
  return dateRange ? (
    <div className="flex items-center mt-3 justify-between w-full pointer-events-none">
      <span className="border border-[#dadeeb] ml-4 py-2 px-3 min-w-[8.2rem] rounded-[0.8rem]">
        {changeDateFormat(dateRange.startDate, DATE_FORMAT_3, DATE_FORMAT_19)}
      </span>
      <ArrowRightIcon />
      {isNoEndDateChecked === true && (
        <span className="border border-[#dadeeb] py-2 px-3 mr-2 min-w-[8.2rem] rounded-[0.8rem]">
          No End Date
        </span>
      )}
      {dateRange.endDate && (
        <span className="border border-[#dadeeb] py-2 px-3 mr-2 min-w-[8.2rem] rounded-[0.8rem]">
          {changeDateFormat(dateRange.endDate, DATE_FORMAT_3, DATE_FORMAT_19)}
        </span>
      )}
    </div>
  ) : null;
}
