import { SqsQueueNameEnum } from '@/enums/monitoring.enum';
import { Range } from '@/enums/serp.enums';
import { IFinalFilters } from '@/redux/slices/filters/filter.slice';
import { ISortCriteria } from './advertising/advertising.interface';
import {
  IBsonId,
  IExecutionMode,
  IMonitoringAccountId,
  IMonitoringCorrelationId,
  IMonitoringDeduplicationId,
  IMonitoringElapsedTime,
  IMonitoringMarketplace,
  IMonitoringMessageGroupId,
  IMonitoringMetaDataPayload,
  IMonitoringMetaId,
  IMonitoringMetaType,
  IMonitoringPayload,
  IMonitoringRetryCount,
  IMonitoringScheduleType,
  IMonitoringService,
  IMonitoringStatus,
  IMonitoringTaskCompleted,
  IMonitoringTaskCreatedAt,
  IMonitoringTaskId,
  IMonitoringTaskStartedAt,
  IMonitoringTaskType,
  IMonitoringTimeToComplete,
  IMonitoringTimeToStart,
  IMonitoringTotalLifeTime,
  IMonitoringTriggered,
} from './column.interface';
import { IDownloadPayload } from './keyword-actions.interface';

export interface IMonitoring
  extends IBsonId,
    IMonitoringTaskId,
    IMonitoringAccountId,
    IMonitoringTaskType,
    IMonitoringMetaType,
    IMonitoringMetaId,
    IMonitoringTriggered,
    IMonitoringStatus,
    IMonitoringTaskCompleted,
    IMonitoringTaskStartedAt,
    IMonitoringMarketplace,
    IMonitoringScheduleType,
    IMonitoringTimeToStart,
    IMonitoringTimeToComplete,
    IMonitoringTotalLifeTime,
    IMonitoringTaskCreatedAt,
    IMonitoringCorrelationId,
    IMonitoringPayload,
    IMonitoringMetaDataPayload,
    IMonitoringService,
    IMonitoringRetryCount,
    IExecutionMode,
    IMonitoringElapsedTime,
    IMonitoringMessageGroupId,
    IMonitoringDeduplicationId {}

export interface ITaskType {
  taskType: string;
}

export type IMonitoringDropdownFilters = Record<string, string[]>;

export interface IMonitoringDataPayload extends IDownloadPayload {
  filters: IFinalFilters[];
  sortCriteria: ISortCriteria[];
  pageSize: number;
  page: number;
  searchText: string;
  startDate: string;
  endDate?: string;
  range: Range;
  searchColumns: string[];
}

export interface ISQSQueue {
  queueName: SqsQueueNameEnum;
  queueUrl: string;
  availableMessages: number;
  inFlightMessages: number;
  deduplicatedMessages: number;
  sqsQueueConsoleUrl: string;
}
