import { IDropdownItem } from '@/app/components/common/dropdown/dropdown';
import {
  DayOfMonthEnum,
  DayOfWeekEnum,
  HoursEnum,
  MinutesEnum,
} from '@/enums/datetime.enums';

export const FALLBACK_DATE_FORMAT = '';
export const DATE_FORMAT_1 = 'DD MMM';
export const DATE_FORMAT_2 = 'DD MMM YYYY';
export const DATE_FORMAT_3 = 'YYYY-MM-DD';
export const DATE_FORMAT_4 = 'DD/MM/YYYY';
export const DATE_FORMAT_5 = 'YYYY-MM-DD HH:mm:ss';
export const DATE_FORMAT_6 = 'DD/MM/YYYY HH:mm A z';
export const DATE_FORMAT_7 = 'YYYY-MM-DD HH:mm:ss z';
export const DATE_FORMAT_8 = 'YYYY-MM-DD | hh:mm A z';
export const DATE_FORMAT_9 = 'MMM';
export const DATE_FORMAT_10 = 'DD';
export const DATE_FORMAT_11 = 'YYYY';
export const DATE_FORMAT_12 = 'MM/DD/YYYY HH:mm:ss z';
export const DATE_FORMAT_13 = 'MM/DD/YYYY';
export const DATE_FORMAT_14 = 'MMMM D, YYYY, h:mm A';
export const DATE_FORMAT_15 = 'DD MMM YYYY, hh:mm A';
export const DATE_FORMAT_16 = 'MM/DD/YYYY, h:mm A';
export const DATE_FORMAT_17 = 'MMM DD, YYYY | h:mm:ss A z';
export const DATE_FORMAT_18 = 'MM/DD/YY';
export const DATE_FORMAT_19 = 'MMM DD, YYYY';
export const DATE_FORMAT_20 = 'MMM DD, YYYY | h:mm:ss A z';
export const DATE_FORMAT_21 = 'MMM YYYY';
export const DATE_FORMAT_22 = 'YYYY-MM';
export const DATE_FORMAT_23 = 'GGGG-[Week]-WW';
export const AMC_DATE_FORMAT = `YYYY-MM-DDTHH:mm:ss`;
export const ABBR_DAY_FORMAT = 'ddd';
export const TIME_FORMAT_1 = 'HH:mm:ss';
export const TIME_FORMAT_2 = 'HH:mm';
export const TIME_FORMAT_3 = 'hh:mm A';
export const TIME_FORMAT_4 = 'h:mm a';
export const DAY_FORMAT_1 = 'Do';
export const TIMEZONE_FORMAT = 'z';

export const HOURS_OPTIONS: IDropdownItem<string>[] = [
  {
    value: HoursEnum.HOUR_0,
    label: '00',
  },
  {
    value: HoursEnum.HOUR_1,
    label: '01',
  },
  {
    value: HoursEnum.HOUR_2,
    label: '02',
  },
  {
    value: HoursEnum.HOUR_3,
    label: '03',
  },
  {
    value: HoursEnum.HOUR_4,
    label: '04',
  },
  {
    value: HoursEnum.HOUR_5,
    label: '05',
  },
  {
    value: HoursEnum.HOUR_6,
    label: '06',
  },
  {
    value: HoursEnum.HOUR_7,
    label: '07',
  },
  {
    value: HoursEnum.HOUR_8,
    label: '08',
  },
  {
    value: HoursEnum.HOUR_9,
    label: '09',
  },
  {
    value: HoursEnum.HOUR_10,
    label: '10',
  },
  {
    value: HoursEnum.HOUR_11,
    label: '11',
  },
  {
    value: HoursEnum.HOUR_12,
    label: '12',
  },
  {
    value: HoursEnum.HOUR_13,
    label: '13',
  },
  {
    value: HoursEnum.HOUR_14,
    label: '14',
  },
  {
    value: HoursEnum.HOUR_15,
    label: '15',
  },
  {
    value: HoursEnum.HOUR_16,
    label: '16',
  },
  {
    value: HoursEnum.HOUR_17,
    label: '17',
  },
  {
    value: HoursEnum.HOUR_18,
    label: '18',
  },
  {
    value: HoursEnum.HOUR_19,
    label: '19',
  },
  {
    value: HoursEnum.HOUR_20,
    label: '20',
  },
  {
    value: HoursEnum.HOUR_21,
    label: '21',
  },
  {
    value: HoursEnum.HOUR_22,
    label: '22',
  },
  {
    value: HoursEnum.HOUR_23,
    label: '23',
  },
];

export const MINUTES_OPTIONS: IDropdownItem<string>[] = [
  {
    value: MinutesEnum.MINUTE_0,
    label: '00',
  },
  {
    value: MinutesEnum.MINUTE_15,
    label: '15',
  },
  {
    value: MinutesEnum.MINUTE_30,
    label: '30',
  },
  {
    value: MinutesEnum.MINUTE_45,
    label: '45',
  },
];

export const WEEKDAYS_OPTIONS: IDropdownItem<number>[] = [
  {
    value: DayOfWeekEnum.SUNDAY,
    label: 'S',
    isDisabled: false,
  },
  {
    value: DayOfWeekEnum.MONDAY,
    label: 'M',
    isDisabled: false,
  },
  {
    value: DayOfWeekEnum.TUESDAY,
    label: 'T',
    isDisabled: false,
  },
  {
    value: DayOfWeekEnum.WEDNESDAY,
    label: 'W',
    isDisabled: false,
  },
  {
    value: DayOfWeekEnum.THURSDAY,
    label: 'T',
    isDisabled: false,
  },
  {
    value: DayOfWeekEnum.FRIDAY,
    label: 'F',
    isDisabled: false,
  },
  {
    value: DayOfWeekEnum.SATURDAY,
    label: 'S',
    isDisabled: false,
  },
];

export const MONTH_DATES_OPTIONS: IDropdownItem<number>[] = [
  {
    value: DayOfMonthEnum.DAY_1,
    label: '1',
  },
  {
    value: DayOfMonthEnum.DAY_2,
    label: '2',
  },
  {
    value: DayOfMonthEnum.DAY_3,
    label: '3',
  },
  {
    value: DayOfMonthEnum.DAY_4,
    label: '4',
  },
  {
    value: DayOfMonthEnum.DAY_5,
    label: '5',
  },
  {
    value: DayOfMonthEnum.DAY_6,
    label: '6',
  },
  {
    value: DayOfMonthEnum.DAY_7,
    label: '7',
  },
  {
    value: DayOfMonthEnum.DAY_8,
    label: '8',
  },
  {
    value: DayOfMonthEnum.DAY_9,
    label: '9',
  },
  {
    value: DayOfMonthEnum.DAY_10,
    label: '10',
  },
  {
    value: DayOfMonthEnum.DAY_11,
    label: '11',
  },
  {
    value: DayOfMonthEnum.DAY_12,
    label: '12',
  },
  {
    value: DayOfMonthEnum.DAY_13,
    label: '13',
  },
  {
    value: DayOfMonthEnum.DAY_14,
    label: '14',
  },
  {
    value: DayOfMonthEnum.DAY_15,
    label: '15',
  },
  {
    value: DayOfMonthEnum.DAY_16,
    label: '16',
  },
  {
    value: DayOfMonthEnum.DAY_17,
    label: '17',
  },
  {
    value: DayOfMonthEnum.DAY_18,
    label: '18',
  },
  {
    value: DayOfMonthEnum.DAY_19,
    label: '19',
  },
  {
    value: DayOfMonthEnum.DAY_20,
    label: '20',
  },
  {
    value: DayOfMonthEnum.DAY_21,
    label: '21',
  },
  {
    value: DayOfMonthEnum.DAY_22,
    label: '22',
  },
  {
    value: DayOfMonthEnum.DAY_23,
    label: '23',
  },
  {
    value: DayOfMonthEnum.DAY_24,
    label: '24',
  },
  {
    value: DayOfMonthEnum.DAY_25,
    label: '25',
  },
  {
    value: DayOfMonthEnum.DAY_26,
    label: '26',
  },
  {
    value: DayOfMonthEnum.DAY_27,
    label: '27',
  },
  {
    value: DayOfMonthEnum.DAY_28,
    label: '28',
  },
  {
    value: DayOfMonthEnum.DAY_29,
    label: '29',
  },
  {
    value: DayOfMonthEnum.DAY_30,
    label: '30',
  },
  {
    value: DayOfMonthEnum.DAY_31,
    label: '31',
  },
];
