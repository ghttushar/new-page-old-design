import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  INDEFINITE,
  MIN_DEFAULT_DATE,
  WALMART_INDEFINITE_END_DATE,
} from '@/constants/advertising-walmart.constants';
import { DATE_FORMAT_3 } from '@/constants/datetime.constants';
import { getSelectedDateLabel } from '@/utils';
import { convertToTitleCase } from '@/utils/advertising.utils';
import { getTodayByTimeZone } from '@/utils/datetime.utils';
import { Checkbox } from '@mui/material';
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react';
import moment from 'moment';
import React, { useState } from 'react';
import { DayPicker } from 'react-day-picker';
import { IDropdownItem } from '../../common/dropdown/dropdown';
import OutLineDropdown from '../../common/dropdown/outline-dropdown';
import TextButton from '../../common/text-button/text-button';
import { confirmationPopupChannelCheckboxStyles } from '../../page-components/keyword-tracker-components/confirmation-pop-up/action-confirmation-popup-styles';
import styles from './date-picker.module.scss';

const CALENDAR_CLASSES = {
  day: 'h-12 w-12 p-0 font-normal rounded-lg aria-selected:opacity-100 hover:bg-[#f0f0f0]',
  day_selected:
    'bg-[#77469b] hover:bg-[#77469b] focus:bg-[#77469b] !text-[white] !font-medium',
  day_today: 'text-[#77469b] font-bold rounded-lg rounded-r-lg',
  nav_button: 'h-7 w-7 !color-[#77469b] p-0 opacity-50 hover:opacity-100',
};

const THEME_COLOR = '#77469b';

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

interface ICustomSingleDatePickerProps {
  date: string | null;
  setDate: (date: string) => void;
  minDate?: Date;
  fromYear: number;
  toYear: number;
  onOpenChange: (open: boolean) => void;
  maxDate?: Date;
  isChecked?: boolean;
  setIsChecked?: (value: boolean) => void;
}

const CustomSingleDatePicker = ({
  date,
  setDate,
  minDate = new Date(MIN_DEFAULT_DATE),
  fromYear,
  toYear,
  maxDate,
  onOpenChange,
  isChecked,
  setIsChecked,
}: ICustomSingleDatePickerProps) => {
  const [currentMonth, setCurrentMonth] = useState<Date>(
    new Date(date ?? getTodayByTimeZone())
  );

  const yearOptions: IDropdownItem<string>[] = Array.from(
    { length: toYear - fromYear + 1 },
    (_, index) => {
      const year = (fromYear + index).toString();
      return { value: year, label: year };
    }
  );

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

  const handleDateSelection = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setDate(moment(selectedDate).format(DATE_FORMAT_3));
    }
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
          options={yearOptions}
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
        mode="single"
        initialFocus
        disabled={{
          before: isChecked ? getTodayByTimeZone() : minDate,
          after: isChecked ? getTodayByTimeZone() : maxDate,
        }}
        today={getTodayByTimeZone()}
        captionLayout="dropdown-buttons"
        selected={
          isChecked
            ? new Date(WALMART_INDEFINITE_END_DATE)
            : date
            ? new Date(date)
            : undefined
        }
        month={currentMonth}
        defaultMonth={moment(currentMonth.getMonth()).toDate()}
        classNames={CALENDAR_CLASSES}
        onSelect={handleDateSelection}
        components={{
          Caption: CalendarCaption,
        }}
        footer={
          <div className={styles.footer}>
            <span
              onClick={onCheckboxChange}
              className={styles.checkbox}
              style={{
                visibility: setIsChecked ? 'visible' : 'hidden',
              }}
            >
              <Checkbox
                checked={isChecked}
                onChange={onCheckboxChange}
                sx={confirmationPopupChannelCheckboxStyles}
              />
              <span className="ml-[-0.5rem]">
                {convertToTitleCase(INDEFINITE)}
              </span>
            </span>
            <TextButton
              label="Today"
              handleClick={() => setDate(getTodayByTimeZone().toDateString())}
              isDisabled={isChecked}
              disableReason="Since Indefinite is checked today cannot be selected."
            />
          </div>
        }
      />
    </div>
  );
};

interface ISingleCalendarWrapperProps {
  value: string | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onDateSelect: (date: string) => void;
  minDate?: Date;
  customStyles?: React.CSSProperties;
  disabled?: boolean;
  maxDate?: Date;
  isChecked?: boolean;
  setIsChecked?: (value: boolean) => void;
  width?: string;
  height?: string;
  label?: string;
  fontSize?: string | number;
}

export const SingleCalendarWrapper: React.FC<ISingleCalendarWrapperProps> = ({
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
  fontSize,
}) => (
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
            fontSize: fontSize ?? '1.2rem',
          }}
        >
          {label ?? ''}
        </span>
        <div
          className={`${styles.input} ${disabled ? styles.disabled : ''} ${
            isOpen ? styles.active : ''
          }`}
          style={{
            height: height ?? '3rem',
          }}
        >
          <span
            style={{
              color: value || isChecked ? '#000' : '#95979c',
              fontSize: '1rem',
              backgroundColor: 'white',
              marginLeft: '-0.4rem',
              width: width ?? '4.45rem',
              transition: 'width 0.1s ease-in-out',
              ...customStyles,
            }}
          >
            {getSelectedDateLabel(value, isChecked)}
          </span>
          <CalendarDays
            size={12}
            style={{
              marginBottom: '0.15rem',
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
      <CustomSingleDatePicker
        date={value}
        setDate={onDateSelect}
        minDate={minDate}
        fromYear={2019}
        onOpenChange={onOpenChange}
        isChecked={isChecked ?? false}
        setIsChecked={setIsChecked ?? undefined}
        toYear={new Date(getTodayByTimeZone()).getFullYear()}
        maxDate={maxDate}
      />
    </PopoverContent>
  </Popover>
);
