import keywordActionsUtils from '@/utils/keyword-actions.utils';
import {
  AMAZON_KEYWORD_ACTIONS_BASE_URL,
  AMAZON_PRODUCT_ACTIONS_BASE_URL,
  AMAZON_TARGETING_ACTIONS_BASE_URL,
} from 'src/constants';
import { Filters } from 'src/enums/filter.enums';
import { IPaginatedResponse } from 'src/interfaces/advertising/advertising.interface';
import {
  IArchiveSearchTermsPayload,
  IGetArchiveSearchTermData,
  IGetArchiveSearchTermPayload,
  IKeywordActionData,
  IKeywordAdditionBody,
  IKeywordHistoryData,
  IKeywordHistoryResponse,
  IKeywordNegationBody,
  IProductAdditionBody,
  IProductNegationBody,
  ITargetingActionResponse,
  IUpdateTaggingPayload,
  IUpdateTaggingResponse,
} from 'src/interfaces/keyword-actions.interface';
import { IAPIResponse } from 'src/interfaces/service.interface';
import { axiosInstance } from 'src/redux/store';

export const KeywordActionsAmazonService = {
  getKeywordActionRecommendationData: (body: any, signal?: AbortSignal) => {
    const { priority, ...rest } = body;
    return axiosInstance.post<
      IAPIResponse<IPaginatedResponse<IKeywordActionData[]>>
    >(
      `${AMAZON_TARGETING_ACTIONS_BASE_URL}/data?page=${body.page}&pageSize=${body.pageSize}&targetingActionType=${body.targetingActionType}`,
      {
        ...rest,
        priorities: keywordActionsUtils.getFormattedPriorities(priority),
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
        timeout: 5 * 60 * 1000,
        signal,
      }
    );
  },
  updateTagging: (body: IUpdateTaggingPayload) => {
    return axiosInstance.put<IAPIResponse<IUpdateTaggingResponse[]>>(
      `${AMAZON_TARGETING_ACTIONS_BASE_URL}/search-term/tag/update`,
      body,
      {
        timeout: 5 * 60 * 1000,
      }
    );
  },
  addKeywords(body: IKeywordAdditionBody[]) {
    return axiosInstance.post<IAPIResponse<ITargetingActionResponse>>(
      `${AMAZON_KEYWORD_ACTIONS_BASE_URL}/create`,
      {
        payload: body,
      },
      {
        timeout: 5 * 60 * 1000,
      }
    );
  },
  addProducts(body: Array<IProductAdditionBody>) {
    return axiosInstance.post<IAPIResponse<ITargetingActionResponse>>(
      `${AMAZON_PRODUCT_ACTIONS_BASE_URL}/create`,
      {
        payload: body,
      },
      {
        timeout: 5 * 60 * 1000,
      }
    );
  },
  negateKeywords(body: IKeywordNegationBody[]) {
    return axiosInstance.post<IAPIResponse<ITargetingActionResponse>>(
      `${AMAZON_KEYWORD_ACTIONS_BASE_URL}/negate`,
      {
        payload: body,
      },
      {
        timeout: 5 * 60 * 1000,
      }
    );
  },
  negateProducts(body: Array<IProductNegationBody>) {
    return axiosInstance.post<IAPIResponse<ITargetingActionResponse>>(
      `${AMAZON_PRODUCT_ACTIONS_BASE_URL}/negate`,
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
      `${AMAZON_TARGETING_ACTIONS_BASE_URL}/archive`,
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
      `${AMAZON_TARGETING_ACTIONS_BASE_URL}/archive/search-term`,
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
      `${AMAZON_TARGETING_ACTIONS_BASE_URL}/unarchive`,
      {
        payload: body,
      }
    );
  },
  getHistory(body: IKeywordHistoryData) {
    return axiosInstance.post<
      IAPIResponse<IPaginatedResponse<IKeywordHistoryResponse[]>>
    >(
      `${AMAZON_TARGETING_ACTIONS_BASE_URL}/history`,
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
      `${AMAZON_TARGETING_ACTIONS_BASE_URL}/last-sync`
    );
  },
};
