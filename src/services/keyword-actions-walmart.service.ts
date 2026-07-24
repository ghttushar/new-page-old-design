import { WALMART_KEYWORD_ACTIONS_BASE_URL } from 'src/constants';
import { Filters } from 'src/enums/filter.enums';
import { IPaginatedResponse } from 'src/interfaces/advertising/advertising.interface';
import {
  IArchiveSearchTermsPayload,
  IGetArchiveSearchTermData,
  IGetArchiveSearchTermPayload,
  IKeywordActionData,
  IKeywordHistoryData,
  IKeywordHistoryResponse,
  ITargetingActionResponse,
  IUpdateTaggingPayload,
  IUpdateTaggingResponse,
  IWalmartKeywordAdditionBody,
} from 'src/interfaces/keyword-actions.interface';
import { IAPIResponse } from 'src/interfaces/service.interface';
import { axiosInstance } from 'src/redux/store';

export const KeywordActionsWalmartService = {
  getKeywordActionRecommendationData: (body: any, signal?: AbortSignal) => {
    return axiosInstance.post<
      IAPIResponse<IPaginatedResponse<IKeywordActionData[]>>
    >(
      `${WALMART_KEYWORD_ACTIONS_BASE_URL}/data?page=${body.page}&pageSize=${body.pageSize}`,
      {
        ...body,
        searchColumns: [
          Filters.SOURCE_CAMPAIGN,
          Filters.SOURCE_ADGROUP,
          Filters.SOURCE_ADGROUP_ID,
          Filters.SOURCE_CAMPAIGN_ID,
          Filters.TARGET_CAMPAIGN,
          Filters.TARGET_ADGROUP,
          Filters.TARGET_ADGROUP_ID,
          Filters.TARGET_CAMPAIGN_ID,
          Filters.SEARCH_TERM,
        ],
      },
      {
        signal,
        timeout: 5 * 60 * 1000,
      }
    );
  },
  updateTagging: (body: IUpdateTaggingPayload) => {
    return axiosInstance.put<IAPIResponse<IUpdateTaggingResponse[]>>(
      `${WALMART_KEYWORD_ACTIONS_BASE_URL}/search-term/tag/update`,
      body,
      {
        timeout: 5 * 60 * 1000,
      }
    );
  },
  addKeywords(body: IWalmartKeywordAdditionBody[]) {
    return axiosInstance.post<IAPIResponse<ITargetingActionResponse>>(
      `${WALMART_KEYWORD_ACTIONS_BASE_URL}/addition/create`,
      {
        payload: body,
      },
      {
        timeout: 5 * 60 * 1000,
      }
    );
  },
  archiveSearchTerms(body: IArchiveSearchTermsPayload[]) {
    return axiosInstance.post<IAPIResponse<{ count: number }>>(
      `${WALMART_KEYWORD_ACTIONS_BASE_URL}/archive`,
      {
        payload: body,
      },
      {
        timeout: 5 * 60 * 1000,
      }
    );
  },
  getArchiveSearchTerms(body: IGetArchiveSearchTermPayload) {
    return axiosInstance.post<
      IAPIResponse<IPaginatedResponse<IGetArchiveSearchTermData[]>>
    >(
      `${WALMART_KEYWORD_ACTIONS_BASE_URL}/archive/search-term`,
      {
        payload: {
          ...body,
          searchColumns: [
            Filters.ADGROUP_NAME,
            Filters.SEARCH_TERM,
            Filters.MATCH_TYPE,
          ],
        },
      },
      {
        timeout: 5 * 60 * 1000,
      }
    );
  },
  unArchiveSearchTerm(body: Partial<IArchiveSearchTermsPayload>[]) {
    return axiosInstance.post<IAPIResponse<IGetArchiveSearchTermData[]>>(
      `${WALMART_KEYWORD_ACTIONS_BASE_URL}/unarchive`,
      {
        payload: body,
      }
    );
  },
  getHistory(body: IKeywordHistoryData) {
    return axiosInstance.post<
      IAPIResponse<IPaginatedResponse<IKeywordHistoryResponse[]>>
    >(
      `${WALMART_KEYWORD_ACTIONS_BASE_URL}/history`,
      {
        ...body,
        searchColumns: [
          Filters.CAMPAIGN_NAME,
          Filters.ADGROUP_NAME,
          Filters.KEYWORD_TEXT,
        ],
      },
      {
        timeout: 5 * 60 * 1000,
      }
    );
  },
  getLastSyncedTime() {
    return axiosInstance.get<IAPIResponse<string>>(
      `${WALMART_KEYWORD_ACTIONS_BASE_URL}/last-sync`
    );
  },
};
