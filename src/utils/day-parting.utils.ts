import { AD_TYPE_MAPPING } from '@/constants/advertising-filter.constants';
import { DATE_FORMAT_3, TIME_FORMAT_2 } from '@/constants/datetime.constants';
import { DAY_PARTING_CAMPAIGNS_REGEX_FORMAT } from '@/constants/regex.constants';
import { textTitleStyles } from '@/constants/table-columns/new-column-names.constants';
import {
  DAY_PARTING_HISTORY_URL,
  DAY_PARTING_PAGE_URL,
  DAY_PARTING_SCHEDULED_JOBS_URL,
} from '@/constants/urls.constants';
import { MarketplaceEnum, Range } from '@/enums/serp.enums';
import { WalmartCampaignStatusEnum } from '@/enums/walmart.enums';
import { getTodayByTimeZone } from '@/utils/datetime.utils';
import moment from 'moment';
import { IDropdownItem } from 'src/app/components/common/dropdown/dropdown';
import {
  DAY_PARTING_WEEKLY_DAYS_MAPPING,
  dayPartingBidAdjustmentOptions,
  dayPartingRecurrenceDaysOptions,
  dayPartingTabData,
  dayPartingTimeOptions,
  dayPartingWalmartTabData,
} from 'src/constants/day-parting.constants';
import { defaultTimeRange, WEEKDAYS } from 'src/constants/dayparting.constants';
import { GRID_COLUMNS, GRID_ROWS } from 'src/constants/grid.constants';
import {
  AdTypeShort,
  BidderStatusEnum,
  BidderTypeEnum,
  CampaignStateEnum,
  MetricsKeysEnum,
} from 'src/enums/advertising.enums';
import {
  DaypartingBidChangeTypeEnum,
  DaypartingJobStatusEnum,
  DaypartingRecurrenceDaysEnum,
  DaypartingRecurrenceTypeEnum,
  DaypartingTabsEnum,
  DaypartingTimeRangeTypeEnum,
} from 'src/enums/day-parting.enums';
import {
  IDaypartingMetricsData,
  IDaypartingMetricsPayload,
  IDaypartingTimeRange,
  IHeatMap,
  IHistoryChangeData,
  IKeywords,
  ITargets,
  ITimeRangeDropdownFormat,
  ITimeRanges,
  IWalmartAdItemsHistory,
  IWalmartKeywords,
} from 'src/interfaces/day-parting.interfaces';
import { IDayPartingFilterForm } from 'src/redux/slices/day-parting/day-parting.slice';
import { displayValue, generateNItems, parseNum } from '.';
import {
  convertToTitleCase,
  getFormattedMetrics,
  getSelectedAdTypeByMarketplace,
  getSortedCampaignList,
  isDecimal,
} from './advertising.utils';
import { getFormattedCurrTimeZoneDate } from './datetime.utils';
import localStorageUtils from './local-storage/local-storage.utils';

export const getCurrentTabByMarketplace = (marketplace: string) => {
  if (marketplace === MarketplaceEnum.AMAZON)
    return DaypartingTabsEnum.HOURLY_TRENDS;
  if (marketplace === MarketplaceEnum.WALMART)
    return DaypartingTabsEnum.DAYPARTING_SETUP;
  return DaypartingTabsEnum.HOURLY_TRENDS;
};

export const getFormattedKeywordsData = (data: IKeywords | null) => {
  if (!data) return [];
  const keywordIds = data.liveBids.map((liveBid) => liveBid.keywordId);

  let keywordFormattedData: IHistoryChangeData[] = [];
  keywordIds.forEach((keywordId) => {
    const liveBidData = data.liveBids.find(
      (liveBid) => liveBid.keywordId === keywordId
    );
    const originalBid = data.originalBids.find(
      (originalBid) => originalBid.keywordId === keywordId
    )?.bid;
    const updatedBid = data.updatedBids.find(
      (updatedBid) => updatedBid.keywordId === keywordId
    )?.bid;

    keywordFormattedData = [
      ...keywordFormattedData,
      {
        adGroupId: liveBidData?.adGroupId,
        campaignId: liveBidData?.campaignId,
        keywordId,
        liveBid: liveBidData?.bid,
        originalBid: originalBid,
        updatedBid: updatedBid,
        keywordText: liveBidData?.keywordText,
      },
    ];
  });

  return keywordFormattedData;
};

export const getFormattedTargetsData = (data: ITargets | null) => {
  if (!data) return [];
  const targetIds = data.liveBids.map((liveBid) => liveBid.targetId);

  let targetFormattedData: IHistoryChangeData[] = [];
  targetIds.forEach((targetId) => {
    const liveBidData = data.liveBids.find(
      (liveBid) => liveBid.targetId === targetId
    );
    const originalBid = data.originalBids.find(
      (originalBid) => originalBid.targetId === targetId
    )?.bid;
    const updatedBid = data.updatedBids.find(
      (updatedBid) => updatedBid.targetId === targetId
    )?.bid;

    targetFormattedData = [
      ...targetFormattedData,
      {
        adGroupId: liveBidData?.adGroupId,
        campaignId: liveBidData?.campaignId,
        targetId,
        liveBid: liveBidData?.bid,
        originalBid: originalBid,
        updatedBid: updatedBid,
      },
    ];
  });

  return targetFormattedData;
};

export const getFormattedWalmartKeywordsData = (
  data: IWalmartKeywords | null
) => {
  if (!data) return [];
  const keywordIds = data.liveBids.map((liveBid) => liveBid.keywordId);

  let keywordFormattedData: IHistoryChangeData[] = [];
  keywordIds.forEach((keywordId) => {
    const liveBidData = data.liveBids.find(
      (liveBid) => liveBid.keywordId === keywordId
    );
    const originalBid = data.originalBids.find(
      (originalBid) => originalBid.keywordId === keywordId
    )?.bid;
    const updatedBid = data.updatedBids.find(
      (updatedBid) => updatedBid.keywordId === keywordId
    )?.bid;

    const createdAt = data.liveBids.find(
      (item) => item.keywordId === keywordId
    )?.createdAt;

    const keywordText = data.liveBids.find(
      (item) => item.keywordId === keywordId
    )?.keywordText;

    keywordFormattedData = [
      ...keywordFormattedData,
      {
        adGroupId: liveBidData?.adGroupId,
        campaignId: liveBidData?.campaignId,
        keywordId,
        liveBid: liveBidData?.bid,
        originalBid: originalBid,
        updatedBid: updatedBid,
        adGroupName: '',
        campaignName: '',
        createdAt,
        keywordText,
      },
    ];
  });

  return keywordFormattedData;
};

export const getFormattedWalmartAdItemsData = (
  data: IWalmartAdItemsHistory | null
) => {
  if (!data) return [];
  if (data.liveBids.length === 0) return [];

  const adItemIds = data.liveBids.map((liveBid) => liveBid.adItemId);

  let targetFormattedData: IHistoryChangeData[] = [];
  adItemIds.forEach((adItemId) => {
    const liveBidData = data.liveBids.find(
      (liveBid) => liveBid.adItemId === adItemId
    );
    const originalBid = data.originalBids.find(
      (originalBid) => originalBid.adItemId === adItemId
    )?.bid;
    const updatedBid = data.updatedBids.find(
      (updatedBid) => updatedBid.adItemId === adItemId
    )?.bid;

    const itemName = data.liveBids.find(
      (item) => item.adItemId === adItemId
    )?.name;

    targetFormattedData = [
      ...targetFormattedData,
      {
        adGroupId: liveBidData?.adGroupId as string,
        campaignId: liveBidData?.campaignId as string,
        adItemId: adItemId as string,
        liveBid: liveBidData?.bid,
        originalBid: originalBid,
        updatedBid: updatedBid,
        itemName,
      },
    ];
  });

  return targetFormattedData;
};

export const getDaypartingTimeRange = (
  timeRange: ITimeRangeDropdownFormat<string>
) => {
  const startTime = moment(timeRange.startTime?.value, TIME_FORMAT_2);
  const endTime = moment(timeRange.endTime?.value, TIME_FORMAT_2);

  return endTime.diff(startTime);
};

export const checkDaypartingTimeRangeAllPopulated = (
  timeRanges: ITimeRangeDropdownFormat<string>[]
) => {
  return timeRanges.every((timeRange) => getDaypartingTimeRange(timeRange) > 0);
};

export const getNextTimeRange = (
  timeRanges: ITimeRangeDropdownFormat<string>[],
  dayPartingTimeOptionsClone: IDropdownItem<string>[]
): ITimeRangeDropdownFormat<string> => {
  const lastTimeRange = timeRanges[timeRanges.length - 1];

  const currIndex = dayPartingTimeOptionsClone.findIndex(
    (item) => item.value === lastTimeRange.endTime.value
  );

  return {
    startTime: dayPartingTimeOptionsClone[currIndex + 1],
    endTime: dayPartingTimeOptionsClone[currIndex + 1],
    errorText: '',
  };
};

export const checkTimeRangeOverlap = (
  timeRanges: ITimeRangeDropdownFormat<string>[]
): boolean => {
  const sortedTimeRange = timeRanges.sort((a, b) => {
    return a.startTime.value.localeCompare(b.startTime.value);
  });

  for (let i = 0; i < sortedTimeRange.length - 1; i++) {
    const currentEndTime = sortedTimeRange[i].endTime.value;
    const nextStartTime = sortedTimeRange[i + 1].startTime.value;
    if (currentEndTime > nextStartTime) {
      return true;
    }
  }

  return false;
};

export const jobStatusSortComparator = (
  v1: any,
  v2: any,
  param1: any,
  param2: any
) => {
  const enabledStatus = 'true';
  const pausedStatus = 'false';

  const statusOrder: { [status: string]: number } = {
    [enabledStatus]: 1,
    [pausedStatus]: 2,
  };

  const status1 = statusOrder[param1.value];
  const status2 = statusOrder[param2.value];

  return status1 - status2;
};

export const getCampaignsArray = (
  appliedFilters: IDayPartingFilterForm
): string[] => {
  if (appliedFilters.campaigns.length === 0) return [];
  return appliedFilters.campaigns
    .filter((item) => item.selected && item.value.trim())
    .map((camp) => camp.value);
};

export const getPlacementArray = (appliedFilters: IDayPartingFilterForm) => {
  return (appliedFilters.placement || []).reduce((acc: string[], placement) => {
    if (placement.value.toLowerCase() !== 'all') {
      acc.push(placement.value);
    }
    return acc;
  }, []);
};

export const getHeatMapSeries = (
  rawData: IDaypartingMetricsData[],
  metric: string
): IHeatMap[] => {
  return WEEKDAYS.slice(0, 7).map((weekDay) => {
    const formattedData = rawData
      .filter((data) => data.weekDay === weekDay)
      .map((data) => {
        return {
          x: parseNum(data.hour),
          y: data.value,
        };
      });

    return {
      name: weekDay.trim().slice(0, 3),
      data: formattedData,
    };
  });
};

export const getLineGraphData = (
  rawData: IDaypartingMetricsData[],
  metric: string
): IDaypartingMetricsData[] => {
  const aggregatedData = rawData.reduce((acc, curr) => {
    const key = `${curr.weekDay}-${curr.hour}`;
    if (!acc[key]) {
      acc[key] = { weekDay: curr.weekDay, hour: curr.hour, value: 0 };
    }
    acc[key].value = Number(acc[key].value) + Number(curr.value);
    return acc;
  }, {} as { [key: string]: IDaypartingMetricsData });

  return Object.values(aggregatedData);
};

export const getGridData = (
  rawData: IDaypartingMetricsData[],
  metric: string
): number[][] => {
  const gridItems: number[][] = generateNItems(GRID_ROWS, null).map(() =>
    generateNItems(GRID_COLUMNS, null)
  );

  if (rawData.length === 0) return gridItems;

  const data = getHeatMapSeries(rawData, metric);
  data.forEach((dayData, rowIndex) => {
    dayData.data.forEach((dataPoint) => {
      gridItems[rowIndex][dataPoint.x] = dataPoint.y;
    });
  });
  return gridItems;
};

export const getMetricsPayload = (filters: IDayPartingFilterForm) => {
  const payload: Partial<IDaypartingMetricsPayload> = {};

  if (filters.range) {
    payload.range = filters.range.value;
  }
  if ((filters.range.value as unknown as Range) === Range.CUSTOM_RANGE) {
    payload.startDate = filters.customDateRange.startDate;
    payload.endDate = filters.customDateRange.endDate;
  }
  if (filters.metric) {
    payload.metric = filters.metric.value;
  }
  if (filters.campaigns) {
    payload.campaignIds = getCampaignsArray(filters);
  }

  return payload;
};

export const getStatus = (status: DaypartingJobStatusEnum) => {
  switch (status) {
    case DaypartingJobStatusEnum.ENABLED:
      return true;
    case DaypartingJobStatusEnum.PAUSED:
      return false;
    default:
      return false;
  }
};

export const getSelectedDaypartingRecurrenceDayOptions = (
  days: DaypartingRecurrenceDaysEnum[]
): IDropdownItem<DaypartingRecurrenceDaysEnum>[] => {
  return dayPartingRecurrenceDaysOptions.map((option) => {
    return {
      ...option,
      selected: days.includes(option.value),
    };
  });
};

export const getSelectedDaypartingTimeRangesOptions = (
  timeRanges: Array<IDaypartingTimeRange>
) => {
  const options: Array<ITimeRanges> = [];

  if (!timeRanges || timeRanges.length === 0) return defaultTimeRange;
  timeRanges.forEach((timeRange) => {
    const startTime = dayPartingTimeOptions.find((option) => {
      return String(option.value) === timeRange.startTime;
    });
    const endTime = dayPartingTimeOptions.find(
      (option) => String(option.value) === timeRange.endTime
    );

    if (startTime && endTime) {
      options.push({
        startTime,
        endTime,
        errorText: '',
      });
    }
  });

  if (options.length > 0) return options;
  return defaultTimeRange;
};

export const getSelectedDaypartingAdjustmentOptions = (
  type: DaypartingBidChangeTypeEnum
) => {
  const selectedOption = dayPartingBidAdjustmentOptions.find((option) => {
    return option.value === type;
  });

  return selectedOption ?? dayPartingBidAdjustmentOptions[0];
};

export const disableDayPartingTimeOptionsClone = (
  dayPartingTimeOptionsClone: IDropdownItem<string>[],
  timeRanges: Array<ITimeRanges>
) => {
  return dayPartingTimeOptionsClone.map((option) => {
    let isDisabled = option.isDisabled;

    timeRanges.forEach((range) => {
      if (
        range.startTime.value === option.value ||
        range.endTime.value === option.value
      ) {
        isDisabled = true;
      }
    });

    return {
      ...option,
      isDisabled,
    };
  });
};

export const navigateToDaypartingFormPage = (jobId: string) => {
  const url = `/day-parting/hourly-trends/job/${jobId}`;
  window.open(url, '_blank');
};

export const getDaypartingMetricsGraphData = (
  data: IDaypartingMetricsData[],
  weekDay: string,
  hours: number[]
): number[] => {
  if (data.length === 0) return [];
  const formattedData: number[] = [];

  hours.forEach((hour) => {
    const row = data.find(
      (row) => row.weekDay === weekDay && row.hour === hour
    );
    formattedData.push(row && row.value !== undefined ? Number(row.value) : 0);
  });

  return formattedData;
};

export const getXLabels = () => {
  const timeArray = Array.from({ length: 24 }, (_, i) =>
    moment({ hour: i }).format('hh A').toLowerCase()
  );
  timeArray.push('Daily Total');
  return timeArray;
};

export const getMedians = (data: number[][], number = 4) => {
  const medians: number[] = [];

  const sortedData = data.flat().sort((a, b) => a - b);

  for (let i = 1; i <= number; i++) {
    const index = Math.floor((sortedData.length - 1) * (i / number));
    medians.push(sortedData[index]);
  }

  return medians;
};

export const getColorForValue = (value: number, buckets: number[]) => {
  const COLORS = ['#F1D0FF', '#E2BCFE', '#9D60C9', '#6B3494'];
  for (let i = 0; i < buckets.length; i++) {
    if (value === null) {
      return {
        bgColor: '#F6ECFE',
        color: '#000',
      };
    }
    if (value <= buckets[i]) {
      return {
        bgColor: COLORS[i],
        color:
          COLORS[i] === COLORS[0] || COLORS[i] === COLORS[1] ? '#000' : '#FFF',
      };
    }
  }
};

export const formatValue = (value: number, metric: string) => {
  const formattedMetricValue = formatMetricValue(value, metric);

  let prefix = '';
  let suffix = '';
  let numericValue: string | number = '';

  const match = formattedMetricValue.match(/([^\d.]*)([\d.]+)(.*)/);

  if (match) {
    prefix = match[1];
    numericValue = match[2];
    suffix = match[3];
  }

  if (isDecimal(Number(numericValue))) {
    numericValue = Number(numericValue).toFixed(1);
  } else {
    numericValue = Number(numericValue);
  }

  if (metric === MetricsKeysEnum.TACOS) {
    if (suffix.length > 1) {
      suffix = suffix.slice(1) + suffix.slice(0, 1);
    }
  }

  return `${prefix}${numericValue}${suffix}`;
};

export const formatMetricValue = (value: number, metric: string): string => {
  if (value >= 1_000_000) {
    return `${getFormattedMetrics(metric, value / 1_000_000)}M`;
  } else if (value >= 1_000) {
    return `${getFormattedMetrics(metric, value / 1_000)}K`;
  } else {
    return getFormattedMetrics(metric, value).toString();
  }
};

export const getTabDataByMarketplace = (marketplace: MarketplaceEnum) => {
  if (marketplace === MarketplaceEnum.AMAZON) return dayPartingTabData;
  if (marketplace === MarketplaceEnum.WALMART) return dayPartingWalmartTabData;
  return dayPartingTabData;
};

export const getDayPartingUrl = (
  tabValue: string,
  marketplace: string,
  adType: string
) => {
  return `${DAY_PARTING_PAGE_URL}/${tabValue}/${marketplace?.toLowerCase()}/${AD_TYPE_MAPPING[
    adType
  ].toLowerCase()}`;
};

export const getJobListUrl = (marketplace: string, adType: string) => {
  return `${DAY_PARTING_PAGE_URL}/hourly-trends/${marketplace?.toLowerCase()}`;
};

export const getJobHistoryUrl = (marketplace: string, adType: string) => {
  return `${DAY_PARTING_HISTORY_URL}/${marketplace?.toLowerCase()}`;
};

export const getScheduledJobsUrl = (marketplace: string, adType: string) => {
  return `${DAY_PARTING_SCHEDULED_JOBS_URL}/${marketplace?.toLowerCase()}`;
};

export const isCampaignStatusEnabled = (
  status: string,
  marketplace: MarketplaceEnum
) => {
  if (marketplace === MarketplaceEnum.AMAZON)
    return status === CampaignStateEnum.ENABLED;
  if (marketplace === MarketplaceEnum.WALMART)
    return status === WalmartCampaignStatusEnum.LIVE;
  return false;
};

export const isInvalidDateRange = (startDate: string, endDate: string) => {
  if (!startDate || !endDate) return true;

  const start = moment(getFormattedCurrTimeZoneDate(startDate));
  const end = moment(getFormattedCurrTimeZoneDate(endDate));

  return start.isAfter(end) || start.isBefore(getTodayByTimeZone());
};

export const getIsInvalidEndDate = (endDate: string) => {
  if (!endDate) return true;

  const end = moment(
    getFormattedCurrTimeZoneDate(endDate, DATE_FORMAT_3)
  ).startOf('day');
  const now = moment(getTodayByTimeZone()).startOf('day');

  return end.isBefore(now);
};

export const getBidAdjustmentValueToDisplay = (
  type: DaypartingBidChangeTypeEnum,
  value: number
) => {
  let finalStr = 'Increased by';
  if (type === DaypartingBidChangeTypeEnum.INCREASE) finalStr = 'Increased by';
  if (type === DaypartingBidChangeTypeEnum.DECREASE) finalStr = 'Decreased by';

  return `${finalStr} ${displayValue(value)}`;
};

export const getRecurrenceDataToDisplay = (
  type: DaypartingRecurrenceTypeEnum,
  days: DaypartingRecurrenceDaysEnum[] | undefined
) => {
  if (type === DaypartingRecurrenceTypeEnum.DAILY)
    return convertToTitleCase(type);

  const formattedDays = getDayPartingRecurrenceDays(days);
  return (
    `${convertToTitleCase(type)}` +
    (formattedDays !== '' ? ` (${formattedDays})` : '')
  );
};

export const getHourOfDayToDisplay = (
  timeRanges: IDaypartingTimeRange[],
  type: DaypartingTimeRangeTypeEnum
) => {
  if (type === DaypartingTimeRangeTypeEnum.ALL_DAY) return 'All Day';
  if (timeRanges.length === 0) return '';
  const timeRangeArr = timeRanges.map((item) => {
    return `${item.startTime}-${item.endTime}`;
  });

  return timeRangeArr.join(', ');
};

export const getDayPartingRecurrenceDays = (
  days: DaypartingRecurrenceDaysEnum[] | undefined
) => {
  if (!days) return '';
  const formattedArray: string[] = [];
  days.forEach((item) =>
    formattedArray.push(DAY_PARTING_WEEKLY_DAYS_MAPPING[item])
  );

  return formattedArray.join(',');
};

export const getWalmartCampaignsArray = (
  appliedFilters: IDayPartingFilterForm
) => {
  if (appliedFilters.campaigns.length === 0) return [];
  const filteredCamp = appliedFilters.campaigns
    .filter((item) => item.selected && item.value.trim())
    .map((val) => val.value.trim());

  return getSortedCampaignList(filteredCamp);
};

export function rangeContainsSelectedWeekdays(
  daysOptions: IDropdownItem<string>[],
  startDate: string,
  endDate: string
): boolean {
  const _startDate = new Date(startDate);
  const _endDate = new Date(endDate);
  const wantedWeekdays = new Set<number>();
  daysOptions.forEach((opt, index) => {
    if (opt.selected) {
      wantedWeekdays.add(index);
    }
  });

  if (wantedWeekdays.size === 0) {
    return false;
  }
  while (
    moment(_startDate).isSameOrBefore(moment(_endDate).add(1, 'day')) &&
    wantedWeekdays.size > 0
  ) {
    const weekday = _startDate.getDay();

    if (wantedWeekdays.has(weekday)) {
      wantedWeekdays.delete(weekday);
    }
    _startDate.setDate(_startDate.getDate() + 1);
  }

  return wantedWeekdays.size === 0;
}

export const getSelectedTabByURL = (url: string) => {
  const url_arr = url.split('/').slice(2).join('/');

  if (url_arr.startsWith(DaypartingTabsEnum.DAYPARTING_CAMPAIGNS.toLowerCase()))
    return DaypartingTabsEnum.DAYPARTING_CAMPAIGNS;
  else return DaypartingTabsEnum.DAYPARTING_SETUP;
};

export const calculateColumnSums = (data: number[][]): number[] => {
  if (!data || data.length === 0) return [];

  const numColumns = data[0].length;
  const columnSums = new Array(numColumns).fill(0);

  data.forEach((row) => {
    row.forEach((cell, colIndex) => {
      if (typeof cell === 'number' && !isNaN(cell)) {
        columnSums[colIndex] += cell;
      }
    });
  });

  return columnSums;
};

export const calculateRowSum = (row: number[]) => {
  return row.reduce((sum, cell) => {
    if (typeof cell === 'number' && !isNaN(cell)) {
      return sum + cell;
    }
    return sum;
  }, 0);
};

export const getColorByDayPartingJobStatus = (
  status: DaypartingJobStatusEnum
) => {
  if (status === DaypartingJobStatusEnum.FAILED) return 'rgb(242, 110, 119)';
  else if (status === DaypartingJobStatusEnum.COMPLETED) return '#097969';
  else if (status === DaypartingJobStatusEnum.PENDING) return '#77469B';
  else if (status === DaypartingJobStatusEnum.ARCHIVED) return '#9E9E9E';
  else if (status === DaypartingJobStatusEnum.IN_PROGRESS) return '#F28C28';
  else return '#77469b';
};

export const getDayPartingJobStatusStyles = (color: string) => {
  return {
    ...textTitleStyles,
    color,
    fontWeight: 600,
    border: `1px solid ${color}`,
    padding: '0.5rem',
    display: 'flex',
    justifyContent: 'center',
  };
};

export const getIsAIBidderEnabled = () => {
  const account = localStorageUtils.getSelectedAdvertisingAccount();

  if (
    account === null ||
    account.advertising === null ||
    account.advertising?.bidderType === null ||
    account.advertising?.bidderStatus === null
  )
    return false;

  return (
    account.advertising?.bidderType === BidderTypeEnum.AI_BIDDER &&
    account.advertising.bidderStatus === BidderStatusEnum.ACTIVE
  );
};

export const getAdTypeUrl = (marketplace: string, adType: string) => {
  return `${marketplace}/${adType ?? AdTypeShort.All.toLowerCase()}`;
};

export const getFormattedAdType = (adType?: string) => {
  if (adType === undefined) return AdTypeShort.OVERALL;

  const formattedAdType =
    adType === AdTypeShort.All
      ? AdTypeShort.OVERALL
      : AD_TYPE_MAPPING[adType] ?? adType;

  return formattedAdType.toLowerCase();
};

export const getAdTypeFromUrl = (
  url: string,
  fallBackAdType: string,
  marketplace: string
): IDropdownItem<string> => {
  const match = url.match(DAY_PARTING_CAMPAIGNS_REGEX_FORMAT);

  if (match) {
    return getSelectedAdTypeByMarketplace(match[2], marketplace);
  } else {
    return getSelectedAdTypeByMarketplace(fallBackAdType, marketplace);
  }
};

export const getDayPartingRedirectUrlByTab = (
  tab: DaypartingTabsEnum,
  marketplace: MarketplaceEnum,
  adType: string
) => {
  switch (tab) {
    case DaypartingTabsEnum.DAYPARTING_CAMPAIGNS:
      return `${DAY_PARTING_PAGE_URL}/${
        DaypartingTabsEnum.DAYPARTING_CAMPAIGNS
      }/${marketplace}/${AD_TYPE_MAPPING[adType.toUpperCase()].toLowerCase()}`;
    case DaypartingTabsEnum.DAYPARTING_SETUP:
    case DaypartingTabsEnum.EDIT_PAGE:
    default:
      return `${DAY_PARTING_PAGE_URL}/home/${marketplace}/${AD_TYPE_MAPPING[
        adType.toUpperCase()
      ].toLowerCase()}`;
  }
};
