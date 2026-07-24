import { DaypartingJobStatusEnum } from '@/enums/day-parting.enums';
import {
  NEW_AMAZON_DAYPARTING_BASE_URL,
  NEW_DAYPARTING_BASE_URL,
} from 'src/constants';
import {
  ICreateJobBody,
  IDaypartingCampaignList,
  IDayPartingHistoryPayload,
  IDayPartingHistoryResponse,
  IDaypartingJob,
  IDaypartingMetricsPayload,
  IDaypartingMetricsResponse,
  IDayPartingTriggerResponse,
  IDayPartingUpsertPayload,
  IExistingCampaigns,
  IJobHistoryChanges,
  IJobs,
} from 'src/interfaces/day-parting.interfaces';
import { IAPIResponse } from 'src/interfaces/service.interface';
import { axiosInstance } from 'src/redux/store';

const DayPartingService = {
  getJobsHistory: (body: IDayPartingHistoryPayload) => {
    const filter = {
      searchText: body.searchText,
      searchColumns: body.searchColumns,
      sortCriteria: body.sortCriteria,
    };
    return axiosInstance.post<IAPIResponse<IDayPartingHistoryResponse>>(
      `${NEW_AMAZON_DAYPARTING_BASE_URL}/history?page=${body.page}&pageSize=${body.pageSize}`,
      {
        filter,
      }
    );
  },
  getJobsHistoryChanges: (historyId?: string) => {
    return axiosInstance.get<IAPIResponse<IJobHistoryChanges>>(
      `${NEW_AMAZON_DAYPARTING_BASE_URL}/history/${historyId}`
    );
  },

  getScheduledJobs: (body: IDayPartingHistoryPayload) => {
    const filter = {
      searchText: body.searchText,
      searchColumns: body.searchColumns,
      sortCriteria: body.sortCriteria,
    };
    return axiosInstance.post<IAPIResponse<IDayPartingTriggerResponse>>(
      `${NEW_AMAZON_DAYPARTING_BASE_URL}/trigger?page=${body.page}&pageSize=${body.pageSize}`,
      {
        filter,
      }
    );
  },
  getJobList: () => {
    return axiosInstance.get<IAPIResponse<IJobs[]>>(
      `${NEW_AMAZON_DAYPARTING_BASE_URL}/jobs`
    );
  },

  createJob: (payload: ICreateJobBody) => {
    return axiosInstance.post<IAPIResponse<IDaypartingJob>>(
      `${NEW_DAYPARTING_BASE_URL}/create`,
      payload
    );
  },

  upsertJob: (payload: IDayPartingUpsertPayload) => {
    return axiosInstance.post<IAPIResponse<IDaypartingJob>>(
      `${NEW_DAYPARTING_BASE_URL}/upsert`,
      payload
    );
  },

  updateJobById: (jobId: string, payload: ICreateJobBody) => {
    return axiosInstance.post<IAPIResponse<IDaypartingJob>>(
      `${NEW_DAYPARTING_BASE_URL}/update/${jobId}`,
      payload
    );
  },

  updateJobStatus: (jobId: string, status: DaypartingJobStatusEnum) => {
    return axiosInstance.post<IAPIResponse<IDaypartingJob>>(
      `${NEW_DAYPARTING_BASE_URL}/update-status/${jobId}`,
      { status }
    );
  },

  archiveJob: (jobId: string) => {
    return axiosInstance.post<IAPIResponse<null>>(
      `${NEW_DAYPARTING_BASE_URL}/archive/${jobId}`
    );
  },

  getJobs: () => {
    return axiosInstance.get<IAPIResponse<IDaypartingJob[]>>(
      `${NEW_DAYPARTING_BASE_URL}/jobs`
    );
  },

  getJobById: (jobId: string) => {
    return axiosInstance.get<IAPIResponse<IDaypartingJob>>(
      `${NEW_DAYPARTING_BASE_URL}/job/${jobId}`
    );
  },

  getMetricsData: (payload: IDaypartingMetricsPayload) => {
    return axiosInstance.post<IAPIResponse<IDaypartingMetricsResponse>>(
      `${NEW_DAYPARTING_BASE_URL}/metrics`,
      payload
    );
  },

  checkIsAlreadyPartOfDayParting: (campaignIds: string[]) => {
    return axiosInstance.post<IAPIResponse<Array<IExistingCampaigns>>>(
      `${NEW_DAYPARTING_BASE_URL}/campaigns/part-of-dayparting`,
      campaignIds ? { campaignIds } : {}
    );
  },

  getCampaignData: (signal: AbortSignal, campaignIds?: string[]) => {
    return axiosInstance.post<IAPIResponse<Array<IDaypartingCampaignList>>>(
      `${NEW_DAYPARTING_BASE_URL}/campaign-data`,
      campaignIds ? { campaignIds } : {},
      {
        signal,
      }
    );
  },
};

export default DayPartingService;
