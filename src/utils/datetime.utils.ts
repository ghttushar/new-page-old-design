import {
  MAX_YEAR,
  WALMART_INDEFINITE_END_DATE,
} from '@/constants/advertising-walmart.constants';
import { SortOrderEnum } from '@/enums/advertising.enums';
import { Frequency, Range } from '@/enums/serp.enums';
import { TimezoneEnum } from '@/enums/timezone.enums';
import moment from 'moment';
import {
  ABBR_DAY_FORMAT,
  DATE_FORMAT_12,
  DATE_FORMAT_13,
  DATE_FORMAT_2,
  DATE_FORMAT_21,
  DATE_FORMAT_22,
  DATE_FORMAT_23,
  DATE_FORMAT_3,
  DATE_FORMAT_5,
  DATE_FORMAT_7,
  DATE_FORMAT_8,
  TIME_FORMAT_1,
  TIME_FORMAT_3,
  TIMEZONE_FORMAT,
} from 'src/constants/datetime.constants';
import { IDateRange } from 'src/interfaces/serp.interface';
import { formatDate, formatDateToIDateRange, getTimeZoneByCountry } from '.';

export const getFormattedCurrTimeZoneDate = (
  timestamp: string,
  format = DATE_FORMAT_7,
  countryCode?: string
) => {
  const pstDate = moment.tz(timestamp, getTimeZoneByCountry(countryCode));
  return pstDate.format(format);
};
export const convertUtcToTimezoneDate = (
  isoString: string,
  toFormat = DATE_FORMAT_12,
  fromFormat?: string
) => {
  const parsedMoment = fromFormat
    ? moment.utc(isoString, fromFormat)
    : moment.utc(isoString);

  return parsedMoment.tz(getTimeZoneByCountry()).format(toFormat);
};

export const getFormattedTimezoneDateTimeNoTimestamp = (timestamp: string) => {
  const timezoneDate = moment.tz(timestamp, getTimeZoneByCountry());
  return timezoneDate.format(DATE_FORMAT_8);
};

export const getFormattedTimezoneDateRange = (
  startDate: string,
  endDate: string,
  format: string = DATE_FORMAT_2
) => {
  const timezoneStartDate = moment
    .tz(startDate, getTimeZoneByCountry())
    .format(format);
  const timezoneEndDate = moment
    .tz(endDate, getTimeZoneByCountry())
    .format(format);
  const timezone = moment
    .tz(startDate, getTimeZoneByCountry())
    .format(TIMEZONE_FORMAT);
  return `${timezoneStartDate} - ${timezoneEndDate} | ${timezone}`;
};

export const isCustomDateRangeSet = (dateRange: IDateRange) => {
  return (
    dateRange !== undefined &&
    dateRange.startDate !== undefined &&
    dateRange.endDate !== undefined &&
    dateRange.startDate !== '' &&
    dateRange.endDate !== ''
  );
};

export const getCustomDateRange = (
  rangeType: string,
  customDateRange: IDateRange,
  fallbackCustomRange: IDateRange
) => {
  let dateRange: IDateRange | undefined;

  if (rangeType === Range.CUSTOM_RANGE) {
    if (isCustomDateRangeSet(customDateRange)) {
      dateRange = customDateRange;
    } else {
      dateRange = fallbackCustomRange;
    }
  } else {
    dateRange = undefined;
  }

  return dateRange;
};

export const getFormattedDay = (day: string) => {
  const fullDay = moment().day(day);
  const abbrDay = fullDay.format(ABBR_DAY_FORMAT);

  return abbrDay;
};

export const getFormattedTimezoneTimeRange = (
  startTime: string,
  endTime: string,
  fromFormat: string = TIME_FORMAT_1,
  toFormat: string = TIME_FORMAT_3
) => {
  const formattedStartTime = changeDateFormat(startTime, fromFormat, toFormat);
  const formattedEndTime = changeDateFormat(endTime, fromFormat, toFormat);

  let endDate = formattedEndTime;

  if (checkIsIndefiniteDate(endDate)) endDate = 'Not Set';

  return `${formattedStartTime} - ${endDate}`;
};

export const getUSFormatDate = (date: string) => {
  return moment(date).format(DATE_FORMAT_13);
};

export const changeDateFormat = (
  date: string,
  fromFormat: string,
  toFormat: string
) => {
  return moment(date, fromFormat).format(toFormat);
};

export const getDateFromTimestamp = (timestamp: string | undefined) => {
  if (!timestamp) {
    return '';
  }
  return timestamp.split('T')[0];
};

export const checkIsIndefiniteDate = (date: string) => {
  return (
    moment(date).isSameOrAfter(WALMART_INDEFINITE_END_DATE) ||
    date.includes(MAX_YEAR)
  );
};

export const getTimeFromTimestamp = (
  timestamp: string | undefined,
  timeFormat: string = TIME_FORMAT_3
) => {
  if (!timestamp) {
    return '';
  }
  return moment(timestamp).format(timeFormat);
};

export const removeZFromTimestamp = (timestamp: string | undefined): string => {
  if (!timestamp) {
    return '';
  }

  return timestamp.replace('Z', '');
};

export const getTimezoneTimeFromTimestamp = (
  timestamp: string | undefined,
  timeFormat: string = TIME_FORMAT_3
) => {
  if (!timestamp) {
    return '';
  }

  return moment(timestamp).tz(getTimeZoneByCountry()).format(timeFormat);
};

export const formatTimestampWithTimezone = (
  timestamp: string | undefined,
  timeFormat: string = TIME_FORMAT_3
) => {
  if (!timestamp) {
    return '';
  }
  // Just parse and format - no conversion
  return moment(timestamp).format(timeFormat);
};

export const getTimeFromMilitaryTimeStamp = (
  timestamp: string | number
): string => {
  const stringTimestamp = String(timestamp).trim();
  if (stringTimestamp === '' || isNaN(Number(stringTimestamp))) {
    return '-';
  }

  const paddedTime = stringTimestamp.padStart(4, '0');

  const timeWithColon = paddedTime.replace(/(\d{2})(\d{2})/, '$1:$2');

  return `${moment(timeWithColon, 'HH:mm').format('h:mm A')} PST`; //TODO:should pick it up after fixing backend
};
export const getFormattedDateWithFormat = (date: string, format: string) => {
  return moment(date).format(format);
};

export const getFormattedTimezoneDate = (
  timestamp: string,
  timezone = getTimeZoneByCountry(),
  format = DATE_FORMAT_7
) => {
  const timezoneDate = moment.tz(timestamp, timezone);
  return timezoneDate.format(format);
};

export const convertTo24HourFormat = (time: string): string => {
  const [hours, minutes] = time.split(':').map(Number);
  const formattedHours = hours < 10 ? `0${hours}` : `${hours}`;
  return `${formattedHours}:${minutes < 10 ? `0${minutes}` : minutes}`;
};

export const getRelativeTime = (dateString: string): string => {
  const now = new Date();
  const past = new Date(dateString);
  const diffMs = now.getTime() - past.getTime();

  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(diffMs / (1000 * 60));
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const months = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 30));
  const years = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 30 * 12));

  if (seconds < 5) return 'just now';
  if (seconds < 60) return 'a few seconds ago';
  if (minutes === 1) return 'a minute ago';
  if (minutes < 60) return `${minutes} minutes ago`;
  if (hours === 1) return 'an hour ago';
  if (hours < 24) return `${hours} hours ago`;
  if (days === 1) return 'yesterday';
  if (days < 30) return `${days} days ago`;
  if (months === 1) return 'a month ago';
  if (months < 12) return `${months} months ago`;
  if (years === 1) return `an year ago`;
  if (years > 1) return `${years} year ago`;

  return `${months} months ago`;
};

export const getAfterNDays = (date: string, n: number) => {
  const formattedDate = getFormattedTimezoneDate(date, DATE_FORMAT_3);
  return moment(formattedDate).add(n, 'day').format();
};

export const getTimeInUnitFromMs = (diffMs: number): string => {
  if (diffMs === null || diffMs === undefined) {
    return 'Invalid';
  }

  if (diffMs < 0 || !Number.isFinite(diffMs)) {
    return 'Invalid';
  }

  const duration = moment.duration(diffMs);

  const days = Math.floor(duration.asDays());
  const hours = Math.floor(duration.asHours()) % 24;
  const minutes = Math.floor(duration.asMinutes()) % 60;
  const seconds = Math.floor(duration.asSeconds()) % 60;
  const milliseconds = Math.floor(diffMs % 1000);

  const parts: string[] = [];

  if (days > 0) {
    parts.push(`${days}d`);
  }

  if (hours > 0) {
    parts.push(`${hours}hr`);
  }

  if (minutes > 0) {
    parts.push(`${minutes}min`);
  }

  if (seconds > 0) {
    parts.push(`${seconds}sec`);
  }

  if (milliseconds > 0) {
    parts.push(`${milliseconds}ms`);
  }

  if (parts.length === 0) {
    return `${milliseconds}ms`;
  }

  return parts.join(' ');
};

export const getAfterNDaysWithTimeZone = (
  n: number,
  endDate: string,
  timeZone: string
) => {
  return moment(endDate).tz(timeZone).add(n, 'days');
};

export const getDateWithTimeZone = (dateStr: string, timeZone: string) => {
  return moment(dateStr).tz(timeZone);
};

export const getTodayByTimeZone = (timeZone?: TimezoneEnum) => {
  return new Date(
    new Date().toLocaleString('en-US', {
      timeZone: timeZone ?? getTimeZoneByCountry(),
    })
  );
};

export const getIsDateBefore = (startDate: string, endDate: string) => {
  return moment(startDate).isBefore(endDate);
};

export const getEndOfDay = (date: Date) => {
  return moment(date).endOf('day');
};

export const getDiffBetweenTwoDates = (startDate: string, endDate: string) => {
  return moment(endDate).diff(moment(startDate));
};

export const getIsLessThanWeek = (diff: number) => {
  const duration = moment.duration(diff).asWeeks();
  return duration < 1;
};

export const getIsLessThanMonth = (diff: number) => {
  const duration = moment.duration(diff).asMonths();
  return duration < 1;
};
export const convertDateToEpochs = (date: string, threshold = 0): string =>
  `${moment(date).subtract(threshold, 'minutes').valueOf()}`;

export function getStartEndByFrequency(
  frequency: string,
  value: string,
  timezone = getTimeZoneByCountry(),
  year = getTodayByTimeZone().getFullYear()
) {
  if (frequency === Frequency.DAILY) {
    const startDate = moment.tz(value, DATE_FORMAT_13, timezone);
    const endDate = startDate.clone();
    return formatDateToIDateRange(startDate, endDate);
  }
  if (frequency === Frequency.WEEKLY) {
    const week = Number(value.split('-')[1]);
    const start = moment.tz(timezone).year(year).week(week).startOf('week');
    const end = start.clone().endOf('week');

    return formatDateToIDateRange(start, end);
  }

  const start = moment
    .tz(`${value} ${year}`, DATE_FORMAT_21, timezone)
    .startOf('month');
  const end = start.clone().endOf('month');

  return formatDateToIDateRange(start, end);
}
export const parseAsUtcAndConvert = (
  dateStr: string,
  toFormat = DATE_FORMAT_5
) => {
  return moment.parseZone(dateStr).utc().format(toFormat);
};

export const getDatesInRangeWithTimezone = (
  startDate: string,
  endDate: string | undefined,
  timezone: string = DATE_FORMAT_3
): string[] => {
  if (!startDate && !endDate) return [];
  if (!endDate) return [startDate];

  const dates: string[] = [];

  let current = moment.tz(startDate, timezone).startOf('day');
  const end = moment.tz(endDate, timezone).startOf('day');

  while (current.isSameOrBefore(end)) {
    dates.push(current.format('YYYY-MM-DD'));
    current = current.clone().add(1, 'day');
  }

  return dates;
};

export const getDateRangeFromArray = (
  rangeArray: string[] | undefined
): IDateRange => {
  if (!rangeArray || !rangeArray.length) return formatDate(Range.LAST_7_DAYS);

  if (rangeArray.length === 1)
    return {
      startDate: rangeArray[0],
      endDate: rangeArray[0],
    };

  return {
    startDate: rangeArray[0],
    endDate: rangeArray[rangeArray.length - 1],
  };
};

export const formatFilterDateValue = (value: string): string => {
  return moment(value).format(DATE_FORMAT_3);
};

export const isInvalidDateRange = (
  from: string | number,
  to: string | number
): boolean => {
  return (
    moment(String(from), DATE_FORMAT_13).unix() >=
    moment(String(to), DATE_FORMAT_13).unix()
  );
};

export const isDateSame = (
  date: string | Date,
  compareDate: string
): boolean => {
  return moment(date).isSame(compareDate, 'day');
};

export const isDateAfter = (
  date: string | Date,
  compareDate: string
): boolean => {
  return moment(date).isAfter(compareDate, 'day');
};

export const isDateBefore = (
  date: string | Date,
  compareDate: string
): boolean => {
  return moment(date).isBefore(compareDate, 'day');
};

export const isValidISO8601Date = (date: string): boolean => {
  return moment(date, moment.ISO_8601, true).isValid();
};

export const isDateBetween = (
  date: string | Date,
  from: string | number,
  to: string | number
): boolean => {
  return moment(date).isBetween(String(from), String(to), 'day');
};

export const formatYearMonth = (label: string) => {
  if (!label) return label;
  return moment(label, DATE_FORMAT_22).format(DATE_FORMAT_21);
};
export const formatYearWeek = (label: string) => {
  if (!label) return label;
  return label.split('-').slice(1).join('-');
};

export const getTimezoneShort = (timezone: string) => {
  if (!timezone) return timezone ?? '';

  return moment.tz(timezone).format(TIMEZONE_FORMAT);
};
export const checkIsValidDate = (dateStr: string) => moment(dateStr).isValid();

export const getSortedDates = (dates: string[], order = SortOrderEnum.DESC) => {
  const parse = (d: string) => {
    if (d.includes('Week')) {
      return moment(d, DATE_FORMAT_23).startOf('isoWeek');
    }
    if (d.length === 7) {
      return moment(d, DATE_FORMAT_22).startOf('month');
    }
    return moment(d, DATE_FORMAT_3);
  };

  return [...dates].sort((a, b) => {
    const diff = parse(a).valueOf() - parse(b).valueOf();
    return order === SortOrderEnum.ASC ? diff : -diff;
  });
};
