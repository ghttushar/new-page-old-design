import { MessageExecutionModeEnum } from '@/enums/pub-sub.enums';
import { MarketplaceEnum } from '@/enums/serp.enums';
import { MONITORING_API_BASE_URL } from 'src/constants';
import { IPaginatedResponse } from 'src/interfaces/advertising/advertising.interface';
import {
  IMonitoring,
  IMonitoringDataPayload,
  IMonitoringDropdownFilters,
  ISQSQueue,
} from 'src/interfaces/monitoring.interface';
import { IAPIResponse } from 'src/interfaces/service.interface';
import { axiosInstance } from 'src/redux/store';

export const monitoringService = {
  getMonitoring: (body: IMonitoringDataPayload) => {
    return axiosInstance.post<IAPIResponse<IPaginatedResponse<IMonitoring[]>>>(
      `${MONITORING_API_BASE_URL}/data?pageSize=${body.pageSize}&page=${body.page}`,
      body
    );
  },

  getMonitoringHistory: (body: IMonitoringDataPayload) => {
    return axiosInstance.post<IAPIResponse<IPaginatedResponse<IMonitoring[]>>>(
      `${MONITORING_API_BASE_URL}/history?pageSize=${body.pageSize}&page=${body.page}`,
      body
    );
  },

  getAllDropdownFilters: () => {
    return axiosInstance.get<IAPIResponse<IMonitoringDropdownFilters>>(
      `${MONITORING_API_BASE_URL}/dropdown-filters`
    );
  },

  isMasterSyncAllowed: (metaId: string, marketplace: MarketplaceEnum) => {
    return axiosInstance.post<IAPIResponse<[boolean, string]>>(
      `${MONITORING_API_BASE_URL}/master-sync/status/${metaId}?marketplace=${marketplace}`
    );
  },

  getSyncProgress: (metaId: string, marketplace: MarketplaceEnum) => {
    return axiosInstance.post<IAPIResponse<number>>(
      `${MONITORING_API_BASE_URL}/master-sync/progress/${metaId}?marketplace=${marketplace}`
    );
  },

  masterSyncTrigger: (metaId: string, marketplace: MarketplaceEnum) => {
    return axiosInstance.post<IAPIResponse<string>>(
      `${MONITORING_API_BASE_URL}/master-sync/${metaId}?marketplace=${marketplace}`
    );
  },

  retriggerTask: (taskId: string, executionMode: MessageExecutionModeEnum) => {
    return axiosInstance.post<IAPIResponse<string>>(
      `${MONITORING_API_BASE_URL}/re-trigger/${taskId}`,
      { executionMode }
    );
  },

  getSQSQueues: () => {
    return axiosInstance.post<IAPIResponse<ISQSQueue[]>>(
      `${MONITORING_API_BASE_URL}/queues/info`,
      {
        sqsQueueNames: [],
      }
    );
  },
  purgeSQSQueue: (sqsQueueName: string) => {
    return axiosInstance.post<IAPIResponse<string>>(
      `${MONITORING_API_BASE_URL}/purge-queue`,
      { sqsQueueName }
    );
  },
};
