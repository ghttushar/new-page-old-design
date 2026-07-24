import { AMAZON_AMC_URL } from 'src/constants';
import { IPaginatedResponse } from 'src/interfaces/advertising/advertising.interface';
import {
  IAMCCreatedAudienceData,
  IAMCCustomQueryCreateBody,
  IAMCCustomQueryCreateResponse,
  IAMCCustomQueryData,
  IAMCQueryData,
  IAMCScheduleData,
  IAMCWorkflowExecution,
  IAMCWorkflowExecutionData,
  IAMCWorkflowExecutionResponse,
  IAMCWorkflowExecutionScheduleResponse,
  IAMCWorkflowQueryExecutionBody,
  IAMCWorkflowQueryExecutionScheduleBody,
  IAccountQueryMapping,
  IAllCampaignData,
} from 'src/interfaces/amc.interfaces';
import { IAPIResponse } from 'src/interfaces/service.interface';
import { axiosInstance } from 'src/redux/store';

export const AMCQueryServices = {
  getAMCQueries: (accessType: string, queryType: string) => {
    return axiosInstance.get<IAPIResponse<IAMCQueryData[]>>(
      `${AMAZON_AMC_URL}/query?accessType=${accessType}&queryType=${queryType}`
    );
  },
  getWorkflowsForAccount: (instanceId: string) => {
    return axiosInstance.get<IAPIResponse<IAccountQueryMapping[]>>(
      `${AMAZON_AMC_URL}/workflow/${instanceId}`
    );
  },
  getAllExecutedAudience: (
    instanceId: string,
    page: number,
    pageSize: number,
    searchQuery?: string
  ) => {
    return axiosInstance.get<
      IAPIResponse<IPaginatedResponse<IAMCCreatedAudienceData[]>>
    >(
      `${AMAZON_AMC_URL}/audience/${instanceId}/executions?page=${page}&pageSize=${pageSize}&query=${searchQuery}`,
      {
        timeout: 10 * 60 * 1000,
      }
    );
  },
  getAllWorkflowExecutions: (
    instanceId: string,
    page: number,
    pageSize: number,
    searchQuery?: string
  ) => {
    return axiosInstance.get<IAPIResponse<IAMCWorkflowExecutionData>>(
      `${AMAZON_AMC_URL}/workflow-execution/${instanceId}/workflows?page=${page}&pageSize=${pageSize}&query=${searchQuery}`
    );
  },
  getWorkflowExecutionByExecutionId: (
    instanceId: string,
    executionId: string
  ) => {
    return axiosInstance.get<IAPIResponse<IAMCWorkflowExecution>>(
      `${AMAZON_AMC_URL}/workflow-execution/${instanceId}/workflows/${executionId}`
    );
  },
  createWorkflowQueryExecution: (body: IAMCWorkflowQueryExecutionBody) => {
    return axiosInstance.post<IAPIResponse<IAMCWorkflowExecutionResponse>>(
      `${AMAZON_AMC_URL}/workflow-execution/create`,
      body
    );
  },
  getWorkflowByWorkflowId: (instanceId: string, workflowId: string) => {
    return axiosInstance.get<IAPIResponse<IAccountQueryMapping>>(
      `${AMAZON_AMC_URL}/workflow/${instanceId}/${workflowId}`
    );
  },
  getSponsoredAdsDSPCampaigns: () => {
    return axiosInstance.get<IAPIResponse<IAllCampaignData>>(
      `${AMAZON_AMC_URL}/sa-dsp-campaigns`
    );
  },
  createWorkflowQueryExecutionSchedule: (
    body: IAMCWorkflowQueryExecutionScheduleBody
  ) => {
    return axiosInstance.post<
      IAPIResponse<void | null | IAMCWorkflowQueryExecutionScheduleBody>
    >(`${AMAZON_AMC_URL}/schedule`, body);
  },
  getWorkflowExecutionSchedules: (
    instanceId: string,
    page: number,
    pageSize: number
  ) => {
    return axiosInstance.get<
      IAPIResponse<IAMCWorkflowExecutionScheduleResponse>
    >(
      `${AMAZON_AMC_URL}/schedule/${instanceId}?page=${page}&pageSize=${pageSize}`
    );
  },
  getWorkflowExecutionScheduleById: (
    instanceId: string,
    scheduleId: string
  ) => {
    return axiosInstance.get<IAPIResponse<IAMCScheduleData>>(
      `${AMAZON_AMC_URL}/schedule/${instanceId}/${scheduleId}`
    );
  },
  deleteWorkflowExecutionSchedules: (scheduleId: string) => {
    return axiosInstance.delete<IAPIResponse<null>>(
      `${AMAZON_AMC_URL}/schedule/${scheduleId}`
    );
  },
  updateWorkflowExecutionSchedule: (
    scheduleId: string,
    body: IAMCWorkflowQueryExecutionScheduleBody
  ) => {
    return axiosInstance.put<IAPIResponse<void | null>>(
      `${AMAZON_AMC_URL}/schedule/${scheduleId}`,
      body
    );
  },
  createCustomQuery: (body: IAMCCustomQueryCreateBody) => {
    return axiosInstance.post<IAPIResponse<IAMCCustomQueryCreateResponse>>(
      `${AMAZON_AMC_URL}/query-request/custom`,
      body
    );
  },
  getAMCQueryForWorkflowId: (workflowExecutionId: string) => {
    return axiosInstance.get<IAPIResponse<IAMCQueryData>>(
      `${AMAZON_AMC_URL}/query/${workflowExecutionId}`
    );
  },
  getCustomDataQueries: (instanceId: string) => {
    return axiosInstance.get<IAPIResponse<IAMCCustomQueryData>>(
      `${AMAZON_AMC_URL}/workflow/${instanceId}/custom`
    );
  },
};
