import {
  RegionAccountConfigs,
  USAccountConfig,
} from '@/constants/advertising-amazon-region.constants';
import {
  INDEFINITE,
  WALMART_INDEFINITE_END_DATE,
} from '@/constants/advertising-walmart.constants';
import {
  AMAZON_ADVERTISING_PROFILE_ID_HEADER_KEY,
  WALMART_ADVERTISING_ID_HEADER_KEY,
} from '@/constants/auth.constants';
import {
  ISO_DATE_FORMAT,
  LEADING_ZERO_REGEX,
  STRING_DELIMITER_REGEX_FORMAT,
  STRING_DELIMITER_REGEX_WITHOUT_SPACE_FORMAT,
  TEXT_LEN_MAX_DEFAULT_LIMIT,
  TEXT_LEN_MIN_DEFAULT_LIMIT,
} from '@/constants/regex.constants';
import { FeatureRoutes, FeaturesEnum } from '@/enums/auth.enums';
import { PageTitleEnum } from '@/enums/index.enums';
import { LogsTitlesEnum } from '@/enums/logs.enums';
import { QueryKeyEnums } from '@/enums/query.enums';
import { Frequency, MarketplaceEnum, Range } from '@/enums/serp.enums';
import { TimezoneEnum } from '@/enums/timezone.enums';
import { IRegionAccountConfig } from '@/interfaces/advertising/amazon/amazon-advertising.interfaces';
import { IAdvertisingFilter } from '@/interfaces/advertising/amazon/sp-advertising.interface';
import { QueryClient } from '@tanstack/react-query';
import { PaginationState, Row, RowSelectionState } from '@tanstack/react-table';
import moment, { Moment } from 'moment';
import 'moment-timezone';
import Papa from 'papaparse';
import React from 'react';
import {
  currencyMetrics,
  numberMetrics,
  percentageMetrics,
} from 'src/constants/advertising-filter.constants';
import { amcRange } from 'src/constants/amc.constants';
import {
  DATE_FORMAT_10,
  DATE_FORMAT_11,
  DATE_FORMAT_13,
  DATE_FORMAT_17,
  DATE_FORMAT_18,
  DATE_FORMAT_19,
  DATE_FORMAT_22,
  DATE_FORMAT_3,
  DATE_FORMAT_4,
  DATE_FORMAT_5,
  DATE_FORMAT_6,
  DATE_FORMAT_7,
  DATE_FORMAT_8,
  DATE_FORMAT_9,
  DAY_FORMAT_1,
  TIME_FORMAT_4,
} from 'src/constants/datetime.constants';
import { sortedMonthsShort } from 'src/constants/index';
import {
  ONBOARDING_CONNECTING_PAGE,
  ONBOARDING_WMT_MARKETPLACE_URL,
} from 'src/constants/urls.constants';
import {
  AmazonWebsiteUrlEnum,
  CountryCodeEnum,
  OverallAccountLevelTitles,
  SbAccountLevelTitles,
  SbAdGroupLevelTitles,
  SbCampaignLevelTitles,
  SdAccountLevelTitles,
  SdAdGroupLevelTitles,
  SdCampaignLevelTitles,
  SortOrderEnum,
  SpAccountLevelTitles,
  SpAdGroupLevelTitles,
  SpCampaignLevelTitles,
  WalmartOverallAccountLevelTitles,
  WalmartSBAccountLevelTitles,
  WalmartSBAdGroupLevelTitles,
  WalmartSBCampaignLevelTitles,
  WalmartSPAccountLevelTitles,
  WalmartSPAdGroupLevelTitles,
  WalmartSPCampaignLevelTitles,
  WalmartSVAccountLevelTitles,
  WalmartSVAdGroupLevelTitles,
  WalmartSVCampaignLevelTitles,
} from 'src/enums/advertising.enums';
import { CatalogTabTitlesEnum } from 'src/enums/catalog.enums';
import {
  TargetingTypeEnum,
  WalmartAccountTypeEnum,
  WalmartClientTypeEnum,
} from 'src/enums/walmart.enums';
import {
  ICustomDateRange,
  IDateRangeInWords,
} from 'src/interfaces/amc.interfaces';
import { IGetFileNameDateTime, Nullable } from 'src/interfaces/index.interface';
import { IDateRange, ISovFilter } from 'src/interfaces/serp.interface';
import { IAdvertisingFilterForm } from 'src/redux/slices/advertising/advertising-filter.slice';
import { ISovFilterForm } from 'src/redux/slices/market-intelligence/sov-filter.slice';
import { v4 as uuidV4 } from 'uuid';
import {
  checkIsNull,
  checkIsObjectEmpty,
  convertToTitleCase,
  generateExportFileName,
  getAmazonAdType,
  getAsinsListStringified,
  getFormattedMetrics,
  getSDTactic,
  getSPBiddingStrategy,
  getWalmartAdType,
} from './advertising.utils';
import {
  changeDateFormat,
  checkIsIndefiniteDate,
  checkIsValidDate,
  formatYearMonth,
  formatYearWeek,
  getFormattedDateWithFormat,
  getFormattedTimezoneDate,
  getTodayByTimeZone,
  parseAsUtcAndConvert,
} from './datetime.utils';

import { IDropdownItem } from '@/app/components/common/dropdown/dropdown';
import {
  COGS_DOWNLOAD_TEMPLATE,
  WALMART_MARKETPLACE_REDIRECT_URL,
  WALMART_SUPPLIER_REDIRECT_URL,
} from '@/constants';
import {
  WMT_SELLER_CLIENT_ID,
  WMT_SUPPLIER_CLIENT_ID,
} from '@/constants/urls.constants';
import {
  ProfitabilityTableTitlesEnum,
  ProfitabilityTableTypeEnum,
} from '@/enums/profitability.enums';
import { IAdvertisingProfiles } from '@/interfaces/onboarding.interface';
import { IMenuItem } from '@/interfaces/side-bar/sidebar.interfaces';
import { imageUrls } from '../constants/assets/images.constants';
import localStorageUtils from './local-storage/local-storage.utils';
import { profitabilityUtils } from './profitability.utils';

export const getFormattedDate = (timestamp: string): string => {
  const pstDate = moment(timestamp).tz(getTimeZoneByCountry());
  const formattedDate = pstDate.format(DATE_FORMAT_6);

  const istDate = moment(timestamp).tz(TimezoneEnum.INDIA);
  const istFromattedDate = istDate.format(DATE_FORMAT_6);
  return `${formattedDate}\n${istFromattedDate}`;
};

export const getDateString = (timestamp: Date | undefined): string => {
  return moment(timestamp).format(DATE_FORMAT_5);
};

export const getDateTZString = (
  timestamp: Date | undefined,
  format: string = DATE_FORMAT_4
): string => {
  return moment(timestamp).format(format);
};

export const convertToPST = (dateString: string): string => {
  const date = moment.tz(dateString, DATE_FORMAT_5, getTimeZoneByCountry());
  return date.toISOString();
};

export const secondsSince = (startTime: Date): number => {
  const now = new Date(getTodayByTimeZone());
  const diff = (now.getTime() - startTime.getTime()) / 1000;
  return diff;
};

export const getPreviousRangeText = (
  filterData: ISovFilterForm | IAdvertisingFilterForm,
  filters: ISovFilter | IAdvertisingFilter
) => {
  let days;
  let startDate, endDate;
  let prevText;
  switch (filterData.range.value) {
    case 'TODAY':
      prevText = 'Yesterday';
      break;
    case 'YESTERDAY':
      prevText = 'Prev 1 day';
      break;
    case 'LAST_7_DAYS':
      prevText = 'Prev 7 days';
      break;
    case 'LAST_30_DAYS':
      prevText = 'Prev 30 days';
      break;
    case 'THIS_MONTH':
      prevText = 'Prev month';
      break;
    case 'LAST_MONTH':
      days = moment().subtract(2, 'months').daysInMonth();
      prevText = `Prev ${days} days`;
      break;
    case 'LAST_3_MONTHS':
      prevText = 'Prev 3 months';
      break;
    case 'THIS_YEAR':
      prevText = 'Last year';
      break;
    case 'LAST_YEAR': {
      const [startYear_prevYear, startMonth_prevYear, startDay_prevYear] =
        moment()
          .subtract(2, 'year')
          .startOf('year')
          .format(DATE_FORMAT_3)
          .split('-');
      const [endYear_prevYear, endMonth_prevYear, endDay_prevYear] = moment()
        .subtract(1, 'year')
        .startOf('year')
        .format(DATE_FORMAT_3)
        .split('-');
      startDate = moment([
        startYear_prevYear,
        startMonth_prevYear,
        startDay_prevYear,
      ]);
      endDate = moment([endYear_prevYear, endMonth_prevYear, endDay_prevYear]);
      days = endDate.diff(startDate, 'days');
      prevText = `Prev ${days} days`;
      break;
    }
    case 'CUSTOM_RANGE':
      if (
        filters?.range?.startDate !== undefined &&
        filters?.range?.endDate !== undefined
      ) {
        const [startYear_custom, startMonth_custom, startDay_custom] =
          filters.range.startDate.split('-');
        const [endYear_custom, endMonth_custom, endDay_custom] =
          filters.range.endDate.split('-');

        startDate = moment([
          startYear_custom,
          startMonth_custom,
          startDay_custom,
        ]);
        endDate = moment([endYear_custom, endMonth_custom, endDay_custom]);
        days = endDate.diff(startDate, 'days') + 1;
        prevText = `Prev ${days} days`;
      }
      break;
    default:
      prevText = 'Yesterday';
      break;
  }

  return prevText;
};
export const formatDateToIDateRange = (
  start: Moment,
  end: Moment
): IDateRange => {
  if (!start || !end)
    return {
      startDate: '',
      endDate: '',
    };
  return {
    startDate: moment(start).format(DATE_FORMAT_3),
    endDate: moment(end).format(DATE_FORMAT_3),
  };
};

export const formatDate = (
  range: string,
  marketplace = MarketplaceEnum.AMAZON,
  timeZone = getTimeZoneByCountry()
): IDateRange => {
  const now = moment().tz(timeZone);

  let start: Moment;
  let end: Moment;

  switch (range) {
    case Range.TODAY:
      start = now.clone().startOf('day');
      end = now.clone().endOf('day');
      break;
    case Range.YESTERDAY:
      start = now.clone().subtract(1, 'day').startOf('day');
      end = now.clone().subtract(1, 'day').endOf('day');
      break;
    case Range.LAST_7_DAYS:
      start = now.clone().subtract(7, 'days').startOf('day');
      end = now.clone().subtract(1, 'day').endOf('day');
      break;
    case Range.LAST_14_DAYS:
      start = now.clone().subtract(14, 'days').startOf('day');
      end = now.clone().subtract(1, 'day').endOf('day');
      break;
    case Range.LAST_21_DAYS:
      start = now.clone().subtract(21, 'days').startOf('day');
      end = now.clone().subtract(1, 'day').endOf('day');
      break;
    case Range.LAST_30_DAYS:
      start = now.clone().subtract(30, 'days').startOf('day');
      end = now.clone().subtract(1, 'day').endOf('day');
      break;
    case Range.THIS_MONTH:
      start = now.clone().startOf('month');
      end =
        now.clone().subtract(1, 'day').month() !==
        now.clone().startOf('month').month()
          ? start
          : marketplace === MarketplaceEnum.AMAZON
          ? now.clone().endOf('day')
          : now.clone().subtract(1, 'day');
      break;
    case Range.LAST_MONTH:
      start = now.clone().subtract(1, 'month').startOf('month');
      end = now.clone().subtract(1, 'month').endOf('month');
      break;
    case Range.LAST_3_MONTHS:
      start = now.clone().subtract(3, 'months').startOf('month');
      end = now.clone().subtract(1, 'month').endOf('month');
      break;
    case Range.THIS_YEAR:
      start = now.clone().startOf('year');
      end =
        now.clone().subtract(1, 'day').year() !==
        now.clone().startOf('year').year()
          ? now.clone().startOf('month')
          : marketplace === MarketplaceEnum.AMAZON
          ? now.clone().endOf('day')
          : now.clone().subtract(1, 'day').endOf('day');
      break;
    case Range.LAST_YEAR:
      start = now.clone().subtract(1, 'year').startOf('year');
      end = now.clone().subtract(1, 'year').endOf('year');
      break;
    case Range.THIS_QUARTER:
      start = now.clone().startOf('quarter');
      end = now.clone();
      break;
    case Range.LAST_QUARTER:
      start = now.clone().subtract(1, 'quarters').startOf('quarter');
      end = now.clone().subtract(1, 'quarters').endOf('quarter');
      break;
    case Range.TWO_QUARTERS_AGO:
      start = now.clone().subtract(2, 'quarters').startOf('quarter');
      end = now.clone().subtract(2, 'quarters').endOf('quarter');
      break;
    case Range.THREE_QUARTERS_AGO:
      start = now.clone().subtract(3, 'quarters').startOf('quarter');
      end = now.clone().subtract(3, 'quarters').endOf('quarter');
      break;
    case Range.THIS_WEEK:
      start = now.clone().startOf('week');
      end = now.clone().endOf('week');
      break;
    case Range.LAST_WEEK:
      start = now.clone().subtract(1, 'week').startOf('week');
      end = now.clone().subtract(1, 'week').endOf('week');
      break;
    case Range.TWO_MONTHS_AGO:
      start = now.clone().subtract(2, 'months').startOf('month');
      end = now.clone().subtract(2, 'months').endOf('month');
      break;
    case Range.THREE_MONTHS_AGO:
      start = now.clone().subtract(3, 'months').startOf('month');
      end = now.clone().subtract(3, 'months').endOf('month');
      break;
    case Range.TWO_DAYS_AGO:
      start = now.clone().subtract(2, 'days').startOf('day');
      end = now.clone().subtract(2, 'days').endOf('day');
      break;
    case Range.THREE_DAYS_AGO:
      start = now.clone().subtract(3, 'days').startOf('day');
      end = now.clone().subtract(3, 'days').endOf('day');
      break;
    case Range.SEVEN_DAYS_AGO:
      start = now.clone().subtract(7, 'days').startOf('day');
      end = now.clone().subtract(7, 'days').endOf('day');
      break;
    case Range.EIGHT_DAYS_AGO:
      start = now.clone().subtract(8, 'days').startOf('day');
      end = now.clone().subtract(8, 'days').endOf('day');
      break;
    case Range.THIRTY_DAYS_AGO:
      start = now.clone().subtract(30, 'days').startOf('day');
      end = now.clone().subtract(30, 'days').endOf('day');
      break;
    case Range.TWO_WEEKS_AGO:
      start = now.clone().subtract(2, 'weeks').startOf('week');
      end = now.clone().subtract(2, 'weeks').endOf('week');
      break;
    case Range.THREE_WEEKS_AGO:
      start = now.clone().subtract(3, 'weeks').startOf('week');
      end = now.clone().subtract(3, 'weeks').endOf('week');
      break;
    case Range.LAST_3_DAYS:
      start = now.clone().subtract(3, 'days').startOf('day');
      end = now.clone().subtract(1, 'days').endOf('day');
      break;
    case Range.LAST_28_DAYS:
      start = now.clone().subtract(28, 'days').startOf('day');
      end = now.clone().subtract(1, 'days').endOf('day');
      break;
    case Range.LAST_31_DAYS:
      start = now.clone().subtract(31, 'days').startOf('day');
      end = now.clone().subtract(1, 'days').endOf('day');
      break;
    case Range.LAST_3_DAYS_FROM_TODAY:
      start = now.clone().subtract(3, 'days').startOf('day');
      end = now.clone().endOf('day');
      break;
    case Range.LAST_7_DAYS_FROM_TODAY:
      start = now.clone().subtract(7, 'days').startOf('day');
      end = now.clone().endOf('day');
      break;
    case Range.LAST_30_DAYS_FROM_TODAY:
      start = now.clone().subtract(30, 'days').startOf('day');
      end = now.clone().endOf('day');
      break;
    case Range.LAST_180_DAYS_FROM_TODAY:
      start = now.clone().subtract(180, 'days').startOf('day');
      end = now.clone().endOf('day');
      break;
    case Range.LAST_6_MONTHS:
      start = now.clone().subtract(6, 'months').startOf('month');
      end = now.clone().subtract(1, 'month').endOf('month');
      break;

    default:
      start = moment();
      end = moment();
  }

  return formatDateToIDateRange(start, end);
};
export const formatDisplayRange = (
  dateRange: IDateRange,
  toFormat = DATE_FORMAT_19,
  isNoEndDateChecked = false
) => {
  if (dateRange.endDate === dateRange.startDate)
    return `${changeDateFormat(dateRange.startDate, DATE_FORMAT_3, toFormat)}`;
  return `${changeDateFormat(dateRange.startDate, DATE_FORMAT_3, toFormat)} - 
     ${
       isNoEndDateChecked
         ? 'No End Date'
         : !dateRange.endDate
         ? 'No Date Selected'
         : dateRange.endDate &&
           changeDateFormat(dateRange.endDate, DATE_FORMAT_3, toFormat)
     }`;
};

export const getColor = (index: number): string => {
  const colors = [
    '#77469B',
    '#F26E77',
    '#0DAA7B',
    '#0060F0',
    '#E377C2',
    '#FFC300',
    '#E75300',
    '#1F77B4',
    '#FF7F0E',
    '#07D1DE',
    '#EFD9FF',
  ];

  return colors[index];
};

export const randomColorGenerator = () => {
  let color = '#';
  const digits = '0123456789ABCDEF';

  for (let i = 0; i < 6; i++) {
    const randomDigit = Math.floor(Math.random() * 16);
    color += digits[randomDigit];
  }

  return color;
};

export function hexToRGBA(hex: string, alpha: number) {
  if (alpha < 0 || alpha > 1) return;

  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const a = alpha || 1;

  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

export const calculateLuminance = (hexColor: string, alpha: number) => {
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);

  if (alpha >= 1) {
    return (0.299 * r + 0.587 * g + 0.114 * b) / 255; // Luminance formula
  } else {
    const linearR = r / 255;
    const linearG = g / 255;
    const linearB = b / 255;
    return (0.2126 * linearR + 0.7152 * linearG + 0.0722 * linearB) * alpha;
  }
};

export const getFontColor = (hexColor: string, alpha: number) => {
  const luminance = calculateLuminance(hexColor, alpha);
  return luminance > 0.5 ? hexColor : '#fff';
};

export const formatNum = (
  num: number | string | null | undefined,
  isFraction = !Number.isInteger(Number(num))
): number | string => {
  const value = Number(num);
  if (isNaN(value) || num === undefined || num === null) {
    return '-';
  }
  const semiFormattedValue = parseFloat(value.toFixed(2));
  const formatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: isFraction ? 2 : 0,
    maximumFractionDigits: 2,
  });
  return formatter.format(semiFormattedValue);
};

export const reverseFormattedNumToNumber = (formattedNum: string | number) => {
  if (typeof formattedNum === 'number') return formattedNum;

  const parts = new Intl.NumberFormat('en-US').formatToParts(12345.6);
  const group = parts.find((part) => part.type === 'group')?.value || ',';
  const decimal = parts.find((part) => part.type === 'decimal')?.value || '.';

  const normalizedNum = formattedNum
    .replace(new RegExp(`\\${group}`, 'g'), '')
    .replace(new RegExp(`\\${decimal}`), '.');

  return parseFloat(normalizedNum);
};

export const getFormattedRangeFreq = (
  frequency?: string,
  range?: IDateRange,
  startDate?: string,
  endDate?: string
) => {
  const formattedFrequency = getTitleCaseString(frequency ?? '');
  let formattedRange = '';

  let formattedStartMonth,
    formattedEndMonth,
    formattedStartDate,
    formattedEndDate;
  if (startDate && endDate) {
    formattedStartMonth = moment(startDate).format(DATE_FORMAT_9);
    formattedEndMonth = moment(endDate).format(DATE_FORMAT_9);
    formattedStartDate = moment(startDate).format(DATE_FORMAT_10);
    formattedEndDate = moment(endDate).format(DATE_FORMAT_10);
  } else if (range?.startDate && range?.endDate) {
    formattedStartMonth = moment(range?.startDate).format(DATE_FORMAT_9);
    formattedEndMonth = moment(range?.endDate).format(DATE_FORMAT_9);
    formattedStartDate = moment(range?.startDate).format(DATE_FORMAT_10);
    formattedEndDate = moment(range?.endDate).format(DATE_FORMAT_10);
  }

  if (formattedStartMonth === formattedEndMonth) {
    if (formattedStartDate === formattedEndDate) {
      formattedRange = `${formattedStartMonth} ${formattedStartDate}`;
    } else {
      formattedRange = `${formattedStartMonth} (${formattedStartDate} - ${formattedEndDate})`;
    }
  } else {
    formattedRange = `${formattedStartMonth} ${formattedStartDate} - ${formattedEndMonth} ${formattedEndDate}`;
  }

  return `${formattedRange} (${formattedFrequency})`;
};

export const getFileNameDateTime = (filters: IGetFileNameDateTime) => {
  if (checkIsNull(filters)) return generateExportFileName('');
  const { range, frequency, rangeType } = filters;
  let formattedRange = '';
  const finalRange =
    rangeType === Range.CUSTOM_RANGE ? range : formatDate(rangeType ?? '');

  const startMonth = moment(finalRange?.startDate)
    .format(DATE_FORMAT_9)
    .toLowerCase();
  const endMonth = moment(finalRange?.endDate)
    .format(DATE_FORMAT_9)
    .toLowerCase();
  const startDate = moment(finalRange?.startDate).format(DATE_FORMAT_10);
  const endDate = moment(finalRange?.endDate).format(DATE_FORMAT_10);

  if (startMonth === endMonth) {
    if (startDate === endDate) {
      formattedRange = `${startMonth}_${startDate}`;
    } else {
      formattedRange = `${startMonth}_${startDate}-${endDate}`;
    }
  } else {
    formattedRange = `${startMonth}_${startDate}-${endMonth}_${endDate}`;
  }

  return `${formattedRange}_${frequency}`;
};

export const getCurrentDateTime = () => {
  const currentDateTime = getDateString(new Date(getTodayByTimeZone())).split(
    ' '
  );
  const currentTime = currentDateTime[1].split(':').join('-');
  return `${currentDateTime[0]}_${currentTime}`;
};

export const getYesterdayDate = () => {
  return moment().subtract(1, 'day').format(DATE_FORMAT_3);
};

export const getInitialImpactDate = () => {
  return moment().subtract(2, 'day').format(DATE_FORMAT_3);
};

export const isPositive = (num: number) => {
  return num >= 0;
};

export const getFormattedCompactNumbers = (num: number) => {
  return Intl.NumberFormat('en-US', {
    notation: 'compact',
    compactDisplay: 'short',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(Number(num));
};

export const parseNum = (num: unknown) => {
  const value = Number(num);
  if (isNaN(value)) return 0;

  return value;
};

export const getDateRangeText = (startDate: string, endDate: string) => {
  let formattedRange = '';

  const startMonth = moment(startDate).format(DATE_FORMAT_9);
  const endMonth = moment(endDate).format(DATE_FORMAT_9);
  const _startDate = moment(startDate).format(DATE_FORMAT_10);
  const _endDate = moment(endDate).format(DATE_FORMAT_10);
  const startYear = moment(startDate).format(DATE_FORMAT_11);
  const endYear = moment(endDate).format(DATE_FORMAT_11);

  if (startYear === endYear) {
    if (startMonth === endMonth) {
      if (_startDate === _endDate) {
        formattedRange = `${startMonth} ${_startDate}, ${startYear}`;
      } else {
        formattedRange = `${endMonth} ${_startDate}-${_endDate}, ${endYear}`;
      }
    } else {
      formattedRange = `${_startDate} ${startMonth}-${_endDate} ${endMonth}, ${endYear}`;
    }
  } else {
    formattedRange = `${_startDate} ${startMonth}, ${startYear}-${_endDate} ${endMonth}, ${endYear}`;
  }

  return `${formattedRange}`;
};

export const getSortedMonthsShort = (monthsArray: string[]): string[] => {
  return monthsArray.sort(function (a, b) {
    return sortedMonthsShort.indexOf(a) - sortedMonthsShort.indexOf(b);
  });
};

export const getSortedWeeks = (weeksArray: string[]): string[] => {
  return weeksArray.sort(function (a, b) {
    const weekA = a.split('-')[1];
    const weekB = b.split('-')[1];
    return parseNum(weekA) - parseNum(weekB);
  });
};

export const getPSTTime = (utcHour: number) => {
  const pstTime = moment
    .utc()
    .hour(utcHour)
    .tz(getTimeZoneByCountry())
    .format('hh:00 A (z)');
  return pstTime;
};

export const getUTCTime = (utcHour: number) => {
  const utcTime = moment.utc().hour(utcHour).format('hh:00 A (z)');
  return utcTime;
};

export const getISODateTime = (date?: string, time?: string) => {
  let _date = '';
  let _time = '';

  if (!date) {
    _date = getCurrentDateTime().split('_')[0];
  } else {
    _date = date;
  }

  if (!time) {
    _time = getCurrentDateTime().split('_')[1].split('-').join(':');
  } else {
    _time = time;
  }

  const [year, month, day] = _date.split('-').map((item) => parseInt(item));
  const [hours, minutes] = _time.split(':').map((item) => parseInt(item));

  const dateString = new Date(Date.UTC(year, month - 1, day, hours, minutes));
  return dateString.toISOString();
};
export const getDateRangeInWords = (
  startDate: Date,
  endDate: Date
): IDateRangeInWords | ICustomDateRange => {
  const startMoment = moment(startDate);
  const endMoment = moment(endDate);

  const diffInDays = endMoment.diff(startMoment, 'days');
  switch (true) {
    case diffInDays === 0:
      return amcRange[0];
    case diffInDays === 1:
      return amcRange[1];
    case diffInDays === 7:
      return amcRange[2];
    case diffInDays === 30:
      return amcRange[3];
    case endMoment.isSame(startMoment, 'month'):
      return amcRange[4];
    case endMoment.subtract(1, 'month').isSame(startMoment, 'month'):
      return amcRange[5];
    case endMoment.isSameOrAfter(startMoment.subtract(2, 'months'), 'month'):
      return amcRange[6];
    case endMoment.isSame(startMoment, 'year'):
      return amcRange[7];
    case endMoment.subtract(1, 'year').isSame(startMoment, 'year'):
      return amcRange[8];
    default:
      return {
        startDate: startMoment.format(DATE_FORMAT_3),
        endDate: endMoment.format(DATE_FORMAT_3),
      };
  }
};

export const getCurrentTimeWithAMPM = () => {
  const now = new Date(getTodayByTimeZone());
  let hours = now.getHours();
  const minutes = now.getMinutes();
  const ampm = hours >= 12 ? 'pm' : 'am';

  hours = hours % 12;
  hours = hours ? hours : 12;
  const minutesStr = minutes < 10 ? '0' + minutes : minutes;

  return hours + ':' + minutesStr + ' ' + ampm;
};

export const addUniqueIdsToData = <T>(data: T[]): T[] => {
  let id = 0;
  return data.map((instance) => {
    id += 1;
    return {
      id,
      ...instance,
    };
  }) as unknown as T[];
};

export const formatDataToDownload = <T extends Record<string, any>>(
  data: T[],
  disableFormatting = false
) => {
  if (disableFormatting) return data;
  const formattedData = data.map((instance) => {
    const formattedInstance: any = { ...instance };
    Object.keys(instance).forEach((key) => {
      const value = instance[key];
      if (value === null || value === '') {
        formattedInstance[key] = '-';
      } else if (typeof value === 'boolean') {
        formattedInstance[key] = `${value}`;
      }
      // TODO: will be needed later
      // else if (Array.isArray(value)) {
      //   formattedInstance[key] =
      // } else if (typeof value === 'object' && !Array.isArray(value)) {
      //   formattedInstance[key] =
      // }
      else if (isNaN(Number(value))) {
        if (typeof value === 'string') {
          formattedInstance[key] = value.replace(/"/g, '');
        } else {
          formattedInstance[key] = value;
        }
      } else {
        if (percentageMetrics.includes(key)) {
          formattedInstance[key] = displayValue(formatNum(value), true);
        } else if (currencyMetrics.includes(key)) {
          formattedInstance[key] = displayValue(formatNum(value), false);
        } else if (numberMetrics.includes(key)) {
          formattedInstance[key] = formatNum(value, false);
        } else {
          formattedInstance[key] = value;
        }
      }
    });
    return formattedInstance;
  });
  return formattedData;
};

export const parseDataBasedOnTargetingType = <T extends Record<string, any>>(
  data: T,
  isManual?: boolean,
  isAccountLevel?: boolean
) => {
  if (isAccountLevel) {
    return {
      'Item ID': data.itemId,
      'Product Name': data.itemName,
      'Product SKU': data.sku,
      Keyword: data.keyword,
      'Keyword ID': data.keywordId,
      'Match Type': data.matchType,
    };
  } else {
    if (isManual === true) {
      return {
        Keyword: data.keyword,
        'Keyword ID': data.keywordId,
        'Match Type': data.matchType,
      };
    }
    return {
      'Item ID': data.itemId,
      'Product Name': data.itemName,
      'Product SKU': data.sku,
    };
  }
};

export const parseAmazonMetricsExportData = <T extends Record<string, any>>(
  data: T
) => {
  const parsedMetrics = {
    Impressions: data.impressions,
    Clicks: data.clicks,
    CTR: data.ctr,
    'Units Sold': data.unitsSold,
    CVR: data.cvr,
    CPC: data.cpc,
    'Ad Spend': data.adSpend,
    'Ad Sales': data.adSales,
    ROAS: data.roas,
    ACOS: data.acos,
  };

  return parsedMetrics;
};

export const parseWalmartInstoreMetricsExportData = <
  T extends Record<string, any>
>(
  data: T
) => {
  const parsedMetrics = {
    'In-Store Attributes Sales': data.inStoreAttributedSales,
    'In-Store Advertised Sales': data.inStoreAdvertisedSales,
    'In-Store Other Sales': data.inStoreOtherSales,
    'In-Store Units Sold': data.inStoreUnitsSold,
    'In-Store Orders': data.inStoreOrders,
    'Omnichannel Sales': data.omniChannelSales,
    'Omnichannel ROAS': data.omniChannelRoas,
  };
  return parsedMetrics;
};

export const parseWalmartMetricsExportData = <T extends Record<string, any>>(
  data: T
) => {
  const parsedMetrics = {
    Impressions: data.impressions,
    Clicks: data.clicks,
    CTR: data.ctr,
    'Ad Units': data.unitsSold,
    'Ad Orders': data.adOrders,
    'CVR (Units Based)': data.cvrUnitsSoldBased,
    'CVR (Orders Based)': data.cvrOrdersSoldBased,
    CPC: data.cpc,
    'Ad Spend': data.adSpend,
    'Ad Sales': data.adSales,
    'Advertised SKU Sales': data.advertisedSkuSales,
    'Other SKU Sales': data.otherSkuSales,
    'Advertised SKU Units': data.advertisedSkuUnits,
    'Other SKU Units': data.otherSkuUnits,
    ROAS: data.roas,
    ACOS: data.acos,
    'NTB Units': data.ntbUnits,
    'NTB Orders': data.ntbOrders,
    'NTB Sales': data.ntbSales,
    'Percent NTB Units': data.percentNtbUnits,
    'Percent NTB Orders': data.percentNtbOrders,
    'Percent NTB Sales': data.percentNtbSales,
  };

  return parsedMetrics;
};

export const parseWalmartVideoMetricsExportData = <
  T extends Record<string, any>
>(
  data: T
) => {
  const parsedMetrics = {
    'Complete View Ad Orders': data.completeViewOrders,
    'Complete View Ad Units': data.completeViewAdUnits,
    'Video Complete Views': data.videoCompleteViews,
    'Video First Quartile Views': data.videoFirstQuartileViews,
    'Video Impressions': data.videoImpressions,
    'Video Midpoint Views': data.videoMidpointViews,
    'Video Third Quartile Views': data.videoThirdQuartileViews,
    'Video Unmutes': data.videoUnmutes,
    'Video 5 Second Views': data.video5SecondViews,
    'Viewable Impressions': data.viewableImpressions,
    'View-Through Ad Orders': data.viewThroughAdOrders,
    'View-Through Ad Sales': data.viewThroughAdSales,
    'View-Through Ad Units': data.viewThroughAdUnits,
    'Complete View Ad Sales': data.completeViewAdSales,
    'Other Complete View Ad Sales': data.otherCompleteViewAdSales,
    VTR: data.vtr,
    vCTR: data.vctr,
    'Video 5 Second View Rate': data.video5SecondViewRate,
  };

  return parsedMetrics;
};

export const getTitleCaseString = (str: string | undefined | null): string => {
  if (!str) return '-';
  let formattedStr = str;

  const checkUnderscore = formattedStr.includes('_');
  if (checkUnderscore) formattedStr = str.split('_').join(' ');

  const strArray = formattedStr.split(' ');
  const formattedStrArray: string[] = [];

  strArray.forEach((str) => {
    if (str) {
      str = str[0]?.toUpperCase() + str.slice(1)?.toLowerCase();
      formattedStrArray.push(str);
    }
  });

  if (!formattedStrArray.length) return '-';
  return formattedStrArray.join(' ');
};

export const parseTableExportData = <T extends Record<string, any>>(
  data: T[],
  title: string,
  accountType?: string,
  marketplace?: MarketplaceEnum
) => {
  if (data.length) {
    const parsedExportData = data.map((instance) => {
      let parsedInstanceData: Record<string, any> = {};

      switch (title) {
        case SpAccountLevelTitles.CAMPAIGNS: {
          const biddingStrategy = getSPBiddingStrategy(
            instance.dynamicBidding?.strategy
          );
          parsedInstanceData = {
            'Campaign Name': instance.campaignName,
            'Campaign ID': instance.campaignId,
            Status: getTitleCaseString(instance.status),
            'Targeting Type': getTitleCaseString(instance.targetingType),
            'Start Date': moment(instance.startDate).format(DATE_FORMAT_13),
            'End Date':
              instance.endDate === '-' || instance.endDate === undefined
                ? 'No Date'
                : moment(instance.endDate).format(DATE_FORMAT_13),
            Budget: `${displayValue(
              formatNum(instance.budget?.budget),
              false
            )}`,
            'Out of Budget Time': `${
              instance.outOfBudgetTime === '-' ||
              instance.outOfBudgetTime === undefined
                ? '-'
                : changeDateFormat(
                    instance.outOfBudgetTime,
                    DATE_FORMAT_7,
                    DATE_FORMAT_8
                  )
            }`,
            'Dynamic Bidding':
              biddingStrategy !== null &&
              biddingStrategy !== undefined &&
              Object.keys(biddingStrategy)?.length
                ? biddingStrategy.label
                : instance.dynamicBidding?.strategy,
            ...parseAmazonMetricsExportData(instance),
          };

          break;
        }

        case SpAccountLevelTitles.AD_GROUPS:
        case SpCampaignLevelTitles.AD_GROUPS:
          parsedInstanceData = {
            'AdGroup Name': instance.adGroupName,
            'AdGroup ID': instance.adGroupId,
            Status: getTitleCaseString(instance.status),
            'Campaign Name': instance.campaignName,
            'Campaign ID': instance.campaignId,
            'Campaign Status': instance.campaignStatus || '-',
            'Default Bid': instance.defaultBid,
            'Max Bid': instance.maxBid,
            'Min Bid': instance.minBid,
            TROAS: instance.troas,
            'Bidder Status': convertToTitleCase(instance.bidderStatus),
            ...parseAmazonMetricsExportData(instance),
          };
          break;

        case SpAccountLevelTitles.PRODUCT_ADS:
        case SpCampaignLevelTitles.PRODUCT_ADS:
        case SpAdGroupLevelTitles.PRODUCT_ADS:
          parsedInstanceData = {
            'Item Name': instance.itemName,
            ASIN: instance.asin,
            'Ads Eligibility': instance.eligibility,
            'Ad ID': instance.adId,
            Status: getTitleCaseString(instance.status),
            'AdGroup Name': instance.adGroupName,
            'AdGroup ID': instance.adGroupId,
            'AdGroup Status': instance.adGroupStatus || '-',
            'Listing Price': instance.listingPrice,
            'Campaign Name': instance.campaignName,
            'Campaign ID': instance.campaignId,
            'Campaign Status': instance.campaignStatus || '-',
            ...parseAmazonMetricsExportData(instance),
          };
          break;

        case SpAccountLevelTitles.KEYWORD_TARGETING:
        case SpCampaignLevelTitles.KEYWORD_TARGETING:
          parsedInstanceData = {
            'Keyword Text': instance.keywordText,
            'Keyword ID': instance.keywordId,
            Status: getTitleCaseString(instance.status),
            'AdGroup Name': instance.adGroupName,
            'AdGroup ID': instance.adGroupId,
            'AdGroup Status': instance.adGroupStatus || '-',
            'Campaign Name': instance.campaignName,
            'Campaign ID': instance.campaignId,
            'Campaign Status': instance.campaignStatus || '-',
            'Match type': instance.matchType,
            Bid: instance.bid,
            'Max Bid': instance.maxBid,
            'Min Bid': instance.minBid,
            TROAS: instance.troas,
            'Bidder Status': convertToTitleCase(instance.bidderStatus),
            ...parseAmazonMetricsExportData(instance),
          };
          break;

        case SpAccountLevelTitles.PRODUCT_TARGETING:
        case SpCampaignLevelTitles.PRODUCT_TARGETING:
          parsedInstanceData = {
            Targeting: instance.targeting,
            'Target ID': instance.targetId,
            Status: getTitleCaseString(instance.status),
            'AdGroup Name': instance.adGroupName,
            'AdGroup ID': instance.adGroupId,
            'AdGroup Status': instance.adGroupStatus || '-',
            'Campaign Name': instance.campaignName,
            'Campaign ID': instance.campaignId,
            'Campaign Status': instance.campaignStatus || '-',
            Bid: instance.bid,
            'Max Bid': instance.maxBid,
            'Min Bid': instance.minBid,
            TROAS: instance.troas,
            'Bidder Status': convertToTitleCase(instance.bidderStatus),
            ...parseAmazonMetricsExportData(instance),
          };
          break;

        case SpAccountLevelTitles.AUTO_TARGETING:
          parsedInstanceData = {
            Targeting: instance.targeting,
            'Target ID': instance.targetId,
            Status: getTitleCaseString(instance.status),
            'AdGroup Name': instance.adGroupName,
            'AdGroup ID': instance.adGroupId,
            'AdGroup Status': instance.adGroupStatus || '-',
            'Campaign Name': instance.campaignName,
            'Campaign ID': instance.campaignId,
            'Campaign Status': instance.campaignStatus || '-',
            Expression: instance.expression
              ?.map((exp: any) => exp.type)
              .join(' | '),
            'Expression Type': instance.expressionType,
            Bid: instance.bid,
            'Max Bid': instance.maxBid,
            'Min Bid': instance.minBid,
            TROAS: instance.troas,
            'Bidder Status': convertToTitleCase(instance.bidderStatus),
            ...parseAmazonMetricsExportData(instance),
          };
          break;

        case SpCampaignLevelTitles.NEG_TARGETING_KEYWORD:
        case SpAdGroupLevelTitles.NEG_TARGETING_KEYWORD:
          parsedInstanceData = {
            'Keyword Text': instance.keywordText,
            'Keyword ID': instance.keywordId,
            Status: getTitleCaseString(instance.status),
            'AdGroup Name': instance.adGroupName,
            'AdGroup ID': instance.adGroupId,
            'AdGroup Status': instance.adGroupStatus || '-',
            'Campaign Name': instance.campaignName,
            'Campaign ID': instance.campaignId,
            'Campaign Status': instance.campaignStatus || '-',
            'Targeting Type': getTitleCaseString(instance.targetingType),
            'Match type': instance.matchType,
          };
          break;

        case SpCampaignLevelTitles.NEG_TARGETING_PRODUCT:
        case SpAdGroupLevelTitles.NEG_TARGETING_PRODUCT:
          parsedInstanceData = {
            Targeting: instance.targeting,
            asin: instance.asin,
            'Target ID': instance.targetId,
            Status: getTitleCaseString(instance.status),
            'AdGroup Name': instance.adGroupName,
            'AdGroup ID': instance.adGroupId,
            'AdGroup Status': instance.adGroupStatus || '-',
            'Campaign Name': instance.campaignName,
            'Campaign ID': instance.campaignId,
            'Campaign Status': instance.campaignStatus || '-',
            'Targeting Type': getTitleCaseString(instance.targetingType),
          };
          break;

        case SpAccountLevelTitles.SEARCH_TERM:
        case SpCampaignLevelTitles.SEARCH_TERM:
        case SpAdGroupLevelTitles.SEARCH_TERM:
          parsedInstanceData = {
            'Search Term': instance.searchTerm,
            Targeting: instance.targeting,
            'Keyword ID': instance.keywordId,
            'Match type': instance.matchType,
            'AdGroup Name': instance.adGroupName,
            'AdGroup ID': instance.adGroupId,
            'AdGroup Status': instance.adGroupStatus || '-',
            'Campaign Name': instance.campaignName,
            'Campaign ID': instance.campaignId,
            'Campaign Status': instance.campaignStatus || '-',
            ...parseAmazonMetricsExportData(instance),
          };
          break;

        case SpAdGroupLevelTitles.KEYWORD_TARGETING:
          parsedInstanceData = {
            'Keyword Text': instance.keywordText,
            'Keyword ID': instance.keywordId,
            Status: getTitleCaseString(instance.status),
            'AdGroup Name': instance.adGroupName,
            'AdGroup ID': instance.adGroupId,
            'AdGroup Status': instance.adGroupStatus || '-',
            'Campaign Name': instance.campaignName,
            'Campaign ID': instance.campaignId,
            'Campaign Status': instance.campaignStatus || '-',
            'Targeting Type': getTitleCaseString(instance.targetingType),
            'Match type': instance.matchType,
            Bid: instance.bid,
            'Max Bid': instance.maxBid,
            'Min Bid': instance.minBid,
            TROAS: instance.troas,
            'Bidder Status': convertToTitleCase(instance.bidderStatus),
            'Keyword Automation': convertToTitleCase(
              instance.keywordAutomation || 'No'
            ),
            ...parseAmazonMetricsExportData(instance),
          };
          break;

        case SpAdGroupLevelTitles.PRODUCT_TARGETING:
          parsedInstanceData = {
            Targeting: instance.targeting,
            'Target ID': instance.targetId,
            Status: getTitleCaseString(instance.status),
            'AdGroup Name': instance.adGroupName,
            'AdGroup ID': instance.adGroupId,
            'AdGroup Status': instance.adGroupStatus || '-',
            'Campaign Name': instance.campaignName,
            'Campaign ID': instance.campaignId,
            'Campaign Status': instance.campaignStatus || '-',
            'Targeting Type': getTitleCaseString(instance.targetingType),
            Bid: instance.bid,
            'Max Bid': instance.maxBid,
            'Min Bid': instance.minBid,
            TROAS: instance.troas,
            'Bidder Status': convertToTitleCase(instance.bidderStatus),
            'Product Automation': convertToTitleCase(
              instance.productAutomation || 'No'
            ),
            ...parseAmazonMetricsExportData(instance),
          };
          break;

        case SpAdGroupLevelTitles.TARGETING:
          parsedInstanceData = {
            Targeting: instance.targeting,
            'Target ID': instance.targetId,
            Status: getTitleCaseString(instance.status),
            'AdGroup Name': instance.adGroupName,
            'AdGroup ID': instance.adGroupId,
            'AdGroup Status': instance.adGroupStatus || '-',
            'Campaign Name': instance.campaignName,
            'Campaign ID': instance.campaignId,
            'Campaign Status': instance.campaignStatus || '-',
            'Targeting Type': getTitleCaseString(instance.targetingType),
            Expression: instance.expression
              ?.map((exp: any) => exp.type)
              .join(' | '),
            'Expression Type': instance.expressionType,
            Bid: instance.bid,
            'Max Bid': instance.maxBid,
            'Min Bid': instance.minBid,
            TROAS: instance.troas,
            'Bidder Status': convertToTitleCase(instance.bidderStatus),
            'Product Automation': convertToTitleCase(
              instance.productAutomation || 'No'
            ),
            ...parseAmazonMetricsExportData(instance),
          };
          break;

        case SpCampaignLevelTitles.AUTO_TARGETING:
          parsedInstanceData = {
            Targeting: instance.targeting,
            'Target ID': instance.targetId,
            Status: getTitleCaseString(instance.status),
            'AdGroup Name': instance.adGroupName,
            'AdGroup ID': instance.adGroupId,
            'AdGroup Status': instance.adGroupStatus || '-',
            'Campaign Name': instance.campaignName,
            'Campaign ID': instance.campaignId,
            'Campaign Status': instance.campaignStatus || '-',
            'Targeting Type': getTitleCaseString(instance.targetingType),
            Expression: instance.expression
              ?.map((exp: any) => exp.type)
              .join(' | '),
            'Expression Type': instance.expressionType,
            Bid: instance.bid,
            'Max Bid': instance.maxBid,
            'Min Bid': instance.minBid,
            TROAS: instance.troas,
            'Bidder Status': convertToTitleCase(instance.bidderStatus),
            ...parseAmazonMetricsExportData(instance),
          };
          break;

        case SpAccountLevelTitles.PLACEMENT:
        case SpCampaignLevelTitles.PLACEMENT: {
          const biddingStrategy = getSPBiddingStrategy(
            instance.dynamicBidding?.strategy ?? null
          );
          parsedInstanceData = {
            Placement: instance.placement || '-',
            'Bid Adjustment': displayValue(formatNum(instance.percentage)),
            'Campaign Name': instance.campaignName,
            'Campaign ID': instance.campaignId,
            'Campaign Status': getTitleCaseString(instance.status) || '-',
            'Dynamic Bidding':
              biddingStrategy !== null &&
              biddingStrategy !== undefined &&
              Object.keys(biddingStrategy)?.length
                ? biddingStrategy.label
                : instance.dynamicBidding?.strategy,
            ...parseAmazonMetricsExportData(instance),
          };
          break;
        }

        case OverallAccountLevelTitles.CAMPAIGNS: {
          const biddingStrategy = getSPBiddingStrategy(instance.strategy);

          parsedInstanceData = {
            'Campaign Name': instance.campaignName,
            'Campaign ID': instance.campaignId,
            Status: getTitleCaseString(instance.status),
            'Ad Type': getAmazonAdType(instance.adType),
            'Targeting Type': getTitleCaseString(instance.targetingType),
            'Start Date': moment(instance.startDate).format(DATE_FORMAT_13),
            'End Date':
              instance.endDate === '-' || instance.endDate === undefined
                ? 'No Date'
                : moment(instance.endDate).format(DATE_FORMAT_13),
            Budget: instance.budget,
            'Dynamic Bidding': biddingStrategy?.label || '-',
            ...parseAmazonMetricsExportData(instance),
          };

          break;
        }

        case OverallAccountLevelTitles.AD_GROUPS:
          parsedInstanceData = {
            'AdGroup Name': instance.adGroupName,
            'AdGroup ID': instance.adGroupId,
            Status: getTitleCaseString(instance.adGroupStatus),
            'Ad Type': getAmazonAdType(instance.adType),
            'Campaign Name': instance.campaignName,
            'Campaign ID': instance.campaignId,
            'Campaign Status': instance.campaignStatus || '-',
            'Default Bid': instance.defaultBid,
            'Max Bid': instance.maxBid,
            'Min Bid': instance.minBid,
            TROAS: instance.troas,
            'Bidder Status': convertToTitleCase(instance.bidderStatus),
            ...parseAmazonMetricsExportData(instance),
          };
          break;

        case OverallAccountLevelTitles.PRODUCT_ADS:
          parsedInstanceData = {
            'Item Name': instance.itemName || '-',
            'Ad ID': instance.adId,
            Status: getTitleCaseString(instance.status),
            ASIN: instance.asin || '-',
            'Ads Eligibility': instance.eligibility,
            'Ad Type': getAmazonAdType(instance.adType),
            'AdGroup Name': instance.adGroupName || '-',
            'AdGroup ID': instance.adGroupId || '-',
            'AdGroup Status': instance.adGroupStatus || '-',
            'Campaign Name': instance.campaignName || '-',
            'Campaign ID': instance.campaignId || '-',
            'Campaign Status': instance.campaignStatus || '-',
            'Listing Price': instance.listingPrice,
            ...parseAmazonMetricsExportData(instance),
          };
          break;

        case OverallAccountLevelTitles.KEYWORD_TARGETING:
          parsedInstanceData = {
            'Keyword Text': instance.keywordText,
            'Keyword ID': instance.keywordId,
            Status: getTitleCaseString(instance.status),
            'Ad Type': getAmazonAdType(instance.adType),
            'AdGroup Name': instance.adGroupName || '-',
            'AdGroup ID': instance.adGroupId || '-',
            'AdGroup Status': instance.adGroupStatus || '-',
            'Campaign Name': instance.campaignName || '-',
            'Campaign ID': instance.campaignId || '-',
            'Campaign Status': instance.campaignStatus || '-',
            'Match type': instance.matchType,
            Bid: instance.bid,
            'Max Bid': instance.maxBid,
            'Min Bid': instance.minBid,
            TROAS: instance.troas,
            'Bidder Status': convertToTitleCase(instance.bidderStatus),
            ...parseAmazonMetricsExportData(instance),
          };
          break;

        case OverallAccountLevelTitles.PRODUCT_TARGETING:
          parsedInstanceData = {
            Targeting: instance.targeting,
            'Target ID': instance.targetId,
            Status: getTitleCaseString(instance.status),
            'Ad Type': getAmazonAdType(instance.adType),
            'AdGroup Name': instance.adGroupName || '-',
            'AdGroup ID': instance.adGroupId || '-',
            'AdGroup Status': instance.adGroupStatus || '-',
            'Campaign Name': instance.campaignName || '-',
            'Campaign ID': instance.campaignId || '-',
            'Campaign Status': instance.campaignStatus || '-',
            Bid: instance.bid,
            'Max Bid': instance.maxBid,
            'Min Bid': instance.minBid,
            TROAS: instance.troas,
            'Bidder Status': convertToTitleCase(instance.bidderStatus),
            ...parseAmazonMetricsExportData(instance),
          };
          break;

        case OverallAccountLevelTitles.SEARCH_TERM:
          parsedInstanceData = {
            'Search Term': instance.searchTerm,
            Targeting: instance.targeting,
            'Keyword ID': instance.keywordId,
            'Keyword Status': getTitleCaseString(instance.keywordStatus),
            'Match type': instance.matchType,
            'Ad Type': getAmazonAdType(instance.adType),
            'AdGroup Name': instance.adGroupName,
            'AdGroup ID': instance.adGroupId,
            'AdGroup Status': instance.adGroupStatus || '-',
            'Campaign Name': instance.campaignName,
            'Campaign ID': instance.campaignId,
            'Campaign Status': instance.campaignStatus,
            ...parseAmazonMetricsExportData(instance),
          };
          break;

        case SbAccountLevelTitles.CAMPAIGNS: {
          parsedInstanceData = {
            'Campaign Name': instance.campaignName,
            'Campaign ID': instance.campaignId,
            Status: getTitleCaseString(instance.status),
            'Start Date': moment(instance.startDate).format(DATE_FORMAT_13),
            'End Date':
              instance.endDate === '-' || instance.endDate === undefined
                ? 'No Date'
                : moment(instance.endDate).format(DATE_FORMAT_13),
            Budget: instance.budget,
            'Budget Type': getTitleCaseString(instance.budgetType),
            'Cost Type': instance.costType || '-',
            ...parseAmazonMetricsExportData(instance),
          };

          break;
        }

        case SbAccountLevelTitles.AD_GROUP:
        case SbCampaignLevelTitles.AD_GROUP:
          parsedInstanceData = {
            'AdGroup Name': instance.adGroupName,
            'AdGroup ID': instance.adGroupId,
            Status: getTitleCaseString(instance.status),
            'Campaign Name': instance.campaignName || '-',
            'Campaign ID': instance.campaignId || '-',
            'Campaign Status': instance.campaignStatus || '-',
            ...parseAmazonMetricsExportData(instance),
          };
          break;

        case SbAccountLevelTitles.PRODUCT_ADS:
        case SbCampaignLevelTitles.PRODUCT_ADS:
        case SbAdGroupLevelTitles.PRODUCT_ADS:
          parsedInstanceData = {
            'Ad Name': instance.name,
            'Ad ID': instance.adId,
            Status: getTitleCaseString(instance.status),
            'Creative Asins': getAsinsListStringified(instance.asinEligibility),
            'Landing Page': instance.landingPage?.url || '-',
            'Landing Page Type': instance.landingPage?.pageType || '-',
            'Serving Status': instance.extendedData?.servingStatus || '-',
            'AdGroup Name': instance.adGroupName || '-',
            'AdGroup ID': instance.adGroupId || '-',
            'AdGroup Status': instance.adGroupStatus || '-',
            'Campaign Name': instance.campaignName || '-',
            'Campaign ID': instance.campaignId || '-',
            'Campaign Status': instance.campaignStatus || '-',
            ...parseAmazonMetricsExportData(instance),
          };
          break;

        case SbAccountLevelTitles.KEYWORD_TARGETING:
        case SbCampaignLevelTitles.KEYWORD_TARGETING:
        case SbAdGroupLevelTitles.KEYWORD_TARGETING:
          parsedInstanceData = {
            'Keyword Text': instance.keywordText,
            'Keyword ID': instance.keywordId,
            Status: getTitleCaseString(instance.status),
            'AdGroup Name': instance.adGroupName || '-',
            'AdGroup ID': instance.adGroupId || '-',
            'AdGroup Status': instance.adGroupStatus || '-',
            'Campaign Name': instance.campaignName || '-',
            'Campaign ID': instance.campaignId || '-',
            'Campaign Status': instance.campaignStatus || '-',
            'Match type': instance.matchType,
            Bid: instance.bid,
            'Max Bid': instance.maxBid,
            'Min Bid': instance.minBid,
            TROAS: instance.troas,
            'Bidder Status': convertToTitleCase(instance.bidderStatus),
            'Keyword Automation': convertToTitleCase(
              instance.keywordAutomation || 'No'
            ),
            ...parseAmazonMetricsExportData(instance),
          };
          break;

        case SbAccountLevelTitles.PRODUCT_TARGETING:
        case SbCampaignLevelTitles.PRODUCT_TARGETING:
        case SbAdGroupLevelTitles.PRODUCT_TARGETING:
          parsedInstanceData = {
            Targeting: instance.targeting,
            'Target ID': instance.targetId,
            Status: getTitleCaseString(instance.status),
            'AdGroup Name': instance.adGroupName || '-',
            'AdGroup ID': instance.adGroupId || '-',
            'AdGroup Status': instance.adGroupStatus || '-',
            'Campaign Name': instance.campaignName || '-',
            'Campaign ID': instance.campaignId || '-',
            'Campaign Status': instance.campaignStatus || '-',
            Bid: instance.bid,
            'Max Bid': instance.maxBid,
            'Min Bid': instance.minBid,
            TROAS: instance.troas,
            'Bidder Status': convertToTitleCase(instance.bidderStatus),
            'Product Automation': convertToTitleCase(
              instance.productAutomation || 'No'
            ),
            ...parseAmazonMetricsExportData(instance),
          };
          break;

        case SbCampaignLevelTitles.NEG_TARGETING_KEYWORD:
        case SbAdGroupLevelTitles.NEG_TARGETING_KEYWORD:
          parsedInstanceData = {
            'Keyword Text': instance.keywordText,
            'Keyword ID': instance.keywordId,
            Status: getTitleCaseString(instance.status),
            'AdGroup Name': instance.adGroupName || '-',
            'AdGroup ID': instance.adGroupId || '-',
            'AdGroup Status': instance.adGroupStatus || '-',
            'Campaign Name': instance.campaignName || '-',
            'Campaign ID': instance.campaignId || '-',
            'Campaign Status': instance.campaignStatus || '-',
            'Match type': instance.matchType,
          };
          break;

        case SbCampaignLevelTitles.NEG_TARGETING_PRODUCT:
        case SbAdGroupLevelTitles.NEG_TARGETING_PRODUCT:
          parsedInstanceData = {
            Targeting: instance.targeting,
            'Target ID': instance.targetId,
            Status: getTitleCaseString(instance.status),
            'AdGroup Name': instance.adGroupName || '-',
            'AdGroup ID': instance.adGroupId || '-',
            'AdGroup Status': instance.adGroupStatus || '-',
            'Campaign Name': instance.campaignName || '-',
            'Campaign ID': instance.campaignId || '-',
            'Campaign Status': instance.campaignStatus || '-',
          };
          break;

        case SbAccountLevelTitles.SEARCH_TERM:
        case SbCampaignLevelTitles.SEARCH_TERM_KEYWORD:
        case SbAdGroupLevelTitles.SEARCH_TERM_KEYWORD:
          parsedInstanceData = {
            'Search Term': instance.searchTerm,
            Targeting: instance.keywordText,
            'Keyword ID': instance.keywordId,
            'Keyword Status': getTitleCaseString(instance.keywordStatus),
            'Match type': instance.matchType,
            'AdGroup Name': instance.adGroupName,
            'AdGroup ID': instance.adGroupId,
            'AdGroup Status': instance.adGroupStatus || '-',
            'Campaign Name': instance.campaignName,
            'Campaign ID': instance.campaignId,
            'Campaign Status': instance.campaignStatus,
            ...parseAmazonMetricsExportData(instance),
          };
          break;

        case SdAccountLevelTitles.CAMPAIGN:
          parsedInstanceData = {
            'Campaign Name': instance.campaignName,
            'Campaign ID': instance.campaignId,
            Status: getTitleCaseString(instance.status),
            'Start Date': moment(instance.startDate).format(DATE_FORMAT_13),
            'End Date':
              instance.endDate === '-' || instance.endDate === undefined
                ? 'No Date'
                : moment(instance.endDate).format(DATE_FORMAT_13),
            Budget: instance.budget,
            'Cost Type': instance.costType || '-',
            Tactic: getSDTactic(instance.tactic),
            ...parseAmazonMetricsExportData(instance),
          };
          break;

        case SdAccountLevelTitles.AD_GROUP:
        case SdCampaignLevelTitles.AD_GROUP:
          parsedInstanceData = {
            'AdGroup Name': instance.adGroupName,
            'AdGroup ID': instance.adGroupId,
            Status: getTitleCaseString(instance.status),
            'Campaign Name': instance.campaignName || '-',
            'Campaign ID': instance.campaignId || '-',
            'Campaign Status': instance.campaignStatus || '-',
            'Default Bid': instance.defaultBid,
            'Bid Optimization': getTitleCaseString(instance.bidOptimization),
            Tactic: getSDTactic(instance.tactic),
            'Creative Type': getTitleCaseString(instance.creativeType),
            'Max Bid': instance.maxBid,
            'Min Bid': instance.minBid,
            TROAS: instance.troas,
            'Bidder Status': convertToTitleCase(instance.bidderStatus),
            'Product Automation': convertToTitleCase(
              instance.productAutomation || 'No'
            ),
            ...parseAmazonMetricsExportData(instance),
          };
          break;

        case SdAccountLevelTitles.PRODUCT_ADS:
        case SdCampaignLevelTitles.PRODUCT_ADS:
        case SdAdGroupLevelTitles.PRODUCT_ADS:
          parsedInstanceData = {
            'Ad Name': instance.adName || '-',
            'Ad ID': instance.adId,
            Status: getTitleCaseString(instance.status),
            ASIN: instance.asin || '-',
            'Ads Eligibility': instance.eligibility,
            'Landing Page': instance.landingPageURL || '-',
            'Landing Page Type': instance.landingPageType || '-',
            'AdGroup Name': instance.adGroupName || '-',
            'AdGroup ID': instance.adGroupId || '-',
            'AdGroup Status': instance.adGroupStatus || '-',
            'Campaign Name': instance.campaignName || '-',
            'Campaign ID': instance.campaignId || '-',
            'Campaign Status': instance.campaignStatus || '-',
            'Listing Price': instance.listingPrice,
            ...parseAmazonMetricsExportData(instance),
          };
          break;

        case WalmartSPAccountLevelTitles.CAMPAIGNS:
        case WalmartSBAccountLevelTitles.CAMPAIGNS:
          parsedInstanceData = {
            'Advertiser ID': instance.advertiserId,
            'Campaign Name': instance.campaignName,
            'Campaign ID': instance.campaignId,
            Status: convertToTitleCase(instance.status),
            'Ad Type': getWalmartAdType(instance.adType),
            'Targeting Type': convertToTitleCase(instance.targetingType),
            'Start Date': moment(instance.startDate).format(DATE_FORMAT_13),
            'End Date':
              instance.endDate === '-' || instance.endDate === undefined
                ? 'Not set'
                : moment(instance.endDate).format(DATE_FORMAT_13),
            'Daily Budget': instance.dailyBudget,
            'Total Budget': instance.totalBudget,
            'Avg. Cap out time': `${
              checkIsValidDate(instance.dailyOutOfBudgetDatetime)
                ? `${parseAsUtcAndConvert(
                    instance.dailyOutOfBudgetDatetime,
                    TIME_FORMAT_4
                  )} PST`
                : '-'
            }`,
            'Suggested Daily Budget': instance.suggestedLatestDailyBudget,
            'Suggested Total Budget': instance.suggestedLatestTotalBudget,
            ...parseWalmartMetricsExportData(instance),
          };
          if (accountType === WalmartAccountTypeEnum.FIRST_PARTY)
            parsedInstanceData = {
              ...parsedInstanceData,
              ...parseWalmartInstoreMetricsExportData(instance),
            };

          break;

        case WalmartSPAccountLevelTitles.AD_GROUPS:
        case WalmartSPCampaignLevelTitles.AD_GROUPS:
        case WalmartSBAccountLevelTitles.AD_GROUPS:
        case WalmartSBCampaignLevelTitles.AD_GROUPS:
          parsedInstanceData = {
            'Advertiser ID': instance.advertiserId,
            'Ad Group Name': instance.adGroupName,
            'Ad Group ID': instance.adGroupId,
            Status: convertToTitleCase(instance.status),
            'Campaign Name': instance.campaignName,
            'Campaign ID': instance.campaignId,
            'Campaign Status': convertToTitleCase(instance.campaignStatus),
            'Ad Type': getWalmartAdType(instance.adType),
            'Targeting Type': convertToTitleCase(instance.targetingType),
            'Max Bid': instance.maxBid,
            'Min Bid': instance.minBid,
            TROAS: instance.troas,
            'Bidder Status': convertToTitleCase(instance.bidderStatus),
            ...parseWalmartMetricsExportData(instance),
          };
          break;

        case WalmartSPAccountLevelTitles.AD_ITEMS:
        case WalmartSPCampaignLevelTitles.AD_ITEMS:
        case WalmartSPAdGroupLevelTitles.AD_ITEMS:
        case WalmartSBAccountLevelTitles.AD_ITEMS:
        case WalmartSBCampaignLevelTitles.AD_ITEMS:
        case WalmartSBAdGroupLevelTitles.AD_ITEMS:
          parsedInstanceData = {
            'Advertiser ID': instance.advertiserId,
            'Product Name': instance.itemName,
            'Product ID': instance.itemId,
            Status: convertToTitleCase(instance.status),
            'Ad Group Name': instance.adGroupName,
            'Ad Group ID': instance.adGroupId,
            'Ad Group Status': convertToTitleCase(instance.adGroupStatus),
            'Campaign Name': instance.campaignName,
            'Campaign ID': instance.campaignId,
            'Campaign Status': convertToTitleCase(instance.campaignStatus),
            'Product Bid': instance.bid,
            'Ad Type': getWalmartAdType(instance.adType),
            'Targeting Type': convertToTitleCase(instance.targetingType),
            'Max Bid': instance.maxBid,
            'Min Bid': instance.minBid,
            TROAS: instance.troas,
            'Bidder Status': convertToTitleCase(instance.bidderStatus),
            'Product Automation': convertToTitleCase(
              instance.productAutomation || 'No'
            ),
            ...parseWalmartMetricsExportData(instance),
          };
          break;

        case WalmartSPAccountLevelTitles.KEYWORD_TARGETING:
        case WalmartSPCampaignLevelTitles.KEYWORD_TARGETING:
        case WalmartSPAdGroupLevelTitles.KEYWORD_TARGETING:
        case WalmartSBAccountLevelTitles.KEYWORD_TARGETING:
        case WalmartSBCampaignLevelTitles.KEYWORD_TARGETING:
        case WalmartSBAdGroupLevelTitles.KEYWORD_TARGETING:
          parsedInstanceData = {
            'Advertiser ID': instance.advertiserId,
            Keyword: instance.keywordText,
            'Keyword ID': instance.keywordId,
            Status: convertToTitleCase(instance.status),
            'Ad Group Name': instance.adGroupName,
            'Ad Group ID': instance.adGroupId,
            'Ad Group Status': convertToTitleCase(instance.adGroupStatus),
            'Campaign Name': instance.campaignName,
            'Campaign ID': instance.campaignId,
            'Campaign Status': convertToTitleCase(instance.campaignStatus),
            Bid: instance.bid,
            'Match Type': convertToTitleCase(instance.matchType),
            'Ad Type': getWalmartAdType(instance.adType),
            'Targeting Type': convertToTitleCase(instance.targetingType),
            'Max Bid': instance.maxBid,
            'Min Bid': instance.minBid,
            TROAS: instance.troas,
            'Bidder Status': convertToTitleCase(instance.bidderStatus),
            'Keyword Automation': convertToTitleCase(
              instance?.keywordAutomation ?? 'No'
            ),
            ...parseWalmartMetricsExportData(instance),
          };
          break;

        case WalmartSPAccountLevelTitles.PAGE_TYPE:
        case WalmartSPCampaignLevelTitles.PAGE_TYPE:
        case WalmartSBAccountLevelTitles.PAGE_TYPE:
        case WalmartSBCampaignLevelTitles.PAGE_TYPE:
        case WalmartSVAccountLevelTitles.PAGE_TYPE:
        case WalmartSVCampaignLevelTitles.PAGE_TYPE:
        case WalmartOverallAccountLevelTitles.PAGE_TYPE:
          parsedInstanceData = {
            'Page Type': instance.pageType,
            'Campaign Name': instance.campaignName,
            'Campaign ID': instance.campaignId,
            'Campaign Status': convertToTitleCase(instance.campaignStatus),
            'Bid Multiplier': instance.multiplier,
            ...parseWalmartMetricsExportData(instance),
          };
          break;

        case WalmartSPAccountLevelTitles.PLATFORM:
        case WalmartSPCampaignLevelTitles.PLATFORM:
        case WalmartSBAccountLevelTitles.PLATFORM:
        case WalmartSBCampaignLevelTitles.PLATFORM:
        case WalmartSVAccountLevelTitles.PLATFORM:
        case WalmartSVCampaignLevelTitles.PLATFORM:
        case WalmartOverallAccountLevelTitles.PLATFORM:
          parsedInstanceData = {
            Platform: instance.platform,
            'Campaign Name': instance.campaignName,
            'Campaign ID': instance.campaignId,
            'Campaign Status': convertToTitleCase(instance.campaignStatus),
            'Bid Multiplier': instance.multiplier,
            ...parseWalmartMetricsExportData(instance),
          };
          break;

        case WalmartSVAccountLevelTitles.CAMPAIGNS:
        case WalmartOverallAccountLevelTitles.CAMPAIGNS:
          parsedInstanceData = {
            'Advertiser ID': instance.advertiserId,
            'Campaign Name': instance.campaignName,
            'Campaign ID': instance.campaignId,
            Status: convertToTitleCase(instance.status),
            'Ad Type': getWalmartAdType(instance.adType),
            'Targeting Type': convertToTitleCase(instance.targetingType),
            'Start Date': moment(instance.startDate).format(DATE_FORMAT_13),
            'End Date':
              instance.endDate === '-' || instance.endDate === undefined
                ? 'Not set'
                : moment(instance.endDate).format(DATE_FORMAT_13),
            'Daily Budget': instance.dailyBudget,
            'Total Budget': instance.totalBudget,
            'Avg. Cap out time': `${
              checkIsValidDate(instance.dailyOutOfBudgetDatetime)
                ? `${parseAsUtcAndConvert(
                    instance.dailyOutOfBudgetDatetime,
                    TIME_FORMAT_4
                  )} PST`
                : '-'
            }`,
            'Suggested Daily Budget': instance.suggestedLatestDailyBudget,
            'Suggested Total Budget': instance.suggestedLatestTotalBudget,
            ...parseWalmartMetricsExportData(instance),
            ...parseWalmartVideoMetricsExportData(instance),
          };
          if (accountType === WalmartAccountTypeEnum.FIRST_PARTY)
            parsedInstanceData = {
              ...parsedInstanceData,
              ...parseWalmartInstoreMetricsExportData(instance),
            };
          break;

        case WalmartSVAccountLevelTitles.AD_GROUPS:
        case WalmartSVCampaignLevelTitles.AD_GROUPS:
        case WalmartOverallAccountLevelTitles.AD_GROUPS:
          parsedInstanceData = {
            'Advertiser ID': instance.advertiserId,
            'Ad Group Name': instance.adGroupName,
            'Ad Group ID': instance.adGroupId,
            Status: convertToTitleCase(instance.status),
            'Campaign Name': instance.campaignName,
            'Campaign ID': instance.campaignId,
            'Campaign Status': convertToTitleCase(instance.campaignStatus),
            'Ad Type': getWalmartAdType(instance.adType),
            'Targeting Type': convertToTitleCase(instance.targetingType),
            ...parseWalmartMetricsExportData(instance),
            ...parseWalmartVideoMetricsExportData(instance),
          };
          break;

        case WalmartSVAccountLevelTitles.AD_ITEMS:
        case WalmartSVCampaignLevelTitles.AD_ITEMS:
        case WalmartSVAdGroupLevelTitles.AD_ITEMS:
        case WalmartOverallAccountLevelTitles.AD_ITEMS:
          parsedInstanceData = {
            'Advertiser ID': instance.advertiserId,
            'Product Name': instance.itemName,
            'Product ID': instance.itemId,
            Status: convertToTitleCase(instance.status),
            'Ad Group Name': instance.adGroupName,
            'Ad Group ID': instance.adGroupId,
            'Ad Group Status': convertToTitleCase(instance.adGroupStatus),
            'Campaign Name': instance.campaignName,
            'Campaign ID': instance.campaignId,
            'Campaign Status': convertToTitleCase(instance.campaignStatus),
            'Product Bid': instance.bid,
            'Ad Type': getWalmartAdType(instance.adType),
            'Targeting Type': convertToTitleCase(instance.targetingType),
            ...parseWalmartMetricsExportData(instance),
          };
          break;

        case WalmartSVAccountLevelTitles.KEYWORD_TARGETING:
        case WalmartSVCampaignLevelTitles.KEYWORD_TARGETING:
        case WalmartSVAdGroupLevelTitles.KEYWORD_TARGETING:
        case WalmartOverallAccountLevelTitles.KEYWORD_TARGETING:
          parsedInstanceData = {
            'Advertiser ID': instance.advertiserId,
            Keyword: instance.keywordText,
            'Keyword ID': instance.keywordId,
            Status: convertToTitleCase(instance.status),
            'Ad Group Name': instance.adGroupName,
            'Ad Group ID': instance.adGroupId,
            'Ad Group Status': convertToTitleCase(instance.adGroupStatus),
            'Campaign Name': instance.campaignName,
            'Campaign ID': instance.campaignId,
            'Campaign Status': convertToTitleCase(instance.campaignStatus),
            Bid: instance.bid,
            'Match Type': convertToTitleCase(instance.matchType),
            'Ad Type': getWalmartAdType(instance.adType),
            'Targeting Type': convertToTitleCase(instance.targetingType),
            'Max Bid': instance.maxBid,
            'Min Bid': instance.minBid,
            TROAS: instance.troas,
            'Bidder Status': convertToTitleCase(instance.bidderStatus),
            'Keyword Automation': convertToTitleCase(
              instance.keywordAutomation || 'No'
            ),
            ...parseWalmartMetricsExportData(instance),
            ...parseWalmartVideoMetricsExportData(instance),
          };
          break;

        case WalmartSPCampaignLevelTitles.SEARCH_TERM:
        case WalmartSPAdGroupLevelTitles.SEARCH_TERM:
          parsedInstanceData = {
            'Search Term': instance.searchTerm,
            ...parseDataBasedOnTargetingType(
              instance,
              instance.targetingType === TargetingTypeEnum.MANUAL
            ),
            'AdGroup Name': instance.adGroupName,
            'AdGroup ID': instance.adGroupId,
            'AdGroup Status': instance.adGroupStatus || '-',
            'Campaign Name': instance.campaignName,
            'Campaign ID': instance.campaignId,
            'Campaign Status': instance.campaignStatus || '-',
            'Ad Type': getWalmartAdType(instance.adType),
            'Targeting Type': convertToTitleCase(instance.targetingType),
            ...parseWalmartMetricsExportData(instance),
          };
          break;

        case WalmartSPAccountLevelTitles.SEARCH_TERM:
        case WalmartOverallAccountLevelTitles.SEARCH_TERM:
          parsedInstanceData = {
            'Search Term': instance.searchTerm,
            ...parseDataBasedOnTargetingType(instance, false, true),
            'AdGroup Name': instance.adGroupName,
            'AdGroup ID': instance.adGroupId,
            'AdGroup Status': instance.adGroupStatus || '-',
            'Campaign Name': instance.campaignName,
            'Campaign ID': instance.campaignId,
            'Campaign Status': instance.campaignStatus || '-',
            'Ad Type': getWalmartAdType(instance.adType),
            'Targeting Type': convertToTitleCase(instance.targetingType),
            ...parseWalmartMetricsExportData(instance),
          };
          break;

        case CatalogTabTitlesEnum.WALMART_CATALOG:
          parsedInstanceData = {
            SKU: instance.sku,
            'Item ID': `${instance.itemId}`,
            'Item Name': instance.productName,
            'Fulfillment Type': instance.fulfillmentType,
            'Primary Variant': instance.primaryVariant,
            'Publish Status': instance.publishStatus,
            'Buy Box': instance.buyBox,
            LQS: instance.lqs,
            Reviews: instance.reviews,
            Ratings: instance.ratings,
            'Category Path': instance.categoryPath,
            'Inventory Count': instance.availToSellQuantity,
            'Inventory Value COGS': instance.inventoryValueCogs,
            'Inventory Value Retail': instance.inventoryValueRetail,
            Price: instance.price,
            COGS: instance.cogs,
            'Total Sales': instance.totalSales,
            GMV: instance.grossSales,
            'Commission/Walmart Fee': instance.commission,
            'GMV Commission': instance.gmvCommission,
            'Gross Margin': instance.grossMargin,
            'Gross Margin %': instance.grossMarginPercentage,
            'Total Units': instance.totalUnits,
            'Gross Units Sold': instance.grossUnitsSold,
            'Refund Orders': instance.refundOrders,
            'Refund Sales': instance.refundSales,
            'Cancelled Orders': instance.cancelledOrders,
            'Cancelled Sales': instance.cancelledSalesPrice,
            Returns: instance.returns,
            'Promo Spend': instance.promoSpend,
            Impressions: instance.impressions,
            Clicks: instance.clicks,
            CTR: instance.ctr,
            'CVR Order Based': instance.cvrOrderBased,
            'CVR Units Based': instance.cvrUnitSoldBased,
            'Ad Units': instance.unitsSold,
            'Ad Orders': instance.adOrders,
            'Ad Spend': instance.adSpend,
            'Ad Sales': instance.adSales,
            CPC: instance.cpc,
            RoAS: instance.roas,
            ACoS: instance.acos,
            TACoS: instance.tacos,
            'Is Advertised?': instance.isAdvertised,
            Campaigns: instance.campaigns,
          };
          break;

        case CatalogTabTitlesEnum.AMAZON_CATALOG: {
          parsedInstanceData = { ...instance };

          break;
        }

        case LogsTitlesEnum.LOGS_HOME:
          parsedInstanceData = {
            Level: instance.editedLevel,
            'Action Type': instance.actionType.type,
            From: instance.from,
            To: instance.to,
            'Updated Time': getFormattedTimezoneDate(
              instance.timestamp,
              DATE_FORMAT_17
            ),
            User: instance.userName,
          };
          break;

        case ProfitabilityTableTitlesEnum.PROFITABILITY_PNL: {
          const { settlementDetails, ...rest } = instance;

          parsedInstanceData = {
            'Parameter/Date': rest.label,
            ...rest.dateValues,
            Total: rest.value,
          };
          break;
        }
        case ProfitabilityTableTitlesEnum.PROFITABILITY_TRENDS: {
          parsedInstanceData = {
            'Product Name': instance.productName,
            'Product Price': displayValue(instance.productPrice, false),
            [`${marketplace === MarketplaceEnum.AMAZON ? 'ASIN' : 'ItemId'}`]:
              instance.id,
            SKU: instance.sku,
            ...instance.dateValues,
            Total: getFormattedMetrics(instance.metricKey, instance.totalValue),
          };
          break;
        }
        case ProfitabilityTableTypeEnum.AMAZON_PRODUCTS: {
          const {
            id,
            childItems,
            settlementDetails,
            asin,
            sku,
            itemName,
            overallAdSpend,
            overallAdSales,
            overallAdUnits,
            overallOrganicSales,
            overallOrganicUnits,
            totalSales,
            totalUnitsSold,
            totalReturns,
            refundPercentage,
            cogs,
            promotion,
            netProfit,
            estimatedPayout,
            roi,
            margin,
            itemPrice,
            tacos,
            roas,
            acos,
            overallSpAdSpend,
            overallSbAdSpend,
            overallSdAdSpend,
            overallSpAdSales,
            overallSbAdSales,
            overallSdAdSales,
            overallSpAdUnits,
            overallSbAdUnits,
            overallSdAdUnits,
            totalCogs,
            ...rest
          } = instance;

          const normalizedSettlementKeys =
            profitabilityUtils.getSettlementDetailsForExport(rest);

          parsedInstanceData = {
            'Parent Asin': id,
            ASIN: asin,
            SKU: sku,
            'Product Name': itemName,
            Price: itemPrice,
            COGS: totalCogs,
            'Overall Ad Spend': overallAdSpend,
            'Overall Ad Sales': overallAdSales,
            'Overall Ad Units': overallAdUnits,
            'Total Sales': totalSales,
            'Units Sold': totalUnitsSold,
            'Overall Organic Sales': overallOrganicSales,
            'Overall Organic Units': overallOrganicUnits,
            'Return Units': totalReturns,
            '% Returns': refundPercentage,
            tacos,
            roas,
            acos,
            Promotion: promotion,
            Margin: margin,
            ROI: roi,
            'Net Profit': netProfit,
            'Est. Payout': estimatedPayout,
            overallSpAdSpend,
            overallSbAdSpend,
            overallSdAdSpend,
            overallSpAdSales,
            overallSbAdSales,
            overallSdAdSales,
            overallSpAdUnits,
            overallSbAdUnits,
            overallSdAdUnits,
            ...normalizedSettlementKeys,
          };
          break;
        }

        case ProfitabilityTableTypeEnum.AMAZON_ORDERS: {
          const {
            orderId,
            orderStatus,
            productName,
            sku,
            orderDate,
            orderItemId,
            orderUnits,
            principalAmount,
            totalReturnUnits,
            totalCogs,
            promotion,
            netProfit,
            estimatedPayout,
            settlementDetails,
            items,
            asin,
            ...rest
          } = instance;
          const normalizedSettlementKeys =
            profitabilityUtils.getSettlementDetailsForExport(rest);

          parsedInstanceData = {
            orderId,
            asin,
            sku,
            'Product Name': productName,
            'Order Status': orderStatus,
            'Order Date': orderDate,
            'Total Units': orderUnits,
            'Total Sales': principalAmount,
            'Return Units': totalReturnUnits,
            ...normalizedSettlementKeys,
          };
          break;
        }

        default:
          parsedInstanceData = { ...instance };
          break;
      }

      return parsedInstanceData;
    });
    return parsedExportData;
  } else {
    return data;
  }
};

export const parseGraphExportData = <T extends Record<string, any>>(
  data: T[],
  title: string,
  accountType?: string,
  frequency?: string
) => {
  if (data.length) {
    const parsedExportData = data.map((instance) => {
      let parsedInstanceData: Record<string, any> = {
        Frequency: ISO_DATE_FORMAT.test(instance.label)
          ? convertGraphLabelByFrequency(
              instance.label,
              frequency ?? Frequency.DAILY
            )
          : instance.label ?? convertToTitleCase(frequency ?? ''),
      };

      switch (title) {
        case SpAccountLevelTitles.CAMPAIGNS:
        case SpAccountLevelTitles.AD_GROUPS:
        case SpCampaignLevelTitles.AD_GROUPS:
        case SpAccountLevelTitles.PRODUCT_ADS:
        case SpCampaignLevelTitles.PRODUCT_ADS:
        case SpAdGroupLevelTitles.PRODUCT_ADS:
        case SpAccountLevelTitles.KEYWORD_TARGETING:
        case SpCampaignLevelTitles.KEYWORD_TARGETING:
        case SpAccountLevelTitles.PRODUCT_TARGETING:
        case SpCampaignLevelTitles.PRODUCT_TARGETING:
        case SpAccountLevelTitles.AUTO_TARGETING:
        case SpAccountLevelTitles.SEARCH_TERM:
        case SpCampaignLevelTitles.SEARCH_TERM:
        case SpAdGroupLevelTitles.SEARCH_TERM:
        case SpAdGroupLevelTitles.KEYWORD_TARGETING:
        case SpAdGroupLevelTitles.PRODUCT_TARGETING:
        case SpAdGroupLevelTitles.TARGETING:
        case SpCampaignLevelTitles.AUTO_TARGETING:
        case SpAccountLevelTitles.PLACEMENT:
        case SpCampaignLevelTitles.PLACEMENT:
        case OverallAccountLevelTitles.CAMPAIGNS:
        case OverallAccountLevelTitles.AD_GROUPS:
        case OverallAccountLevelTitles.PRODUCT_ADS:
        case OverallAccountLevelTitles.KEYWORD_TARGETING:
        case OverallAccountLevelTitles.PRODUCT_TARGETING:
        case OverallAccountLevelTitles.SEARCH_TERM:
        case SbAccountLevelTitles.CAMPAIGNS:
        case SbAccountLevelTitles.AD_GROUP:
        case SbCampaignLevelTitles.AD_GROUP:
        case SbAccountLevelTitles.PRODUCT_ADS:
        case SbCampaignLevelTitles.PRODUCT_ADS:
        case SbAdGroupLevelTitles.PRODUCT_ADS:
        case SbAccountLevelTitles.KEYWORD_TARGETING:
        case SbCampaignLevelTitles.KEYWORD_TARGETING:
        case SbAdGroupLevelTitles.KEYWORD_TARGETING:
        case SbAccountLevelTitles.PRODUCT_TARGETING:
        case SbCampaignLevelTitles.PRODUCT_TARGETING:
        case SbAdGroupLevelTitles.PRODUCT_TARGETING:
        case SbAccountLevelTitles.SEARCH_TERM:
        case SbCampaignLevelTitles.SEARCH_TERM_KEYWORD:
        case SbAdGroupLevelTitles.SEARCH_TERM_KEYWORD:
        case SdAccountLevelTitles.CAMPAIGN:
        case SdAccountLevelTitles.AD_GROUP:
        case SdCampaignLevelTitles.AD_GROUP:
        case SdAccountLevelTitles.PRODUCT_ADS:
        case SdCampaignLevelTitles.PRODUCT_ADS:
        case SdAdGroupLevelTitles.PRODUCT_ADS:
          parsedInstanceData = {
            ...parsedInstanceData,
            ...parseAmazonMetricsExportData(instance),
          };
          break;

        case WalmartSPAccountLevelTitles.CAMPAIGNS:
        case WalmartSBAccountLevelTitles.CAMPAIGNS:
          parsedInstanceData = {
            ...parsedInstanceData,
            ...parseWalmartMetricsExportData(instance),
          };
          if (accountType === WalmartAccountTypeEnum.FIRST_PARTY)
            parsedInstanceData = {
              ...parsedInstanceData,
              ...parseWalmartInstoreMetricsExportData(instance),
            };
          break;

        case WalmartSPAccountLevelTitles.AD_GROUPS:
        case WalmartSPCampaignLevelTitles.AD_GROUPS:
        case WalmartSBAccountLevelTitles.AD_GROUPS:
        case WalmartSBCampaignLevelTitles.AD_GROUPS:
        case WalmartSPAccountLevelTitles.AD_ITEMS:
        case WalmartSPCampaignLevelTitles.AD_ITEMS:
        case WalmartSPAdGroupLevelTitles.AD_ITEMS:
        case WalmartSBAccountLevelTitles.AD_ITEMS:
        case WalmartSBCampaignLevelTitles.AD_ITEMS:
        case WalmartSBAdGroupLevelTitles.AD_ITEMS:
        case WalmartSPAccountLevelTitles.KEYWORD_TARGETING:
        case WalmartSPCampaignLevelTitles.KEYWORD_TARGETING:
        case WalmartSPAdGroupLevelTitles.KEYWORD_TARGETING:
        case WalmartSBAccountLevelTitles.KEYWORD_TARGETING:
        case WalmartSBCampaignLevelTitles.KEYWORD_TARGETING:
        case WalmartSBAdGroupLevelTitles.KEYWORD_TARGETING:
        case WalmartSPAccountLevelTitles.PAGE_TYPE:
        case WalmartSPCampaignLevelTitles.PAGE_TYPE:
        case WalmartSBAccountLevelTitles.PAGE_TYPE:
        case WalmartSBCampaignLevelTitles.PAGE_TYPE:
        case WalmartSVAccountLevelTitles.PAGE_TYPE:
        case WalmartSVCampaignLevelTitles.PAGE_TYPE:
        case WalmartOverallAccountLevelTitles.PAGE_TYPE:
        case WalmartSPAccountLevelTitles.PLATFORM:
        case WalmartSPCampaignLevelTitles.PLATFORM:
        case WalmartSBAccountLevelTitles.PLATFORM:
        case WalmartSBCampaignLevelTitles.PLATFORM:
        case WalmartSVAccountLevelTitles.PLATFORM:
        case WalmartSVCampaignLevelTitles.PLATFORM:
        case WalmartOverallAccountLevelTitles.PLATFORM:
        case WalmartSVAccountLevelTitles.AD_ITEMS:
        case WalmartSVCampaignLevelTitles.AD_ITEMS:
        case WalmartSVAdGroupLevelTitles.AD_ITEMS:
        case WalmartOverallAccountLevelTitles.AD_ITEMS:
        case WalmartSPAccountLevelTitles.SEARCH_TERM:
        case WalmartSPCampaignLevelTitles.SEARCH_TERM:
        case WalmartSPAdGroupLevelTitles.SEARCH_TERM:
        case WalmartOverallAccountLevelTitles.SEARCH_TERM:
          parsedInstanceData = {
            ...parsedInstanceData,
            ...parseWalmartMetricsExportData(instance),
          };
          break;

        case WalmartSVAccountLevelTitles.CAMPAIGNS:
        case WalmartOverallAccountLevelTitles.CAMPAIGNS:
          parsedInstanceData = {
            ...parsedInstanceData,
            ...parseWalmartMetricsExportData(instance),
            ...parseWalmartVideoMetricsExportData(instance),
          };

          if (accountType === WalmartAccountTypeEnum.FIRST_PARTY)
            parsedInstanceData = {
              ...parsedInstanceData,
              ...parseWalmartInstoreMetricsExportData(instance),
            };
          break;

        case WalmartSVAccountLevelTitles.AD_GROUPS:
        case WalmartSVCampaignLevelTitles.AD_GROUPS:
        case WalmartOverallAccountLevelTitles.AD_GROUPS:
        case WalmartSVAccountLevelTitles.KEYWORD_TARGETING:
        case WalmartSVCampaignLevelTitles.KEYWORD_TARGETING:
        case WalmartSVAdGroupLevelTitles.KEYWORD_TARGETING:
        case WalmartOverallAccountLevelTitles.KEYWORD_TARGETING:
          parsedInstanceData = {
            ...parsedInstanceData,
            ...parseWalmartMetricsExportData(instance),
            ...parseWalmartVideoMetricsExportData(instance),
          };
          break;

        default:
          parsedInstanceData = { ...parsedInstanceData, ...instance };
          break;
      }

      return parsedInstanceData;
    });
    return parsedExportData;
  } else {
    return data;
  }
};

export function flattenObject<T extends Record<string, any>>(
  obj: T,
  parentKey = '',
  result: Record<string, any> = {}
): Record<string, any> {
  for (const key in obj) {
    const newKey = parentKey ? `${parentKey}.${key}` : key;
    const value = obj[key];

    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      flattenObject(value, newKey, result);
    } else {
      result[newKey] = value;
    }
  }
  return result;
}
export function flattenData<T extends Record<string, any>>(
  data: T | T[]
): Record<string, any>[] {
  if (Array.isArray(data)) {
    return data.flatMap((item) => flattenData(item));
  }

  const arrayKey = Object.keys(data).find((key) =>
    Array.isArray((data as Record<string, any>)[key])
  );

  if (arrayKey) {
    const arr = (data as Record<string, any>)[arrayKey] as Record<
      string,
      any
    >[];

    return arr.map((item) => ({
      ...flattenObject(data),
      ...flattenObject(item),
    }));
  }

  return [flattenObject(data)];
}
export const checkMomentDateValidity = (date: string | undefined) => {
  if (date?.toString().length !== 10) return false;
  return moment(date, true).isValid();
};

export const getUrlWithQuery = (link: string): string => {
  const search = window.location.search;
  const urlWithQuery = link + search;
  return urlWithQuery;
};

export const displayValue = (
  value: string | number | null,
  isPercentage = true
) => {
  if (value === null || value === undefined || value === '-') {
    return '-';
  }

  const numberValue = reverseFormattedNumToNumber(value);
  return isPercentage
    ? `${value}%`
    : numberValue < 0
    ? `-${getCurrencySymbolByCountry()}${formatNum(Math.abs(numberValue))}`
    : `${getCurrencySymbolByCountry()}${value}`;
};

export const genExportFileName = (
  marketplace: string,
  tableName: string
): string => {
  const date = getCurrentDateTime();
  return `${marketplace?.toLowerCase()}_${tableName?.toLowerCase()}_${date}.csv`;
};

export const isLast2RowsReached = (
  rowIndex: number,
  last2RowsIndex: number[],
  dataCount: number
): boolean => {
  if (!dataCount) return false;

  if (dataCount === 1) return false;

  if (dataCount <= 3) {
    return rowIndex === last2RowsIndex[1];
  }

  return last2RowsIndex[0] === rowIndex || last2RowsIndex[1] === rowIndex;
};

export const wrapTextArray = (texts: string[], maxChar: number) => {
  return texts.map((text) => wrapText(text, maxChar));
};

export const wrapText = (text: string, maxChar: number) => {
  if (text.length > maxChar) {
    const trimmedText = text.slice(0, maxChar);
    const lastSpaceIndex = trimmedText.lastIndexOf(' ');

    if (lastSpaceIndex !== -1) {
      return trimmedText.slice(0, lastSpaceIndex) + '...';
    } else {
      return trimmedText + '...';
    }
  }
  return text;
};
export const handleOnboardingConnect = (redirect_link: string) => {
  window.location.href = redirect_link;
};

export const getSelectedRowIds = (
  selectedRowIds: RowSelectionState
): number[] => {
  return Object.keys(selectedRowIds)
    .filter((id) => selectedRowIds[id])
    .map(Number)
    .filter((num) => !isNaN(num));
};

export const getToastStyle = (
  index: number,
  activeIndex: number
): React.CSSProperties => {
  const isVisible = index === activeIndex;
  const baseZIndex = 10000 - index;

  return {
    zIndex: baseZIndex,
    opacity: isVisible ? 1 : 0,
    pointerEvents: isVisible ? 'auto' : 'none',
    transform: `translateX(${(index - activeIndex) * 10}%)`,
    transition: 'transform 0.3s ease-in-out, opacity 0.3s ease-in-out',
    position: 'absolute',
    bottom: 0,
    width: '100%',
  };
};

export const convertToDateFormat = (value: string | number) => {
  const isDateFormat = checkMomentDateValidity(value.toString());

  if (isDateFormat && checkIsIndefiniteDate(`${value}`)) {
    return INDEFINITE;
  }

  return isDateFormat
    ? getFormattedDateWithFormat(value.toString(), DATE_FORMAT_13)
    : value;
};

export const getSelectedDateLabel = (
  value: string | null,
  isChecked?: boolean
) => {
  if (isChecked) return INDEFINITE;
  else if (value) return getFormattedDateWithFormat(value, DATE_FORMAT_18);
  else return DATE_FORMAT_18;
};

export const getSelectedDateArrayLabel = (dates: string[] | null): string => {
  if (!dates || !dates.length) return 'Select date';

  const sorted = [...dates].sort(
    (a, b) => moment(a).valueOf() - moment(b).valueOf()
  );

  const grouped = sorted.reduce<Record<string, moment.Moment[]>>(
    (acc, date) => {
      const m = moment(date);
      const key = m.format(DATE_FORMAT_22);

      acc[key] = acc[key] || [];
      acc[key].push(m);

      return acc;
    },
    {}
  );

  const months = Object.values(grouped);
  const shortMode = months.length > 3;

  const labels = months.map((monthDates) => {
    const month = monthDates[0];

    const monthName = month.format(DATE_FORMAT_9);
    const year = month.format(DATE_FORMAT_11);

    if (monthDates.length <= 3 && !shortMode) {
      const days = monthDates.map((d) => d.format(DAY_FORMAT_1)).join(', ');

      return `${days} of ${monthName}, ${year}`;
    }

    return `${monthDates.length} days of ${monthName}, ${year}`;
  });

  if (labels.length <= 6) return labels.join(' | ');

  return `${labels.slice(0, 6).join(' | ')}\n${labels.slice(6).join(' | ')}`;
};

export const updateProgress = (
  start: number,
  end: number,
  duration: number,
  setValue: React.Dispatch<React.SetStateAction<number>>
) => {
  const step = (end - start) / (duration / 100);

  const interval = setInterval(() => {
    setValue((prev) => {
      const next = prev + step;

      if (step > 0) {
        if (next >= end) {
          clearInterval(interval);
          return end;
        }
      } else if (step < 0) {
        if (next <= Math.max(end, 0)) {
          clearInterval(interval);
          return Math.max(end, 0);
        }
      }

      return Math.max(next, 0);
    });
  }, 100);

  return interval;
};
export const getValidNumber = (value: string | number | null | undefined) => {
  if (value === null || value === undefined) return NaN;

  const valueStr = String(value);
  let formattedValue: number = parseFloat(valueStr);

  if (valueStr.includes('.')) {
    const parts = valueStr.split('.');
    if (parts[1].length > 2) {
      formattedValue = parseFloat(`${parts[0]}.${parts[1].substring(0, 2)}`);
    }
  }
  return checkIsNumber(formattedValue) ? formattedValue : NaN;
};

export const checkIsNumber = (value: unknown): boolean => {
  if (typeof value !== 'number' || Number.isFinite(value) === false)
    return false;
  return true;
};

export const getWholeNumber = (value: string | number) => {
  return Math.floor(Number(value));
};

export const getRoundedNumber = (value: string | number) => {
  return Math.round(Number(value));
};

export const getCountryCode = () => {
  const countryCode =
    localStorageUtils.getAccountCountryCode() ?? CountryCodeEnum.UnitedStates;

  return countryCode;
};

export const getConfigForCountry = (
  optionalCountryCode?: string
): IRegionAccountConfig => {
  const countryCode = optionalCountryCode ?? getCountryCode();
  const regionConfig = RegionAccountConfigs.find(
    (config) => config.COUNTRY_CODE === countryCode
  );
  if (!regionConfig) return USAccountConfig;
  return regionConfig;
};

export const getCurrencySymbolByCountry = () => {
  const config = getConfigForCountry();
  return config.CURRENCY_SYMBOL ?? '$';
};

export const getAmzSPMinBidLimitByCountry = () => {
  const config = getConfigForCountry();
  return config.SP_BID_MIN_LIMIT;
};

export const getAmzSPMaxBidLimitByCountry = () => {
  const config = getConfigForCountry();
  return config.SP_BID_MAX_LIMIT;
};

export const getAmzSPBudget1PMaxLimitByCountry = () => {
  const config = getConfigForCountry();
  return config.SP_BUDGET_1P_MAX_LIMIT;
};

export const getAmzSPBudget1PMinLimitByCountry = () => {
  const config = getConfigForCountry();
  return config.SP_BUDGET_1P_MIN_LIMIT;
};

export const getAmzSPBudget3PMaxLimitByCountry = () => {
  const config = getConfigForCountry();
  return config.SP_BUDGET_3P_MAX_LIMIT;
};

export const getAmzSPBudget3PMinLimitByCountry = () => {
  const config = getConfigForCountry();
  return config.SP_BUDGET_3P_MIN_LIMIT;
};

export const getAmzSBBudgetDaily3PMinLimitByCountry = () => {
  const config = getConfigForCountry();
  return config.SB_BUDGET_DAILY_3P_MIN_LIMIT;
};

export const getAmzSBBudgetDaily3PMaxLimitByCountry = () => {
  const config = getConfigForCountry();
  return config.SB_BUDGET_DAILY_3P_MAX_LIMIT;
};

export const getAmzSBBudgetDaily1PMinLimitByCountry = () => {
  const config = getConfigForCountry();
  return config.SB_BUDGET_DAILY_1P_MIN_LIMIT;
};

export const getAmzSBBudgetDaily1PMaxLimitByCountry = () => {
  const config = getConfigForCountry();
  return config.SB_BUDGET_DAILY_1P_MAX_LIMIT;
};

export const getAmzSBBudgetLifetime3PMinLimitByCountry = () => {
  const config = getConfigForCountry();
  return config.SB_BUDGET_LIFETIME_3P_MIN_LIMIT;
};

export const getAmzSBBudgetLifetime3PMaxLimitByCountry = () => {
  const config = getConfigForCountry();
  return config.SB_BUDGET_LIFETIME_3P_MAX_LIMIT;
};

export const getAmzSBBudgetLifetime1PMinLimitByCountry = () => {
  const config = getConfigForCountry();
  return config.SB_BUDGET_LIFETIME_1P_MIN_LIMIT;
};

export const getAmzSBBudgetLifetime1PMaxLimitByCountry = () => {
  const config = getConfigForCountry();
  return config.SB_BUDGET_LIFETIME_1P_MAX_LIMIT;
};

export const getAmzSDBudget1PMaxLimitByCountry = () => {
  const config = getConfigForCountry();
  return config.SD_BUDGET_1P_MAX_LIMIT;
};

export const getAmzSDBudget3PMinLimitByCountry = () => {
  const config = getConfigForCountry();
  return config.SD_BUDGET_3P_MIN_LIMIT;
};

export const getAmzSDBudget3PMaxLimitByCountry = () => {
  const config = getConfigForCountry();
  return config.SD_BUDGET_3P_MAX_LIMIT;
};

export const getAmz_SD_CPC_MinBidLimitByCountry = () => {
  const config = getConfigForCountry();
  return config.SD_CPC_BID_MIN_LIMIT;
};

export const getAmz_SD_CPC_MaxBidLimitByCountry = () => {
  const config = getConfigForCountry();
  return config.SD_CPC_BID_MAX_LIMIT;
};

export const getAmz_SB_CPC_Img_MinBidLimitByCountry = () => {
  const config = getConfigForCountry();
  return config.SB_CPC_IMAGE_BID_MIN_LIMIT;
};

export const getAmz_SB_CPC_Img_MaxBidLimitByCountry = () => {
  const config = getConfigForCountry();
  return config.SB_CPC_IMAGE_BID_MAX_LIMIT;
};

export const getAmzProductUrlByCountry = () => {
  const config = getConfigForCountry();
  return config.SITE_URL
    ? `${config.SITE_URL}/dp/`
    : `${USAccountConfig.SITE_URL}/dp/`;
};

export const getAmz_SBV_CPC_Vid_MaxBidLimitByCountry = () => {
  const config = getConfigForCountry();

  return config.SBV_CPC_VIDEO_BID_MAX_LIMIT;
};

export const getAmz_SBV_CPC_Vid_MinBidLimitByCountry = () => {
  const config = getConfigForCountry();

  return config.SBV_CPC_VIDEO_BID_MIN_LIMIT;
};

export const getAmz_SBV_VCPM_Vid_BIS_MaxBidLimitByCountry = () => {
  const config = getConfigForCountry();

  return config.SBV_VCPM_VIDEO_BIS_BID_MAX_LIMIT;
};

export const getAmz_SBV_VCPM_Vid_BIS_MinBidLimitByCountry = () => {
  const config = getConfigForCountry();

  return config.SBV_VCPM_VIDEO_BIS_BID_MIN_LIMIT;
};

export const getAmz_SBV_VCPM_Vid_NTB_MaxBidLimitByCountry = () => {
  const config = getConfigForCountry();

  return config.SBV_VCPM_VIDEO_NTB_BID_MAX_LIMIT;
};

export const getAmz_SBV_VCPM_Vid_NTB_MinBidLimitByCountry = () => {
  const config = getConfigForCountry();

  return config.SBV_VCPM_VIDEO_NTB_BID_MIN_LIMIT;
};

export const getAmz_SB_VCPM_Img_BIS_MaxBidLimitByCountry = () => {
  const config = getConfigForCountry();

  return config.SB_VCPM_IMAGE_BIS_BID_MAX_LIMIT;
};

export const getAmz_SB_VCPM_Img_BIS_MinBidLimitByCountry = () => {
  const config = getConfigForCountry();

  return config.SB_VCPM_IMAGE_BIS_BID_MIN_LIMIT;
};

export const getAmz_SB_VCPM_Img_NTB_MinBidLimitByCountry = () => {
  const config = getConfigForCountry();

  return config.SB_VCPM_IMAGE_NTB_BID_MIN_LIMIT;
};

export const getAmz_SB_VCPM_Img_NTB_MaxBidLimitByCountry = () => {
  const config = getConfigForCountry();

  return config.SB_VCPM_IMAGE_NTB_BID_MAX_LIMIT;
};

export const getAmz_SD_VCPM_MinBidLimitByCountry = () => {
  const config = getConfigForCountry();

  return config.SD_VCPM_BID_MIN_LIMIT;
};

export const getAmz_SD_VCPM_MaxBidLimitByCountry = () => {
  const config = getConfigForCountry();

  return config.SD_VCPM_BID_MAX_LIMIT;
};

export const getAmzSDBudget1PMinLimitByCountry = () => {
  const config = getConfigForCountry();

  return config.SD_BUDGET_1P_MIN_LIMIT;
};

export const getCountryFlagIcon = (countryCode: Nullable<string>) => {
  if (!countryCode) return imageUrls.usFlag;

  switch (countryCode) {
    case CountryCodeEnum.Canada:
      return imageUrls.caFlag;
    case CountryCodeEnum.UnitedStates:
      return imageUrls.usFlag;
    case CountryCodeEnum.Mexico:
      return imageUrls.mxFlag;
    case CountryCodeEnum.Brazil:
      return imageUrls.brFlag;
    case CountryCodeEnum.Spain:
      return imageUrls.esFlag;
    case CountryCodeEnum.UnitedKingdom:
      return imageUrls.gbFlag;
    case CountryCodeEnum.France:
      return imageUrls.frFlag;
    case CountryCodeEnum.Belgium:
      return imageUrls.beFlag;
    case CountryCodeEnum.Netherlands:
      return imageUrls.nlFlag;
    case CountryCodeEnum.Germany:
      return imageUrls.deFlag;
    case CountryCodeEnum.Italy:
      return imageUrls.itFlag;
    case CountryCodeEnum.Sweden:
      return imageUrls.seFlag;
    case CountryCodeEnum.SouthAfrica:
      return imageUrls.zaFlag;
    case CountryCodeEnum.Poland:
      return imageUrls.plFlag;
    case CountryCodeEnum.Egypt:
      return imageUrls.egFlag;
    case CountryCodeEnum.SaudiArabia:
      return imageUrls.saFlag;
    case CountryCodeEnum.Turkey:
      return imageUrls.trFlag;
    case CountryCodeEnum.UnitedArabEmirates:
      return imageUrls.aeFlag;
    case CountryCodeEnum.India:
      return imageUrls.inFlag;
    case CountryCodeEnum.Singapore:
      return imageUrls.sgFlag;
    case CountryCodeEnum.Australia:
      return imageUrls.auFlag;
    case CountryCodeEnum.Japan:
      return imageUrls.jpFlag;
    default:
      return imageUrls.usFlag;
  }
};

export const getTimeZoneByCountry = (countryCode?: string) => {
  const config = getConfigForCountry(countryCode);

  return config.TIMEZONE ?? TimezoneEnum.US_PACIFIC;
};

export const getAmzSiteURLByCountry = (countryCode?: string) => {
  const config = getConfigForCountry(countryCode);
  return config.SITE_URL ?? AmazonWebsiteUrlEnum.UNITED_STATES;
};
export const remToPx = (rem: number) => {
  return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
};

export const isJson = (str: string) => {
  try {
    JSON.parse(str);
    return true;
  } catch {
    return false;
  }
};

export const getChatbotHeaders = (marketplace: string) => {
  const authToken = localStorageUtils.getAuthToken();
  const account = localStorageUtils.getAccountDetails();
  const selectedAdvertisingAccount =
    localStorageUtils.getSelectedAdvertisingAccount();
  const headers = {
    'Content-Type': 'application/json',
    AccountId: `${account?._id}`,
    Authorization: `Bearer ${authToken}`,
    [AMAZON_ADVERTISING_PROFILE_ID_HEADER_KEY]: `${
      marketplace === MarketplaceEnum.AMAZON
        ? selectedAdvertisingAccount?.advertising?.amazonProfileId
        : ''
    }`,
    [WALMART_ADVERTISING_ID_HEADER_KEY]: `${
      marketplace === MarketplaceEnum.WALMART
        ? selectedAdvertisingAccount?.advertising?.walmartAdvertiserId
        : ''
    }`,
  };

  return headers;
};

export const transposeData = <T extends Record<string, any>>(
  data: Array<T>,
  firstKeyField?: keyof T
): Array<any> => {
  if (!data?.length) return data;

  const firstKey = firstKeyField ?? Object.keys(data[0])[0];

  const keys = Object.keys(data[0]).slice(1);

  return keys.map((key) => {
    const row: Record<string, any> = { [firstKey]: key };

    for (let i = 0; i < data.length; i++) {
      const columnHeader = hasProperty(data[i], firstKey)
        ? data[i][firstKey]
        : `Column ${i + 1}`;
      row[columnHeader] = hasProperty(data[i], key) ? data[i][key] : '';
    }

    return row;
  });
};

export const getCSVDownload = async (
  exportData: Array<any>,
  filename: string | undefined = undefined,
  title: string | undefined = undefined,
  accountType: string | undefined = undefined,
  isGraph = false,
  frequency?: string,
  shouldTranspose = false,
  marketplace = MarketplaceEnum.AMAZON
) => {
  const getParsedExportData = convertObjectKeysToTitleCase(
    isGraph
      ? parseGraphExportData(
          formatDataToDownload(exportData),
          title as string,
          accountType,
          frequency
        )
      : parseTableExportData(
          formatDataToDownload(exportData, title === COGS_DOWNLOAD_TEMPLATE),
          title as string,
          accountType,
          marketplace
        ),
    title !== COGS_DOWNLOAD_TEMPLATE
  );

  const finalData = shouldTranspose
    ? transposeData(getParsedExportData)
    : getParsedExportData;
  const csvData = Papa.unparse(transformCsvExportData(finalData));
  const blob = new Blob([csvData], {
    type: 'text/csv;charset=utf-8;',
  });

  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename as string;

  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const transformCsvExportData = (finalData: Array<Record<string, any>>) => {
  return finalData.map((row: Record<string, any>) => {
    const updatedRow: Record<string, unknown> = {};
    const keys = Object.keys(row);
    keys.forEach((key) => {
      const value = row[key];
      if (typeof value === 'object') updatedRow[key] = JSON.stringify(value);
      else if (typeof value === 'string' && LEADING_ZERO_REGEX.test(value))
        updatedRow[key] = `="${value}"`;
      else updatedRow[key] = value;
    });

    return updatedRow;
  });
};

export const getRatio = (numA: number | string, numB: number | string) => {
  if (Number.isNaN(numA) || Number.isNaN(numB)) return 0;
  return parseNum(numB) !== 0 ? parseNum(numA) / parseNum(numB) : 0;
};

export const getDateRangeDisplayValue = ({
  showLabel,
  isProfitability,
  tempPreset,
  tempDateRange,
  isNoEndDateChecked,
  frequencyState,
}: {
  showLabel: boolean;
  isProfitability: boolean;
  tempPreset: { value: string; label: string };
  tempDateRange: { startDate?: string; endDate?: string };
  isNoEndDateChecked: boolean;
  frequencyState?: Array<{ selected?: boolean; label: string }>;
}): string => {
  if (
    showLabel ||
    (isProfitability && tempPreset.value !== Range.CUSTOM_RANGE)
  ) {
    return tempPreset.label;
  }

  const dateRangeForDisplay = {
    startDate: tempDateRange.startDate || '',
    endDate: tempDateRange.endDate,
  };
  let displayValue = formatDisplayRange(
    dateRangeForDisplay,
    DATE_FORMAT_19,
    isNoEndDateChecked
  );

  if (isProfitability) {
    const frequencyLabel = frequencyState?.filter(
      (item) => item.selected === true
    )[0]?.label;

    if (frequencyLabel) {
      displayValue += ` (${frequencyLabel})`;
    }
  }

  return displayValue;
};

export const getNumberFromString = (currStr: string): number | null => {
  if (!currStr || typeof currStr !== 'string') return null;

  const numericValue = parseFloat(currStr.replace(/[^-.\d]/g, ''));

  return isNaN(numericValue) ? null : numericValue;
};

export const getDisclaimerByPageTitle = (pageTitle: PageTitleEnum) => {
  switch (pageTitle) {
    case PageTitleEnum.PROFITABILITY_DASHBOARD:
    case PageTitleEnum.PROFITABILITY_TRENDS:
    case PageTitleEnum.PROFITABILITY_PROFIT_N_LOSS:
      return `Fee reconciliation data is delayed due to Walmart’s billing cycle.`;
    default:
      return '';
  }
};

export const checkIsPageInBeta = (pageTitle: string) => {
  switch (pageTitle) {
    case PageTitleEnum.PROFITABILITY_DASHBOARD:
    case PageTitleEnum.PROFITABILITY_PROFIT_N_LOSS:
    case PageTitleEnum.PROFITABILITY_TRENDS:
    case PageTitleEnum.RULES_AGENTS:
    case PageTitleEnum.APPLIED_RULES:
    case PageTitleEnum.RULES_CREATION:
      return true;
    default:
      return false;
  }
};

export const checkIsFeatureInBeta = (feature: FeatureRoutes) => {
  switch (feature) {
    case FeatureRoutes.PROFITABILITY:
    case FeatureRoutes.RULES:
    case FeatureRoutes.JIVA_CHATBOT_PAGE:
      return true;
    default:
      return false;
  }
};

export const parseToJSON = (jsonString: string) => {
  if (isJson(jsonString) === false) return '';
  return JSON.parse(jsonString);
};

export const handleQueryCancellation = (queryClient: QueryClient) => {
  queryClient.cancelQueries({
    predicate: (query) => {
      return query.queryKey.includes(QueryKeyEnums.ALL);
    },
  });
};

export const getUpdatedPagination = (
  pagination: PaginationState
): PaginationState => {
  return {
    ...pagination,
    pageIndex: 0,
  };
};

export const generateNItems = (N: number, defaultVal: unknown) =>
  Array(N).fill(defaultVal);

export const padZeroToNumbers = (num: number, showZeroValues = false) => {
  if (num === 0) {
    if (showZeroValues) return '00';
    else return '';
  }
  if (num < 10) return `0${num}`;
  return num;
};
export const findByValueForIDropDownItem = <T>(
  items: IDropdownItem<T>[],
  filterValue: T | string,
  fallBackValue: IDropdownItem<T>
) => {
  return items.find((item) => item.value === filterValue) ?? fallBackValue;
};

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay = 200
) {
  let timeoutId: NodeJS.Timeout;

  const debounced = function (
    this: ThisParameterType<T>,
    ...args: Parameters<T>
  ) {
    clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };

  debounced.cancel = () => {
    clearTimeout(timeoutId);
  };

  return debounced;
}

export const formatHeaderText = (text: string): string => {
  const spacedText = text
    .replace(/_/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2');
  return getTitleCaseString(spacedText);
};

export const buildQueryKeyWithAccountIds = (
  queryKey: any[],
  selectedAccountId: string | null | undefined,
  selectedAdvertisingAccountId: string | undefined,
  selectedCatalogAccountId: string | undefined
): any[] => {
  if (selectedAccountId) {
    return [
      ...queryKey,
      QueryKeyEnums.ALL,
      `${selectedAccountId}-${selectedAdvertisingAccountId}-${selectedCatalogAccountId}`?.trim(),
    ];
  }
  return [...queryKey, QueryKeyEnums.ALL];
};

export const shouldShowHeader = (pathname: string) => {
  return !pathname.startsWith('/user');
};

export const shouldShowSidebar = (pathname: string) => {
  return (
    !pathname.startsWith(ONBOARDING_CONNECTING_PAGE) &&
    !pathname.startsWith('/user')
  );
};
export const getRedirectURLByWMTClientType = (
  accountType: WalmartClientTypeEnum,
  advertiserId?: string
) => {
  const state =
    checkIsNull(advertiserId) === false
      ? `${generateRandomID()}_${advertiserId}`
      : generateRandomID();
  return ONBOARDING_WMT_MARKETPLACE_URL.replace('{client}', accountType)
    .replace('{state}', state)
    .replace('{nonce}', generateRandomID())
    .replace(
      '{clientId}',
      accountType === WalmartClientTypeEnum.SELLER
        ? WMT_SELLER_CLIENT_ID
        : WMT_SUPPLIER_CLIENT_ID
    )
    .replace(
      '{redirectUri}',
      accountType === WalmartClientTypeEnum.SELLER
        ? WALMART_MARKETPLACE_REDIRECT_URL
        : WALMART_SUPPLIER_REDIRECT_URL
    );
};

export const generateRandomID = (): string => {
  return uuidV4().replace(/-/g, '');
};

export const getUniqueDropDownItems = <T>(items: IDropdownItem<T>[]) => {
  const presentItems = new Map<T, IDropdownItem<T>>();
  items.forEach((item) => {
    presentItems.set(item.value, item);
  });

  return Array.from(presentItems.values());
};
export const convertToUpperCase = (str: string | undefined | null) => {
  if (checkIsNull(str)) return '';
  return str?.toUpperCase();
};

export const getAvatarTitle = (
  firstName: string | undefined,
  lastName: string | undefined
) => {
  if (checkIsNull(firstName) === false && checkIsNull(lastName) === false)
    return `${convertToUpperCase(firstName?.[0])}${convertToUpperCase(
      lastName?.[0]
    )}`;
  if (checkIsNull(firstName)) return convertToUpperCase(lastName?.[0]);

  if (checkIsNull(lastName)) return convertToUpperCase(firstName?.[0]);
};

export const formatStringToTitleCase = (
  value: string | undefined | null
): string => {
  if (checkIsNull(value) || typeof value !== 'string') return '-';
  return value
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(
      /\w\S*/g,
      (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    );
};

export const checkIsValidObject = (obj: unknown): obj is object => {
  return (
    obj !== null && typeof obj === 'object' && checkIsObjectEmpty(obj) === false
  );
};
export const encodeURIString = (value: string | number | boolean): string =>
  encodeURIComponent(value);

export const getSelectedFilterFromValue = <T>(
  options: IDropdownItem<T>[],
  value: T,
  fallbackSelectedFilter: IDropdownItem<T>
): IDropdownItem<T> => {
  if (!value || !options || !options.length) return fallbackSelectedFilter;
  const selectedFilter = options.find((option) => option.value === value);
  if (!selectedFilter) return options[0];
  return selectedFilter;
};

export const getSingleSelectionDropdownOptionsFromMapping = <T extends string>(
  valueArray: Array<T>,
  mapping: Record<string, string>,
  identicalLabelValue: Array<string> = []
): Array<IDropdownItem<T>> => {
  if (!valueArray || !valueArray.length) return [];

  const options = valueArray.map((item) => {
    if (identicalLabelValue.includes(item)) {
      return {
        value: item,
        label: getTitleCaseString(item),
        isDisabled: false,
      } as IDropdownItem<T>;
    }

    return {
      value: item,
      label: mapping[item],
      isDisabled: false,
    } as IDropdownItem<T>;
  });

  return options;
};

export const getOnlyNonNegativeNumber = (value: number): number => {
  if (value < 0) return 0;
  else return value;
};

export const getTableTitle = (title: string, isSource: boolean): string =>
  isSource ? `All_${title}` : `Added_${title}`;

export const getArrayOfEnums = <T extends Record<string, string>>(e: T) => {
  return Object.values(e) as T[keyof T][];
};

export const splitStringByDelimiters = (
  value: string,
  splitOnSpaces = true
) => {
  if (value.trim() === '') return [];
  return value
    .split(
      splitOnSpaces
        ? STRING_DELIMITER_REGEX_FORMAT
        : STRING_DELIMITER_REGEX_WITHOUT_SPACE_FORMAT
    )
    .map((word) => word.trim())
    .filter((word) => word.length > 0);
};

export const isNearBottom = (el: HTMLElement, threshold = 16) => {
  return el.scrollHeight - el.scrollTop - el.clientHeight < threshold;
};

export const getSymbolBasedOnMetric = (metric: string) => {
  if (percentageMetrics.includes(metric)) return '%';
  if (currencyMetrics.includes(metric)) return getCurrencySymbolByCountry();
  return null;
};

export const hasProperty = <T, K extends PropertyKey>(
  obj: T,
  prop: K
): obj is T & Record<K, any> => {
  if (checkIsValidObject(obj) === false) return false;
  return Object.prototype.hasOwnProperty.call(obj, prop);
};

export const convertToLowerCase = (str: string | undefined | null) => {
  if (checkIsNull(str)) return '';
  return str.toLowerCase();
};

export const isLowerCase = (char: string) => {
  return char === char.toLowerCase() && char !== char.toUpperCase();
};

export const convertObjectKeysToTitleCase = <T extends object>(
  data: T[],
  convertToTitleCase = true
) => {
  if (!convertToTitleCase) return data;
  return data.map((item: Record<string, any>) => {
    const formattedItem: Record<string, any> = {};
    Object.keys(item).forEach((key) => {
      formattedItem[isLowerCase(key[0]) ? formatStringToTitleCase(key) : key] =
        item[key];
    });
    return formattedItem;
  });
};
export const convertGraphLabelByFrequency = (
  label: string | null,
  frequency: Frequency | string
) => {
  if (checkIsNull(label)) return '';
  if (frequency === Frequency.DAILY)
    return getFormattedDateWithFormat(label, DATE_FORMAT_13);
  if (frequency === Frequency.MONTHLY) return formatYearMonth(label);
  if (frequency === Frequency.WEEKLY) return formatYearWeek(label);
  return label;
};

export const formatSelectedProfiles = (profiles: IAdvertisingProfiles[]) => {
  return profiles.map((profile) => {
    return {
      ...profile,
      profileId: String(profile.profileId),
    };
  });
};

export const getMenuItemBySelectedSubMenu = (
  items: IMenuItem[],
  selectedSubMenuItem: string
): IMenuItem | undefined => {
  return items.find((item) =>
    item.subMenu?.some((subItem) => subItem.key === selectedSubMenuItem)
  );
};

export const removeKeysFromArrayOfObjects = <
  T extends object,
  K extends keyof T
>(
  objArray: T[],
  keys: K[]
): Omit<T, K>[] => {
  return objArray.map((item) => {
    const copy = { ...item };
    keys.forEach((key) => delete copy[key as K]);
    return copy;
  });
};

export const pickKeysFromArrayOfObjects = <T extends object, K extends keyof T>(
  objArray: T[],
  keys: readonly K[]
): Pick<T, K>[] => {
  return objArray.map((item) => {
    const result = {} as Pick<T, K>;

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      result[key] = item[key];
    }

    return result;
  });
};

export const pickKeysFromObject = <T extends object, K extends keyof T>(
  obj: T,
  keys: readonly K[]
): Pick<T, K> => {
  const result = {} as Pick<T, K>;

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    result[key] = obj[key];
  }

  return result;
};

export const mapOperations = {
  getMapFromArray: <T, K extends string | number>(
    data: T[],
    getKey: (item: T) => K
  ): Map<string, T> => {
    const targetMap = new Map<string, T>();

    if (!data?.length) return targetMap;

    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      const key = getKey(item);

      if (key) {
        targetMap.set(String(key), item);
      }
    }

    return targetMap;
  },

  addUpdateToMap: <T>(
    map: Map<string, T> | null,
    key: string | number,
    value: T
  ): Map<string, T> => {
    const newMap = new Map<string, T>(map ?? []);
    newMap.set(String(key), value);
    return newMap;
  },

  deleteFromMap: <T>(
    map: Map<string, T>,
    key: string | number
  ): Map<string, T> => {
    if (!map.has(String(key))) return map;

    const newMap = new Map(map);
    newMap.delete(String(key));
    return newMap;
  },

  getArrayFromMap: <T>(map: Map<string, T> | null): T[] => {
    return map ? Array.from(map.values()) : [];
  },
};

export const setOperations = {
  getSetFromArray: <T, K extends string | number>(
    data: T[],
    getKey: (item: T) => K
  ): Set<string | number> => {
    const targetSet = new Set<string | number>();

    if (!data?.length) return targetSet;

    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      const key = getKey(item);

      if (key) {
        targetSet.add(key);
      }
    }

    return targetSet;
  },
};

export const recordOperations = {
  getRecordFromArray: <T, K extends string | number>(
    data: T[],
    getKey: (item: T) => K
  ): Record<string, T> => {
    const targetRecord: Record<string, T> = {};

    if (!data?.length) return targetRecord;

    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      const key = getKey(item);

      if (key) {
        targetRecord[String(key)] = item;
      }
    }

    return targetRecord;
  },

  addUpdateToRecord: <T>(
    record: Record<string, T> | null,
    key: string | number,
    value: T
  ): Record<string, T> => {
    return {
      ...(record ?? {}),
      [String(key)]: value,
    };
  },

  deleteFromRecord: <T>(
    record: Record<string, T>,
    key: string | number
  ): Record<string, T> => {
    const stringKey = String(key);

    if (!(stringKey in record)) return record;

    const newRecord = { ...record };

    delete newRecord[stringKey];

    return newRecord;
  },

  getArrayFromRecord: <T, K extends keyof T>(
    record: Record<string, T> | null,
    sortKey?: K,
    sortOrder: SortOrderEnum.ASC | SortOrderEnum.DESC = SortOrderEnum.ASC
  ): T[] => {
    if (!record) return [];

    const values = Object.values(record);

    if (!sortKey) return values;

    return [...values].sort((a, b) => {
      const aValue = a[sortKey];
      const bValue = b[sortKey];

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === SortOrderEnum.ASC
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortOrder === SortOrderEnum.ASC
          ? aValue - bValue
          : bValue - aValue;
      }

      return 0;
    });
  },
};

export const isValidMinStringLength = (
  str: string,
  minLen = TEXT_LEN_MIN_DEFAULT_LIMIT
): boolean => {
  if (!str) return false;
  return str.length >= minLen;
};

export const isValidMaxStringLength = (
  str: string,
  maxLen = TEXT_LEN_MAX_DEFAULT_LIMIT
): boolean => {
  if (!str) return false;
  return str.length <= maxLen;
};

export const getTitleByFeature = (feature: string) => {
  switch (feature) {
    case FeaturesEnum.PROFITABILITY_AMAZON:
      return 'Amazon Profitability';
    case FeaturesEnum.PROFITABILITY_WALMART:
      return 'Walmart Profitability';
    default:
      return formatStringToTitleCase(feature);
  }
};

export const isIndefiniteDate = (
  date: string | undefined,
  indefiniteDate = WALMART_INDEFINITE_END_DATE
): boolean => {
  return (
    !date ||
    (date !== undefined &&
      new Date(date ?? '').getTime() >= new Date(indefiniteDate).getTime())
  );
};

export const getSumOfTableArray = <T>(arr: Row<T>[], field: keyof T) => {
  return arr.reduce((sum, row) => sum + Number(row.original[field]), 0);
};
