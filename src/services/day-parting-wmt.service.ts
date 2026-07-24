import { NEW_WALMART_DAYPARTING_BASE_URL } from '@/constants';
import { ISortCriteria } from '@/interfaces/advertising/advertising.interface';
import {
  ICreateJobBody,
  IDaypartingCampaignList,
  IDayPartingHistoryPayload,
  IDayPartingHistoryResponse,
  IDayPartingTriggerResponse,
  IDayPartingUpsertPayload,
  IExistingCampaigns,
  IWalmartDaypartingJob,
  IWalmartJobHistoryChanges,
} from '@/interfaces/day-parting.interfaces';
import { IAPIResponse } from '@/interfaces/service.interface';
import { axiosInstance } from '@/redux/store';
import { getFormattedAdType } from '@/utils/day-parting.utils';

const WalmartDayPartingService = {
  getWalmartDayPartingJobs: (adType?: string) => {
    return axiosInstance.post<IAPIResponse<Array<IWalmartDaypartingJob>>>(
      `${NEW_WALMART_DAYPARTING_BASE_URL}/jobs`,
      {
        adType: getFormattedAdType(adType),
      }
    );
  },

  getWalmartDaypartingJobByJobID: (jobId: string) => {
    return axiosInstance.get<IAPIResponse<IWalmartDaypartingJob>>(
      `${NEW_WALMART_DAYPARTING_BASE_URL}/jobs/${jobId}`
    );
  },
  getWalmartCampaignData: (
    signal: AbortSignal,
    adType?: string,
    campaignIds?: string[]
  ) => {
    return axiosInstance.post<IAPIResponse<Array<IDaypartingCampaignList>>>(
      `${NEW_WALMART_DAYPARTING_BASE_URL}/campaigns`,
      campaignIds
        ? { campaignIds, adType: getFormattedAdType(adType) }
        : {
            adType: getFormattedAdType(adType),
          },
      { signal }
    );
  },

  getCampaignsAlreadyInDayParting: (adType: string, campaignIds: string[]) => {
    return axiosInstance.post<IAPIResponse<Array<IExistingCampaigns>>>(
      `${NEW_WALMART_DAYPARTING_BASE_URL}/campaigns/part-of-dayparting`,
      {
        campaignIds,
        adType: getFormattedAdType(adType),
      }
    );
  },

  upsertDayPartingJob: (body: IDayPartingUpsertPayload) => {
    return axiosInstance.post<IAPIResponse<IDaypartingCampaignList>>(
      `${NEW_WALMART_DAYPARTING_BASE_URL}/upsert`,
      body
    );
  },

  updateDayPartingJob: (jobId: string, body?: ICreateJobBody) => {
    return axiosInstance.post<IAPIResponse<IDaypartingCampaignList>>(
      `${NEW_WALMART_DAYPARTING_BASE_URL}/update/${jobId}`,
      body
    );
  },

  archiveDayPartingJob: (jobId: string) => {
    return axiosInstance.post<IAPIResponse<null>>(
      `${NEW_WALMART_DAYPARTING_BASE_URL}/archive/${jobId}`
    );
  },

  updateJobStatus: (jobId: string, status: string) => {
    return axiosInstance.post<IAPIResponse<null>>(
      `${NEW_WALMART_DAYPARTING_BASE_URL}/status/update/${jobId}`,
      {
        status,
      }
    );
  },
  getJobsHistory: (body: IDayPartingHistoryPayload) => {
    const filter = {
      searchText: body.searchText,
      searchColumns: body.searchColumns,
      sortCriteria: body.sortCriteria,
    };
    return axiosInstance.post<IAPIResponse<IDayPartingHistoryResponse>>(
      `${NEW_WALMART_DAYPARTING_BASE_URL}/history?page=${body.page}&pageSize=${body.pageSize}`,
      {
        filter,
        adType: body.adType,
      }
    );
  },

  getJobsHistoryChanges: (historyId?: string) => {
    return axiosInstance.get<IAPIResponse<IWalmartJobHistoryChanges>>(
      `${NEW_WALMART_DAYPARTING_BASE_URL}/history/${historyId}`
    );
  },

  getScheduledJobs: (
    searchText: string,
    searchColumns: string[],
    sortCriteria: ISortCriteria[],
    page: number,
    pageSize: number,
    adType: string
  ) => {
    const filter = {
      searchText,
      searchColumns,
      sortCriteria,
    };
    return axiosInstance.post<IAPIResponse<IDayPartingTriggerResponse>>(
      `${NEW_WALMART_DAYPARTING_BASE_URL}/trigger?page=${page}&pageSize=${pageSize}`,
      {
        filter,
        adType,
      }
    );
  },
};

export default WalmartDayPartingService;
