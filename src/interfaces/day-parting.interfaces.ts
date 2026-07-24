import { IDropdownItem } from 'src/app/components/common/dropdown/dropdown';
import {
  DaypartingBidChangeTypeEnum,
  DaypartingHistoryEnum,
  DaypartingJobStatusEnum,
  DaypartingJobTypeEnum,
  DaypartingRecurrenceDaysEnum,
  DaypartingRecurrenceTypeEnum,
  DaypartingTimeRangeTypeEnum,
  DaypartingTimeTypeEnum,
  DaypartingTriggerStatusEnum,
} from 'src/enums/day-parting.enums';
import { ISortCriteria } from './advertising/advertising.interface';

export interface IJobCampaign {
  campaignId: string;
  changeInPercentage: number;
}

export interface IScheduleJobId {
  _id: string;
  runAt: Date;
  accountId: string;
  isRecurring: boolean;
  campaigns: IJobCampaign[];
}

export interface IKeywordBid {
  adGroupId: string;
  bid: number;
  campaignId: string;
  keywordId: string;
  keywordText: string;
  matchType: string;
  state: string;
}

export interface IBidExpression {
  type: string;
}

export interface ITargetBid {
  adGroupId: string;
  bid: number;
  campaignId: string;
  expression: IBidExpression[];
  expressionType: string;
  resolvedExpression: IBidExpression[];
  state: string;
  targetId: string;
}

export interface IScheduledJob {
  _id: string;
  jobId: IScheduleJobId;
  runAt: Date | string;
  accountId: string;
  status: string;
}

export interface IJobHistory {
  _id: string;
  jobId: string;
  ranAt: Date;
  accountId: string;
  scheduledRunTime: Date;
  isRecurring: boolean;
  campaigns: IJobCampaign[];
  status: string;
  historyS3Path: string;
  title: string;
}

export interface IJobs {
  _id: string;
  runAt: Date;
  accountId: string;
  isRecurring: boolean;
  campaigns: IJobCampaign[];
}

export interface IKeywords {
  liveBids: IKeywordBid[];
  originalBids: IKeywordBid[];
  updatedBids: IKeywordBid[];
}

export interface IWalmartKeywordBid {
  advertiserId: string;
  campaignId: string;
  adGroupId: string;
  keywordId: string;
  keywordText: string;
  keywordCategory: string;
  state: string;
  bid: number;
  matchType: string;
  status: string;
  createdAt: string;
}

export interface IWalmartAdItemData {
  campaignId: string | number;
  adGroupId: string | number;
  itemId: string | number;
  adItemId: string | number;
  bid: number;
  status: string;
  itemImageUrl: string;
  itemPageUrl: string;
  name: string;
  reviewStatus: string;
  reviewReason: string;
}

export interface IWalmartKeywords {
  liveBids: IWalmartKeywordBid[];
  originalBids: IWalmartKeywordBid[];
  updatedBids: IWalmartKeywordBid[];
}

export interface IWalmartAdItemsHistory {
  liveBids: IWalmartAdItemData[];
  originalBids: IWalmartAdItemData[];
  updatedBids: IWalmartAdItemData[];
}

export interface ITargets {
  liveBids: ITargetBid[];
  originalBids: ITargetBid[];
  updatedBids: ITargetBid[];
}

export interface IJobHistoryChanges {
  keywords: IKeywords;
  targets: ITargets;
}

export interface IWalmartJobHistoryChanges {
  keywords: IWalmartKeywords;
  adItems: IWalmartAdItemsHistory;
}

interface IHistoryActionsProps {
  id: string;
}

export interface IHistoryChangeData {
  adGroupId: string | undefined;
  campaignId: string | undefined;
  keywordId?: string;
  keywordText?: string;
  campaignName?: string | undefined;
  adGroupName?: string | undefined;
  targetId?: string | undefined;
  adItemId?: string | undefined;
  itemName?: string;
  liveBid: number | undefined;
  originalBid: number | undefined;
  updatedBid: number | undefined;
  createdAt?: string | undefined;
}

export interface ITimeRangeDropdownFormat<T> {
  startTime: IDropdownItem<T>;
  endTime: IDropdownItem<T>;
  errorText: string;
}

export interface IDaypartingTimeRange {
  startTime: DaypartingTimeTypeEnum;
  endTime: DaypartingTimeTypeEnum;
}

export interface ITimeRanges {
  startTime: IDropdownItem<string>;
  endTime: IDropdownItem<string>;
  errorText: string;
}

export interface IDaypartingTriggerTimeRange {
  bidChangeStartTimeUTC: string;
  bidChangeStartTimeOriginal: string;
  nextBidChangeScheduled: string;
  nextBidChangeScheduledStatus: DaypartingJobStatusEnum;
  bidChangeRevertTimeUTC: string;
  bidChangeRevertTimeOriginal: string;
  nextRevertScheduled: string;
  nextRevertScheduledStatus: DaypartingJobStatusEnum;
}
export interface IDaypartingBidChange {
  type: DaypartingBidChangeTypeEnum;
  percentage: number;
}

export interface IRecurrence {
  type: DaypartingRecurrenceTypeEnum;
  days?: DaypartingRecurrenceDaysEnum[];
}

export interface ISchedulesConfigPayload {
  type: DaypartingTimeRangeTypeEnum;
  timeRanges: Array<IDaypartingTimeRange>;
}
export interface ICreateJobBody {
  title: string;
  campaigns: string[];
  bidChange: IDaypartingBidChange;
  recurrence: IRecurrence;
  startDate: string;
  endDate: string;
  timeZone: string;
  schedules: ISchedulesConfigPayload;
  adType?: string;
}

export interface IWalmartDaypartingJob extends IDaypartingJob {
  advertiserId: string;
}
export type TDaypartingJob = Pick<
  ICreateJobBody,
  | 'title'
  | 'startDate'
  | 'endDate'
  | 'campaigns'
  | 'timeZone'
  | 'recurrence'
  | 'bidChange'
  | 'adType'
>;

export interface ISchedulesConfig {
  type: DaypartingTimeRangeTypeEnum;
  timeRanges: Array<IDaypartingTimeRange>;
}

export interface IDayPartingCampaignsList {
  campaignId: string;
  campaignName: string;
}
export interface IDaypartingJob extends TDaypartingJob {
  _id: string;
  profileId: string;
  startDateInUTC: string;
  endDateInUTC: string;
  jobStatus: DaypartingJobStatusEnum;
  createdAt: string;
  schedules: ISchedulesConfig;
  nextTrigger: Array<IDaypartingTriggerTimeRange>;
}

export interface ICampaignData {
  campaignId: string;
  campaignName: string;
}

export interface IDaypartingMetricsData {
  weekDay: string | number;
  hour: number;
  value: number;
}

export interface IDaypartingMetricsResponse {
  metricsData: IDaypartingMetricsData[];
  dailyMetricsData: IDaypartingMetricsData[];
  hourlyMetricsData: IDaypartingMetricsData[];
}

export interface IHeatMap {
  data: IHeatMapData[];
  name: string;
}
export interface IHeatMapData {
  x: number;
  y: number;
}

export interface IDaypartingMetricsPayload {
  range: string;
  metric: string;
  campaignIds: string[];
  startDate?: string;
  endDate?: string;
}

export interface IDaypartingCampaignList extends IDayPartingCampaigns {
  campaignName: string;
  status: string;
  associatedJobs: IWalmartDaypartingJob[] | IDaypartingJob[];
}

export interface IDayPartingCampaigns {
  campaignId: string;
  isPartOfDayparting: boolean;
}

export interface IDayPartingHistoryPayload {
  searchText: string;
  searchColumns: string[];
  sortCriteria: ISortCriteria[];
  page: number;
  pageSize: number;
  adType?: string;
}

export interface IDayPartingUpsertPayload {
  payload: ICreateJobBody | undefined;
  campaignsToRemove?: string[];
}

export interface ICampIdName {
  campaignName: string;
  campaignId: string;
}

export interface IExistingCampaigns {
  jobId: string;
  title: string;
  campaigns: ICampIdName[];
}
export interface IDaypartingHistory {
  _id: string;
  accountId: string;
  advertiserId: string;
  profileId: string;
  jobId: string;
  triggerId: string;
  campaigns: IDayPartingCampaigns[];
  historyS3Path: string;
  status: DaypartingHistoryEnum;
  daypartingJobType: DaypartingJobTypeEnum;
  triggeredAt: Date;
}

export interface IDayPartingHistoryResponse {
  data: IDaypartingHistory[];
  totalCount: number;
}

export interface IDayPartingHistoryPayload {
  searchText: string;
  searchColumns: string[];
  sortCriteria: ISortCriteria[];
}

export interface IDaypartingTrigger {
  title: string;
  jobId: string;
  nextChangeScheduled: string;
  nextRevertScheduled: string;
  currentChangeTriggerStatus: DaypartingTriggerStatusEnum;
  currentRevertTriggerStatus: DaypartingTriggerStatusEnum;
  campaigns: string[];
}

export interface IDayPartingTriggerResponse {
  data: IDaypartingTrigger[];
  totalCount: number;
}
