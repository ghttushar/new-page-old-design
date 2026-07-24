import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  MIN_DEFAULT_DATE,
  WALMART_INDEFINITE_END_DATE,
} from '@/constants/advertising-walmart.constants';
import { DATE_FORMAT_13 } from '@/constants/datetime.constants';
import { TooltipPlacement } from '@/enums/tooltip-texts.enums';
import { getSelectedDateArrayLabel } from '@/utils';
import { getTodayByTimeZone } from '@/utils/datetime.utils';
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react';
import moment from 'moment';
import React, { useMemo, useState } from 'react';
import { DayPicker } from 'react-day-picker';
import { IDropdownItem } from '../../common/dropdown/dropdown';
import { inputLabelNewStyles } from '../../common/dropdown/dropdown-styles';
import OutLineDropdown from '../../common/dropdown/outline-dropdown';
import InfoIcon from '../../common/info-icon/info-icon';
import styles from './date-picker.module.scss';

const CALENDAR_CLASSES = {
  day: 'h-12 w-12 p-0 font-normal rounded-lg aria-selected:opacity-100 hover:bg-[#f0f0f0]',
  day_selected:
    'bg-[#77469b] hover:bg-[#77469b] focus:bg-[#77469b] !text-[white] !font-medium',
  day_today: 'text-[#77469b] font-bold rounded-lg rounded-r-lg',
  nav_button: 'h-7 w-7 !color-[#77469b] p-0 opacity-50 hover:opacity-100',
};

const NEW_CALENDAR_CLASSES = {
  day: 'h-12 w-12 p-0 text-[1rem] rounded-[8px] aria-selected:opacity-100 hover:bg-[linear-gradient(99.66deg,rgba(137,77,181,0.4)_4.22%,rgba(98,5,167,0.4)_89%)]',

  day_selected:
    'bg-[linear-gradient(99.66deg,rgba(137,77,181,1)_4.22%,rgba(98,5,167,1)_89%)] hover:bg-[linear-gradient(99.66deg,rgba(137,77,181,1)_4.22%,rgba(98,5,167,1)_89%)] text-white',

  day_today: 'text-[#77469b] font-medium',

  nav_button: 'h-7 w-7 text-[#77469b] p-0 opacity-50 hover:opacity-100',

  cell: 'h-9 w-9 text-center text-sm p-0 pr-[2.5rem] relative',
};

const THEME_COLOR = '#77469b';

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

interface IMultiSelectSingleCalendarWrapperProps {
  value: Array<string> | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onDateSelect: (dates: Array<string>) => void;
  minDate?: Date;
  customStyles?: React.CSSProperties;
  disabled?: boolean;
  maxDate?: Date;
  isChecked?: boolean;
  setIsChecked?: (value: boolean) => void;
  width?: string;
  height?: string;
  label?: string;
  labelTooltipTitle?: string;
  tooltipPosition?: TooltipPlacement;
  labelStyles?: React.CSSProperties;
  fontSize?: string | number;
  isNewDesign?: boolean;
}

export const MultiSelectSingleCalendarWrapper: React.FC<
  IMultiSelectSingleCalendarWrapperProps
> = ({
  value,
  isOpen,
  onOpenChange,
  onDateSelect,
  minDate,
  customStyles,
  disabled,
  maxDate,
  isChecked,
  setIsChecked,
  width,
  height,
  label,
  labelTooltipTitle,
  tooltipPosition = TooltipPlacement.Top,
  labelStyles,
  fontSize,
  isNewDesign,
}) => {
  const formattedLabel = useMemo(
    () => getSelectedDateArrayLabel(value),
    [value]
  );

  return (
    <Popover open={isOpen} onOpenChange={onOpenChange}>
      <PopoverTrigger
        asChild
        className="data-[state=open]:!border-[#77469b]"
        onClick={(e) => {
          if (disabled) e.preventDefault();
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <span
            style={{
              ...(isNewDesign
                ? inputLabelNewStyles
                : { fontSize: fontSize ?? '1.2rem' }),
              ...labelStyles,
            }}
          >
            {label ?? ''}
            {labelTooltipTitle !== '' && labelTooltipTitle !== undefined && (
              <InfoIcon title={labelTooltipTitle} position={tooltipPosition} />
            )}
          </span>

          <div
            className={`${isNewDesign ? styles.newInput : styles.input} ${
              disabled ? styles.disabled : ''
            } ${isOpen ? styles.active : ''}`}
            style={{
              height: height ?? '3rem',
            }}
          >
            <span
              style={
                !isNewDesign
                  ? {
                      color: value || isChecked ? '#000' : '#95979c',
                      fontSize: '1rem',
                      backgroundColor: 'white',
                      marginLeft: '-0.4rem',
                      width: width ? `calc(${width} - 5rem)` : '4.45rem',
                      transition: 'width 0.1s ease-in-out',
                      ...customStyles,
                    }
                  : { ...customStyles }
              }
              className={`${styles.labelText} ${
                isNewDesign ? styles.newValueTextStyles : ''
              } ${disabled ? styles.newValueTextDisabledStyles : ''}`}
              title={formattedLabel}
            >
              {formattedLabel}
            </span>
            <CalendarDays
              size={12}
              color={disabled ? '#C5C5C5' : undefined}
              style={{
                marginBottom: '0.15rem',
                flex: '0 0 auto',
              }}
            />
          </div>
        </div>
      </PopoverTrigger>
      <PopoverContent
        style={{
          height: 'auto',
          width: 'auto',
          backgroundColor: 'white',
          border: 'none',
          zIndex: '100',
          boxShadow: '0 0 0.4rem 0 rgba(0,0,0,0.2)',
          padding: '0',
          paddingRight: '1rem',
          WebkitUserSelect: 'none',
          userSelect: 'none',
        }}
        sideOffset={8}
        alignOffset={0}
        align="end"
      >
        <CustomMultiSelectSingleCalendar
          dateArray={value}
          setDateArray={onDateSelect}
          minDate={minDate}
          fromYear={2019}
          isChecked={isChecked ?? false}
          setIsChecked={setIsChecked ?? undefined}
          maxDate={maxDate}
        />
      </PopoverContent>
    </Popover>
  );
};

interface ICustomMultiSelectSingleCalendarProps {
  dateArray: Array<string> | null;
  setDateArray: (date: Array<string>) => void;
  minDate?: Date;
  fromYear?: number;
  toYear?: number;
  maxDate?: Date;
  isChecked?: boolean;
  setIsChecked?: (value: boolean) => void;
  isNewDesign?: boolean;
}

const CustomMultiSelectSingleCalendar = ({
  dateArray,
  setDateArray,
  minDate = new Date(MIN_DEFAULT_DATE),
  fromYear,
  toYear,
  maxDate,
  isChecked,
  setIsChecked,
  isNewDesign,
}: ICustomMultiSelectSingleCalendarProps) => {
  const [currentMonth, setCurrentMonth] = useState<Date>(
    new Date(
      dateArray && dateArray.length > 0 ? dateArray[0] : getTodayByTimeZone()
    )
  );

  const getYearOptions: IDropdownItem<string>[] = useMemo(() => {
    const start = fromYear || 1970;
    const end = toYear || 2099;

    return Array.from({ length: end - start + 1 }, (_, index) => {
      const year = (start + index).toString();
      return { value: year, label: year };
    });
  }, [fromYear, toYear]);

  const selectedDates = (
    dateArray: Array<string> | null
  ): Date[] | undefined => {
    if (dateArray && dateArray.length) {
      return dateArray.map((date) => new Date(date));
    } else return undefined;
  };

  const handleMonthChange = (
    month: Date | undefined,
    direction: 'next' | 'prev'
  ) => {
    if (month) {
      setCurrentMonth(month);
      return;
    }

    setCurrentMonth((current) => {
      const monthOffset = direction === 'next' ? 1 : 0;
      return new Date(
        current.getFullYear(),
        current.getMonth() + monthOffset,
        direction === 'next' ? 1 : 0
      );
    });
  };

  const handleDateSelection = (selectedDates: Array<Date> | undefined) => {
    const dateArray: string[] = [];
    if (selectedDates && selectedDates.length) {
      const sortedArray = selectedDates.sort(
        (a, b) => a.getTime() - b.getTime()
      );
      sortedArray.forEach((date) => {
        dateArray.push(moment(date).format(DATE_FORMAT_13));
      });
    }

    setDateArray(dateArray);
  };

  const onCheckboxChange = () => {
    if (setIsChecked) {
      isChecked === true && handleMonthChange(getTodayByTimeZone(), 'next');
      setIsChecked(!isChecked);
    }
  };

  const CalendarCaption = () => (
    <span className={styles.calendarHeader}>
      <ChevronLeft
        color={THEME_COLOR}
        className={styles.navIcon}
        onClick={() => handleMonthChange(undefined, 'prev')}
      />

      <span className="flex items-center gap-3">
        <span className={styles.monthLabel}>
          {moment(currentMonth).format('MMMM')}
        </span>

        <OutLineDropdown
          dropdownHeight="12rem"
          fontColor={THEME_COLOR}
          options={getYearOptions}
          selected={{
            value: currentMonth.getFullYear().toString(),
            label: currentMonth.getFullYear().toString(),
          }}
          width="5.5rem"
          background="white"
          onSelect={(value) => handleMonthChange(new Date(value.value), 'next')}
        />
      </span>

      <ChevronRight
        color={THEME_COLOR}
        className={styles.navIcon}
        onClick={() => handleMonthChange(undefined, 'next')}
      />
    </span>
  );

  return (
    <div
      className="rounded-[0.2rem] z-[100]"
      onClick={(e) => e.stopPropagation()}
    >
      <Calendar
        mode="multiple"
        initialFocus
        disabled={{
          before: isChecked ? getTodayByTimeZone() : minDate,
          after: isChecked ? getTodayByTimeZone() : maxDate,
        }}
        today={getTodayByTimeZone()}
        captionLayout="dropdown-buttons"
        selected={
          isChecked
            ? [new Date(WALMART_INDEFINITE_END_DATE)]
            : selectedDates(dateArray)
        }
        month={currentMonth}
        defaultMonth={moment(currentMonth.getMonth()).toDate()}
        classNames={{
          ...(isNewDesign ? NEW_CALENDAR_CLASSES : CALENDAR_CLASSES),
        }}
        onSelect={handleDateSelection}
        components={{
          Caption: CalendarCaption,
        }}
      />
    </div>
  );
};
