import {
  MONITORING_HISTORY_LOGS_REDIRECT_URL,
  MONITORING_LOGS_REDIRECT_URL,
} from '@/constants/monitoring.constants';
import {
  MonitoringMetaDataTypeEnum,
  MonitoringStatusEnum,
} from '@/enums/monitoring.enum';
import { Range } from '@/enums/serp.enums';
import { ISortCriteria } from '@/interfaces/advertising/advertising.interface';
import { IMonitoringDataPayload } from '@/interfaces/monitoring.interface';
import { IFinalFilters } from '@/redux/slices/filters/filter.slice';
import { IMonitoringHeaderFilterForm } from '@/redux/slices/monitoring/monitoring.slice';
import { encodeURIString } from '.';
import { convertDateToEpochs } from './datetime.utils';

export const monitoringUtils = {
  getMonitoringPayload: (
    filters: IFinalFilters[],
    sortCriteria: ISortCriteria[],
    pageSize: number,
    page: number,
    searchText: string,
    headerFilters: IMonitoringHeaderFilterForm,
    searchColumns: string[],
    isDownload = false,
    isAllDownload = false
  ): IMonitoringDataPayload => {
    return {
      filters,
      sortCriteria,
      pageSize,
      page,
      searchText,
      startDate: headerFilters.customDateRange.startDate,
      endDate: headerFilters.customDateRange.endDate,
      range: headerFilters.range.value as Range,
      searchColumns,
      isDownload,
      downloadWithFilter: !isAllDownload,
    };
  },
  getMetaDataColor: (type: MonitoringMetaDataTypeEnum) => {
    switch (type) {
      case MonitoringMetaDataTypeEnum.ERROR:
        return 'rgb(242, 110, 119)';
      case MonitoringMetaDataTypeEnum.INFO:
        return '#F28C28';
      case MonitoringMetaDataTypeEnum.SUCCESS:
        return '#77469B';
    }
  },
  getStatusTextColor: (status: MonitoringStatusEnum) => {
    switch (status) {
      case MonitoringStatusEnum.FAILED:
        return 'rgb(242, 110, 119)';
      case MonitoringStatusEnum.COMPLETED:
        return '#097969';
      case MonitoringStatusEnum.PENDING:
        return '#77469B';
      case MonitoringStatusEnum.STALE:
        return '#9E9E9E';
      case MonitoringStatusEnum.RUNNING:
        return '#F28C28';
      default:
        return '#9E9E9E';
    }
  },
  getURLToMonitoringLogs: (taskId: string, startTime: string) => {
    const uri = MONITORING_LOGS_REDIRECT_URL.replace(
      '{startTime}',
      encodeURIString(convertDateToEpochs(startTime, 5))
    ).replace('{taskId}', encodeURIString(taskId));
    return uri;
  },
  getURLToMonitoringHistoryLogs: (
    taskId: string,
    startTime: string,
    endTime: string
  ): string => {
    return MONITORING_HISTORY_LOGS_REDIRECT_URL.replace(
      '{taskId}',
      encodeURIString(taskId)
    )
      .replace(
        '{startTime}',
        encodeURIString(convertDateToEpochs(startTime, 5))
      )
      .replace('{endTime}', encodeURIString(convertDateToEpochs(endTime)));
  },
};
