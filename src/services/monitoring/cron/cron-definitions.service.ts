import { CRON_BASE_URL } from '@/constants';
import { ACTIVE_ENV } from '@/constants/env/env.orchestrator';
import {
  ICronDefinition,
  ICronDefinitionsInsert,
  IGenerateJobsResult,
} from 'src/interfaces/cron/cron-definitions.interface';
import { IAPIResponse } from 'src/interfaces/service.interface';
import { axiosInstance } from 'src/redux/store';

export const cronDefinitionsService = {
  find: () => {
    return axiosInstance.get<IAPIResponse<ICronDefinition[]>>(
      `${CRON_BASE_URL}/definitions`
    );
  },

  findByTaskType: (taskType: string) =>
    axiosInstance.get<IAPIResponse<ICronDefinition>>(
      `${CRON_BASE_URL}/definitions/${taskType}`
    ),

  create: (data: ICronDefinitionsInsert) =>
    axiosInstance.post<IAPIResponse<ICronDefinition>>(
      `${CRON_BASE_URL}/definitions`,
      data
    ),

  update: (taskType: string, data: Partial<ICronDefinitionsInsert>) =>
    axiosInstance.patch<IAPIResponse<ICronDefinition>>(
      `${CRON_BASE_URL}/definitions/${taskType}`,
      data
    ),

  remove: (taskType: string) =>
    axiosInstance.delete<IAPIResponse<{ message: string }>>(
      `${CRON_BASE_URL}/definitions/${taskType}`
    ),

  generateJobs: (taskType?: string, daysAhead?: number) => {
    const params = daysAhead ? `?daysAhead=${daysAhead}` : '';
    const endpoint = taskType
      ? `${CRON_BASE_URL}/jobs/generate/${taskType}${params}`
      : `${CRON_BASE_URL}/jobs/generate${params}`;
    return axiosInstance.post<IAPIResponse<IGenerateJobsResult>>(endpoint);
  },

  migrateFromConfig: (env = ACTIVE_ENV) =>
    axiosInstance.post<IAPIResponse<{ count: number; env: string }>>(
      `${CRON_BASE_URL}/definitions/migrate`,
      { env }
    ),
};
